import crypto from "node:crypto";
import { getCampaignRuntime, json } from "./_campaign-test-db.js";
const stores = {
  red_market: { name: "紅街市", env: "STORE_PASSWORD_RED_MARKET" },
  hac_sa_wan: { name: "黑沙環", env: "STORE_PASSWORD_HAC_SA_WAN" },
  taipa: { name: "氹仔", env: "STORE_PASSWORD_TAIPA" },
  fai_chi_kei: { name: "筷子基", env: "STORE_PASSWORD_FAI_CHI_KEI" },
};

export const STAFF_STORES = Object.freeze(stores);

function secret() {
  const value = process.env[getCampaignRuntime().sessionSecretEnv];
  if (!value || value.length < 24) throw new Error("STAFF_SESSION_SECRET_MISSING");
  return value;
}

export function staffCredentialId(storeId) {
  return `${getCampaignRuntime().staffCredentialPrefix}${storeId.toUpperCase()}`;
}

function sign(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export function authenticateStore(storeId, password) {
  getCampaignRuntime();
  const store = stores[storeId];
  if (!store) return null;
  const expected = process.env[store.env];
  if (!expected || !safeEqual(expected, password)) return null;
  return { storeId, storeName: store.name };
}

export function setStaffSession(res, store) {
  const cookie = getCampaignRuntime().staffCookie;
  const payload = Buffer.from(JSON.stringify({ ...store, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  res.setHeader("Set-Cookie", `${cookie}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
}

export function clearStaffSession(res) {
  const cookie = getCampaignRuntime().staffCookie;
  res.setHeader("Set-Cookie", `${cookie}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

export function requireStaff(req, res) {
  const cookie = getCampaignRuntime().staffCookie;
  const raw = String(req.headers.cookie || "").split(";").map(v => v.trim()).find(v => v.startsWith(`${cookie}=`))?.slice(cookie.length + 1);
  if (!raw) { json(res, 401, { error: "STAFF_LOGIN_REQUIRED" }); return null; }
  const [payload, signature] = raw.split(".");
  if (!payload || !signature || !safeEqual(sign(payload), signature)) { json(res, 401, { error: "STAFF_SESSION_INVALID" }); return null; }
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!stores[session.storeId] || Date.now() > session.exp) throw new Error();
    return session;
  } catch {
    json(res, 401, { error: "STAFF_SESSION_EXPIRED" });
    return null;
  }
}

export { stores };
