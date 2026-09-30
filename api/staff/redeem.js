import crypto from "node:crypto";
import { getPool, json } from "../_campaign-test-db.js";
import { requireStaff, staffCredentialId } from "../_staff-session.js";

const CAMPAIGN_ID = "tightening_dna_facial_2026";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  const session = requireStaff(req, res); if (!session) return;
  const voucherId = String(req.body?.voucherId || "").trim();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const voucher = await client.query(
      `SELECT v.id,v.campaign_pk,v.status,v.expires_at,v.redeemed_at
         FROM vouchers v JOIN campaigns c ON c.id=v.campaign_pk
        WHERE v.voucher_id=$1 AND c.campaign_id=$2 FOR UPDATE OF v`,
      [voucherId, CAMPAIGN_ID]
    );
    if (!voucher.rowCount) { await client.query("ROLLBACK"); return json(res, 404, { error: "VOUCHER_NOT_FOUND" }); }
    const v = voucher.rows[0];
    if (v.status === "REDEEMED") { await client.query("ROLLBACK"); return json(res, 409, { error: "ALREADY_REDEEMED", redeemedAt: v.redeemed_at }); }
    if (v.status !== "ACTIVE" || new Date() > v.expires_at) { await client.query("ROLLBACK"); return json(res, 409, { error: v.status === "CANCELLED" ? "CANCELLED" : "EXPIRED" }); }
    const store = await client.query(`SELECT id,name FROM campaign_stores WHERE store_id=$1 AND active=true LIMIT 1`, [session.storeId]);
    if (!store.rowCount) throw new Error("STORE_NOT_CONFIGURED");
    const staff = await client.query(
      `SELECT id,display_name FROM campaign_staff_credentials
        WHERE store_pk=$1 AND active=true AND credential_id=$2 LIMIT 1`,
      [store.rows[0].id, staffCredentialId(session.storeId)]
    );
    if (!staff.rowCount) throw new Error("STAFF_CREDENTIAL_NOT_CONFIGURED");
    const now = new Date();
    const redemptionId = `RDM-${crypto.randomBytes(12).toString("base64url").toUpperCase()}`;
    await client.query(`INSERT INTO redemptions (redemption_id,voucher_pk,campaign_pk,store_pk,staff_credential_pk,status,redeemed_at) VALUES ($1,$2,$3,$4,$5,'SUCCESS',$6)`, [redemptionId,v.id,v.campaign_pk,store.rows[0].id,staff.rows[0].id,now]);
    await client.query(`UPDATE vouchers SET status='REDEEMED',redeemed_at=$1,updated_at=$1 WHERE id=$2`, [now,v.id]);
    await client.query("COMMIT");
    return json(res, 200, {
      status: "REDEEMED", redemptionId, redeemedAt: now,
      store: store.rows[0].name, redeemedBy: staff.rows[0].display_name,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error?.code === "23505") return json(res, 409, { error: "ALREADY_REDEEMED" });
    return json(res, 503, { error: error instanceof Error ? error.message : "REDEEM_FAILED" });
  } finally { client.release(); }
}
