import { getPool, json } from "../_campaign-test-db.js";
import { requireStaff } from "../_staff-session.js";

const CAMPAIGN_ID = "tightening_dna_facial_2026";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  const session = requireStaff(req, res);
  if (!session) return;
  const result = await getPool().query(
    `SELECT p.identifier_last4,c.name campaign_name,r.name reward_name,
            v.display_code,v.status,v.issued_at,v.expires_at,v.redeemed_at,
            rd.redemption_id,s.name redeemed_store,sc.display_name redeemed_by
       FROM vouchers v
       JOIN campaigns c ON c.id=v.campaign_pk
       JOIN campaign_rewards r ON r.id=v.reward_pk
       JOIN campaign_participations p ON p.id=v.participation_pk
       LEFT JOIN redemptions rd ON rd.voucher_pk=v.id AND rd.status='SUCCESS'
       LEFT JOIN campaign_stores s ON s.id=rd.store_pk
       LEFT JOIN campaign_staff_credentials sc ON sc.id=rd.staff_credential_pk
      WHERE c.campaign_id=$1
      ORDER BY v.issued_at DESC LIMIT 100`,
    [CAMPAIGN_ID]
  );
  return json(res, 200, {
    records: result.rows.map(row => ({
      identifierMasked: `••••${row.identifier_last4}`,
      campaign: row.campaign_name, benefit: row.reward_name,
      displayCode: row.display_code,
      status: row.status === "ACTIVE" && new Date() > row.expires_at ? "EXPIRED" : row.status,
      issuedAt: row.issued_at, expiresAt: row.expires_at,
      redeemedAt: row.redeemed_at, redeemedStore: row.redeemed_store,
      redeemedBy: row.redeemed_by, redemptionId: row.redemption_id,
    })),
  });
}
