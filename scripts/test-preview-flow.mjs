import { readFile } from "node:fs/promises";

const base = process.argv[2] || "http://localhost:4173";
const passwordFile = process.argv[3];
if (!passwordFile) throw new Error("STAFF_PASSWORD_FILE_REQUIRED");
const passwordText = await readFile(passwordFile, "utf8");
const storeNames = {
  red_market: "STORE_PASSWORD_RED_MARKET",
  hac_sa_wan: "STORE_PASSWORD_HAC_SA_WAN",
  taipa: "STORE_PASSWORD_TAIPA",
  fai_chi_kei: "STORE_PASSWORD_FAI_CHI_KEI",
};
const passwords = {};
for (const [storeId, name] of Object.entries(storeNames)) {
  const match = passwordText.match(new RegExp(`${name}\\s*=\\s*(\\S+)`));
  if (!match) throw new Error(`${name}_NOT_FOUND`);
  passwords[storeId] = match[1];
}

const checks = [];
function check(name, condition, detail = "") {
  if (!condition) throw new Error(`${name}: ${detail || "FAILED"}`);
  checks.push({ name, status: "PASS", detail });
}
async function request(path, { method = "GET", body, cookie } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json") ? await response.json() : await response.arrayBuffer();
  return { response, data, cookie: response.headers.get("set-cookie")?.split(";")[0] };
}

const identifier = `TESTSTAFF${Date.now()}`;
const claim1 = await request("/api/campaign-test/claim", { method: "POST", body: { campaignId: "tightening_dna_facial_2026", identifier } });
check("TEST 01 Claim", claim1.response.status === 201 && !claim1.data.duplicate);
check("TEST 02 Unique Voucher", Boolean(claim1.data.voucher?.voucherId && claim1.data.voucher?.displayCode));
check("TEST 03 QR", Boolean(claim1.data.voucher?.verifyUrl && claim1.data.voucher?.qrImageDataUrl));

const claim2 = await request("/api/campaign-test/claim", { method: "POST", body: { campaignId: "tightening_dna_facial_2026", identifier } });
check("Duplicate Claim", claim2.response.status === 200 && claim2.data.duplicate && claim2.data.voucher.voucherId === claim1.data.voucher.voucherId);

const mine = await request("/api/campaign-test/my-voucher", { method: "POST", body: { identifier } });
check("TEST 04 My Voucher", mine.response.status === 200 && mine.data.voucher.voucherId === claim1.data.voucher.voucherId && mine.data.voucher.status === "ACTIVE");

const unauthRecords = await request("/api/staff/records");
const unauthMaterials = await request("/api/staff/materials");
check("TEST 05 Staff protection", unauthRecords.response.status === 401 && unauthMaterials.response.status === 401);

const sessions = {};
for (const storeId of Object.keys(storeNames)) {
  const login = await request("/api/staff/login", { method: "POST", body: { storeId, password: passwords[storeId] } });
  check(`TEST 06 Login ${storeId}`, login.response.status === 200 && login.data.store?.storeId === storeId && Boolean(login.cookie));
  sessions[storeId] = login.cookie;
}

const cookie = sessions.taipa;
const lookupQr = await request("/api/staff/voucher", { method: "POST", cookie, body: { value: claim1.data.voucher.verifyUrl } });
check("TEST 07 QR Lookup", lookupQr.response.status === 200 && lookupQr.data.voucher.status === "ACTIVE");
check("TEST 08 Lookup does not redeem", lookupQr.data.voucher.redeemedAt == null);

const redeem = await request("/api/staff/redeem", { method: "POST", cookie, body: { voucherId: claim1.data.voucher.voucherId } });
check("TEST 09 Redemption", redeem.response.status === 200 && redeem.data.status === "REDEEMED");
check("TEST 10 Store and time", redeem.data.store === "氹仔" && Boolean(redeem.data.redeemedAt));

const duplicateRedeem = await request("/api/staff/redeem", { method: "POST", cookie, body: { voucherId: claim1.data.voucher.voucherId } });
const lookupRedeemed = await request("/api/staff/voucher", { method: "POST", cookie, body: { value: claim1.data.voucher.displayCode } });
check("TEST 11 Duplicate Redeem", duplicateRedeem.response.status === 409 && duplicateRedeem.data.error === "ALREADY_REDEEMED" && lookupRedeemed.data.voucher.status === "REDEEMED" && lookupRedeemed.data.voucher.redeemedStore === "氹仔");
check("TEST 12 Manual Code", lookupRedeemed.response.status === 200 && lookupRedeemed.data.voucher.displayCode === claim1.data.voucher.displayCode);

const materials = await request("/api/staff/materials", { cookie });
const materialImage = await request("/api/staff/materials?id=offer1", { cookie });
check("TEST 13 Protected Materials", materials.response.status === 200 && materials.data.materials.length === 3 && materialImage.response.status === 200 && materialImage.data.byteLength > 1000);

const records = await request("/api/staff/records", { cookie });
const audit = records.data.records.find(record => record.displayCode === claim1.data.voucher.displayCode);
check("Neon TEST Audit", records.response.status === 200 && audit?.status === "REDEEMED" && audit?.redeemedStore === "氹仔" && Boolean(audit?.redemptionId));

const mineAfter = await request("/api/campaign-test/my-voucher", { method: "POST", body: { identifier } });
check("My Voucher after redeem", mineAfter.response.status === 200 && mineAfter.data.voucher.status === "REDEEMED" && mineAfter.data.voucher.redeemedStore === "氹仔");

console.log(JSON.stringify({ overall: "PASS", checks }, null, 2));
