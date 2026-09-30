import crypto from "node:crypto";
import pg from "pg";

const { Pool } = pg;
let pool;

function normalizeDatabaseUrl(raw, label) {
  if (!raw) throw new Error(`${label}_MISSING`);
  const normalized = raw.trim().replace(/^["']|["']$/g, "").replace(/&amp;/g, "&").replace(/\\([_@])/g, "$1");
  let parsed;
  try { parsed = new URL(normalized); } catch { throw new Error(`${label}_FORMAT_INVALID`); }
  if (!['postgresql:', 'postgres:'].includes(parsed.protocol) || !parsed.hostname.endsWith('.neon.tech')) {
    throw new Error(`${label}_HOST_REJECTED`);
  }
  return normalized;
}

export function getCampaignRuntime() {
  const vercelEnv = process.env.VERCEL_ENV || "development";
  const databaseEnv = process.env.CAMPAIGN_DB_ENV;
  if (vercelEnv === "production") {
    if (databaseEnv !== "production") throw new Error("CAMPAIGN_ENVIRONMENT_MISMATCH");
    return {
      mode: "production",
      databaseUrl: normalizeDatabaseUrl(process.env.PRODUCTION_DATABASE_URL, "PRODUCTION_DATABASE_URL"),
      sessionSecretEnv: "STAFF_SESSION_SECRET",
      staffCookie: "ec_staff",
      staffCredentialPrefix: "PRODUCTION_STAFF_",
    };
  }
  if (vercelEnv === "preview" || vercelEnv === "development") {
    if (databaseEnv !== "test") throw new Error("CAMPAIGN_ENVIRONMENT_MISMATCH");
    return {
      mode: "test",
      databaseUrl: normalizeDatabaseUrl(process.env.TEST_DATABASE_URL, "TEST_DATABASE_URL"),
      sessionSecretEnv: "STAFF_SESSION_SECRET_TEST",
      staffCookie: "ec_staff_preview",
      staffCredentialPrefix: "PREVIEW_STAFF_",
    };
  }
  throw new Error("CAMPAIGN_RUNTIME_UNSUPPORTED");
}

export function assertTestRuntime() {
  const runtime = getCampaignRuntime();
  if (runtime.mode !== "test") throw new Error("TEST_ENV_NOT_CONFIGURED");
  return runtime.databaseUrl;
}

export function getPool() {
  if (!pool) pool = new Pool({ connectionString: getCampaignRuntime().databaseUrl, max: 4 });
  return pool;
}

export function normalizeIdentifier(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function identifierHash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function opaqueId(prefix, bytes = 12) {
  return `${prefix}-${crypto.randomBytes(bytes).toString("base64url").toUpperCase()}`;
}

export function qrToken() {
  return crypto.randomBytes(36).toString("base64url");
}

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function requestOrigin(req) {
  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0];
  if (!host) throw new Error("REQUEST_HOST_MISSING");
  return `${proto}://${host}`;
}

export function publicVoucher(row, origin, duplicate = false) {
  const verifyUrl = `${origin}/campaign/${encodeURIComponent(row.campaign_id)}/verify/${encodeURIComponent(row.qr_token)}`;
  return {
    duplicate,
    memberValidationStatus: row.member_validation_status,
    campaign: { campaignId: row.campaign_id, name: row.campaign_name },
    reward: { rewardId: row.reward_id, name: row.reward_name },
    voucher: {
      voucherId: row.voucher_id,
      displayCode: row.display_code,
      status: row.status,
      expiresAt: row.expires_at,
      verifyUrl,
    },
  };
}

export const voucherJoinSql = `
  SELECT c.campaign_id,c.name campaign_name,r.reward_id,r.name reward_name,
         p.member_validation_status,v.voucher_id,v.display_code,v.qr_token,
         v.status,v.expires_at
  FROM vouchers v
  JOIN campaigns c ON c.id=v.campaign_pk
  JOIN campaign_rewards r ON r.id=v.reward_pk
  JOIN campaign_participations p ON p.id=v.participation_pk
`;
