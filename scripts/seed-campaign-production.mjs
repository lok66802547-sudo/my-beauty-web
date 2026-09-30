import crypto from "node:crypto";
import { getCampaignRuntime, getPool } from "../api/_campaign-test-db.js";
import { STAFF_STORES, staffCredentialId } from "../api/_staff-session.js";

const runtime = getCampaignRuntime();
if (runtime.mode !== "production") throw new Error("PRODUCTION_RUNTIME_REQUIRED");

const campaign = {
  campaignId: "tightening_dna_facial_2026",
  name: "EC Beauty Tightening DNA",
  status: "ACTIVE",
  claimStartAt: "2026-09-17T00:12:59.856Z",
  claimEndAt: "2026-10-17T01:12:59.856Z",
  redemptionEndAt: "2026-11-16T01:12:59.856Z",
  pageSource: "https://ec-beauty-new.vercel.app/tightening-dna-preview-ecb2026/",
  qrBaseUrl: "https://ec-beauty-new.vercel.app",
};
const reward = {
  rewardId: "tightening_dna_facial_reward_2026",
  name: "會員免費補水 Facial × 1（正式名稱待確認）",
  status: "ACTIVE",
};

function same(row, expected) {
  return Object.entries(expected).every(([key, value]) => {
    const actual = row[key];
    if (value instanceof Date || actual instanceof Date) return new Date(actual).toISOString() === new Date(value).toISOString();
    return actual === value;
  });
}

async function insertOrCompare(client, selectSql, selectArgs, insertSql, insertArgs, expected, label) {
  const found = await client.query(selectSql, selectArgs);
  if (!found.rowCount) return (await client.query(insertSql, insertArgs)).rows[0];
  if (!same(found.rows[0], expected)) throw new Error(`${label}_MISMATCH`);
  return found.rows[0];
}

const pool = getPool();
const client = await pool.connect();
try {
  await client.query("BEGIN");
  const campaignRow = await insertOrCompare(
    client,
    `SELECT id,campaign_id,name,status,claim_start_at,claim_end_at,redemption_end_at,page_source,qr_base_url
       FROM campaigns WHERE campaign_id=$1`,
    [campaign.campaignId],
    `INSERT INTO campaigns
       (campaign_id,name,status,claim_start_at,claim_end_at,redemption_end_at,page_source,qr_base_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING id,campaign_id,name,status,claim_start_at,claim_end_at,redemption_end_at,page_source,qr_base_url`,
    [campaign.campaignId,campaign.name,campaign.status,campaign.claimStartAt,campaign.claimEndAt,campaign.redemptionEndAt,campaign.pageSource,campaign.qrBaseUrl],
    { campaign_id: campaign.campaignId,name: campaign.name,status: campaign.status,claim_start_at: new Date(campaign.claimStartAt),claim_end_at: new Date(campaign.claimEndAt),redemption_end_at: new Date(campaign.redemptionEndAt),page_source: campaign.pageSource,qr_base_url: campaign.qrBaseUrl },
    "CAMPAIGN"
  );

  await insertOrCompare(
    client,
    `SELECT id,reward_id,campaign_pk,name,status FROM campaign_rewards WHERE reward_id=$1`,
    [reward.rewardId],
    `INSERT INTO campaign_rewards (reward_id,campaign_pk,name,status)
     VALUES ($1,$2,$3,$4) RETURNING id,reward_id,campaign_pk,name,status`,
    [reward.rewardId,campaignRow.id,reward.name,reward.status],
    { reward_id: reward.rewardId,campaign_pk: campaignRow.id,name: reward.name,status: reward.status },
    "REWARD"
  );

  for (const [storeId, store] of Object.entries(STAFF_STORES)) {
    const password = process.env[store.env];
    if (!password) throw new Error(`${store.env}_MISSING`);
    const storeRow = await insertOrCompare(
      client,
      `SELECT id,store_id,name,active FROM campaign_stores WHERE store_id=$1`,
      [storeId],
      `INSERT INTO campaign_stores (store_id,name,active) VALUES ($1,$2,true)
       RETURNING id,store_id,name,active`,
      [storeId,store.name],
      { store_id: storeId,name: store.name,active: true },
      `STORE_${storeId.toUpperCase()}`
    );
    const credentialId = staffCredentialId(storeId);
    const pinHash = crypto.createHash("sha256").update(password).digest("hex");
    await insertOrCompare(
      client,
      `SELECT id,credential_id,display_name,pin_hash,store_pk,role,active
         FROM campaign_staff_credentials WHERE credential_id=$1`,
      [credentialId],
      `INSERT INTO campaign_staff_credentials
         (credential_id,display_name,pin_hash,store_pk,role,active)
       VALUES ($1,$2,$3,$4,'STAFF',true)
       RETURNING id,credential_id,display_name,pin_hash,store_pk,role,active`,
      [credentialId,`${store.name} Staff`,pinHash,storeRow.id],
      { credential_id: credentialId,display_name: `${store.name} Staff`,pin_hash: pinHash,store_pk: storeRow.id,role: "STAFF",active: true },
      `STAFF_${storeId.toUpperCase()}`
    );
  }
  await client.query("COMMIT");
  console.log("Production campaign, reward, stores, and staff credentials are verified.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
