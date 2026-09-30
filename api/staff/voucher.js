import { getPool, json } from "../_campaign-test-db.js";
import { requireStaff } from "../_staff-session.js";

const CAMPAIGN_ID = "tightening_dna_facial_2026";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  const session = requireStaff(req, res); if (!session) return;
  const value = String(req.body?.value || "").trim();
  if (value.length < 6 || value.length > 700) return json(res, 400, { error: "INVALID_CODE" });
  let token = value, displayCode = value.toUpperCase();
  try { const url = new URL(value); token = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || ""); } catch {}
  const found = await getPool().query(
    `SELECT c.name campaign_name,r.name reward_name,p.identifier_last4,
            v.voucher_id,v.display_code,v.status,v.issued_at,v.expires_at,v.redeemed_at,
            s.name redeemed_store,sc.display_name redeemed_by
       FROM vouchers v
       JOIN campaigns c ON c.id=v.campaign_pk
       JOIN campaign_rewards r ON r.id=v.reward_pk
       JOIN campaign_participations p ON p.id=v.participation_pk
       LEFT JOIN redemptions rd ON rd.voucher_pk=v.id AND rd.status='SUCCESS'
       LEFT JOIN campaign_stores s ON s.id=rd.store_pk
       LEFT JOIN campaign_staff_credentials sc ON sc.id=rd.staff_credential_pk
      WHERE c.campaign_id=$1 AND (v.qr_token=$2 OR upper(v.display_code)=$3) LIMIT 1`,
    [CAMPAIGN_ID, token, displayCode]
  );
  if (!found.rowCount) return json(res, 404, { error: "VOUCHER_NOT_FOUND" });
  const row = found.rows[0];
  const status = row.status === "ACTIVE" && new Date() > row.expires_at ? "EXPIRED" : row.status;
  return json(res, 200, { voucher: { voucherId: row.voucher_id, displayCode: row.display_code, status, issuedAt: row.issued_at, expiresAt: row.expires_at, redeemedAt: row.redeemed_at, redeemedStore: row.redeemed_store, redeemedBy: row.redeemed_by, identifierMasked: `••••${row.identifier_last4}`, benefit: row.reward_name, campaign: row.campaign_name }, store: session.storeName });
}
