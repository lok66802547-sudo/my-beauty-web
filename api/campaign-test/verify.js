import { getPool, json, voucherJoinSql } from "../_campaign-test-db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  try {
    const campaignId = String(req.body?.campaignId || "").trim();
    const token = String(req.body?.qrToken || "").trim();
    if (campaignId !== "tightening_dna_facial_2026" || token.length < 32 || token.length > 96) {
      return json(res, 200, { status: "INVALID", preview: true });
    }
    const found = await getPool().query(
      `${voucherJoinSql} WHERE c.campaign_id=$1 AND v.qr_token=$2 LIMIT 1`,
      [campaignId, token]
    );
    if (!found.rowCount) return json(res, 200, { status: "INVALID", preview: true });
    const row = found.rows[0];
    const status = row.status === "ACTIVE" && new Date() > row.expires_at ? "EXPIRED" : row.status;
    return json(res, 200, {
      preview: true,
      status,
      campaign: { campaignId: row.campaign_id, name: row.campaign_name },
      reward: { rewardId: row.reward_id, name: row.reward_name },
      voucher: { displayCode: row.display_code, expiresAt: row.expires_at },
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "BACKEND_ERROR";
    return json(res, 503, { error: code.startsWith("TEST_") || code === "PRODUCTION_ACCESS_FORBIDDEN" ? code : "BACKEND_ERROR" });
  }
}
