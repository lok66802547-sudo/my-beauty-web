import QRCode from "qrcode";
import { getPool, identifierHash, json, normalizeIdentifier, requestOrigin } from "../_campaign-test-db.js";

const CAMPAIGN_ID = "tightening_dna_facial_2026";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  try {
    const identifier = normalizeIdentifier(req.body?.identifier);
    if (identifier.length < 4 || identifier.length > 64) return json(res, 400, { error: "INVALID_IDENTIFIER" });
    const found = await getPool().query(
      `SELECT c.campaign_id,c.name campaign_name,r.name reward_name,
              v.voucher_id,v.display_code,v.qr_token,v.status,v.issued_at,v.expires_at,v.redeemed_at,
              s.name redeemed_store
         FROM vouchers v
         JOIN campaigns c ON c.id=v.campaign_pk
         JOIN campaign_rewards r ON r.id=v.reward_pk
         JOIN campaign_participations p ON p.id=v.participation_pk
         LEFT JOIN redemptions rd ON rd.voucher_pk=v.id AND rd.status='SUCCESS'
         LEFT JOIN campaign_stores s ON s.id=rd.store_pk
        WHERE c.campaign_id=$1 AND p.identifier_hash=$2 LIMIT 1`,
      [CAMPAIGN_ID, identifierHash(identifier)]
    );
    if (!found.rowCount) return json(res, 404, { error: "VOUCHER_NOT_FOUND" });
    const row = found.rows[0];
    const status = row.status === "ACTIVE" && new Date() > row.expires_at ? "EXPIRED" : row.status;
    const verifyUrl = `${requestOrigin(req)}/campaign/${encodeURIComponent(row.campaign_id)}/verify/${encodeURIComponent(row.qr_token)}`;
    const qrImageDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "M", margin: 1, width: 360,
      color: { dark: "#332a38", light: "#ffffff" },
    });
    return json(res, 200, {
      preview: true,
      voucher: {
        voucherId: row.voucher_id, displayCode: row.display_code, status,
        issuedAt: row.issued_at, expiresAt: row.expires_at,
        redeemedAt: row.redeemed_at, redeemedStore: row.redeemed_store,
        benefit: row.reward_name, campaign: row.campaign_name, qrImageDataUrl,
      },
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "BACKEND_ERROR";
    return json(res, 503, { error: code.startsWith("TEST_") || code === "PRODUCTION_ACCESS_FORBIDDEN" ? code : "BACKEND_ERROR" });
  }
}
