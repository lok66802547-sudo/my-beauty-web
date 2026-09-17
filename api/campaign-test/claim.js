import QRCode from "qrcode";
import {
  getPool, identifierHash, json, normalizeIdentifier, opaqueId,
  publicVoucher, qrToken, requestOrigin, voucherJoinSql,
} from "../_campaign-test-db.js";

const CAMPAIGN_ID = "tightening_dna_facial_2026";
const REWARD_ID = "tightening_dna_facial_reward_2026";

async function existing(client, campaignPk, hash) {
  const found = await client.query(
    `${voucherJoinSql} WHERE v.campaign_pk=$1 AND p.identifier_hash=$2 LIMIT 1`,
    [campaignPk, hash]
  );
  return found.rows[0];
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  try {
    const identifier = normalizeIdentifier(req.body?.identifier);
    if (identifier.length < 4 || identifier.length > 64) {
      return json(res, 400, { error: "INVALID_IDENTIFIER" });
    }
    if (req.body?.campaignId && req.body.campaignId !== CAMPAIGN_ID) {
      return json(res, 400, { error: "CAMPAIGN_NOT_ALLOWED" });
    }
    const hash = identifierHash(identifier);
    const client = await getPool().connect();
    let row;
    let duplicate = false;
    try {
      await client.query("BEGIN");
      const config = await client.query(
        `SELECT c.id campaign_pk,c.status,c.claim_start_at,c.claim_end_at,c.redemption_end_at,
                r.id reward_pk,r.status reward_status
         FROM campaigns c JOIN campaign_rewards r ON r.campaign_pk=c.id
         WHERE c.campaign_id=$1 AND r.reward_id=$2 LIMIT 1`,
        [CAMPAIGN_ID, REWARD_ID]
      );
      if (!config.rowCount) throw new Error("TEST_CAMPAIGN_NOT_FOUND");
      const campaign = config.rows[0];
      const now = new Date();
      if (campaign.status !== "ACTIVE" || campaign.reward_status !== "ACTIVE") throw new Error("CAMPAIGN_NOT_ACTIVE");
      if (now < campaign.claim_start_at || now > campaign.claim_end_at) throw new Error("CLAIM_WINDOW_CLOSED");
      row = await existing(client, campaign.campaign_pk, hash);
      if (row) {
        duplicate = true;
      } else {
        const participation = await client.query(
          `INSERT INTO campaign_participations
           (participation_id,campaign_pk,reward_pk,identifier_type,identifier_hash,identifier_last4,member_validation_status)
           VALUES ($1,$2,$3,'member',$4,$5,'REGISTERED_IDENTIFIER') RETURNING id`,
          [opaqueId("PAR"), campaign.campaign_pk, campaign.reward_pk, hash, identifier.slice(-4).padStart(4, "•")]
        );
        await client.query(
          `INSERT INTO vouchers
           (voucher_id,campaign_pk,reward_pk,participation_pk,display_code,qr_token,status,expires_at)
           VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE',$7)`,
          [opaqueId("VCH"), campaign.campaign_pk, campaign.reward_pk, participation.rows[0].id,
           opaqueId("EC", 5), qrToken(), campaign.redemption_end_at]
        );
        row = await existing(client, campaign.campaign_pk, hash);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      if (error?.code === "23505") {
        const campaign = await client.query("SELECT id FROM campaigns WHERE campaign_id=$1", [CAMPAIGN_ID]);
        row = campaign.rowCount ? await existing(client, campaign.rows[0].id, hash) : null;
        duplicate = !!row;
      } else throw error;
    } finally {
      client.release();
    }
    if (!row) throw new Error("CLAIM_RESULT_MISSING");
    const payload = publicVoucher(row, requestOrigin(req), duplicate);
    payload.voucher.qrImageDataUrl = await QRCode.toDataURL(payload.voucher.verifyUrl, {
      errorCorrectionLevel: "M", margin: 1, width: 360,
      color: { dark: "#332a38", light: "#ffffff" },
    });
    return json(res, duplicate ? 200 : 201, payload);
  } catch (error) {
    const code = error instanceof Error ? error.message : "BACKEND_ERROR";
    const safe = ["TEST_ENV_NOT_CONFIGURED","PRODUCTION_ACCESS_FORBIDDEN","TEST_DATABASE_URL_MISSING",
      "TEST_DATABASE_HOST_REJECTED","TEST_CAMPAIGN_NOT_FOUND","CAMPAIGN_NOT_ACTIVE","CLAIM_WINDOW_CLOSED"].includes(code)
      ? code : "BACKEND_ERROR";
    return json(res, safe === "BACKEND_ERROR" ? 500 : 503, { error: safe });
  }
}
