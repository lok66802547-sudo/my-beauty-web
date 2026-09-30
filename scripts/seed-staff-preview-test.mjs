import crypto from "node:crypto";
import { assertTestRuntime, getPool } from "../api/_campaign-test-db.js";
import { STAFF_STORES } from "../api/_staff-session.js";

assertTestRuntime();
const pool = getPool();

try {
  for (const [storeId, store] of Object.entries(STAFF_STORES)) {
    const password = process.env[store.env];
    if (!password) throw new Error(`${store.env}_MISSING`);
    const pinHash = crypto.createHash("sha256").update(password).digest("hex");
    const savedStore = await pool.query(
      `INSERT INTO campaign_stores (store_id,name,active)
       VALUES ($1,$2,true)
       ON CONFLICT (store_id) DO UPDATE SET name=EXCLUDED.name,active=true,updated_at=now()
       RETURNING id`,
      [storeId, store.name]
    );
    await pool.query(
      `INSERT INTO campaign_staff_credentials
       (credential_id,display_name,pin_hash,store_pk,role,active)
       VALUES ($1,$2,$3,$4,'STAFF',true)
       ON CONFLICT (credential_id) DO UPDATE
       SET display_name=EXCLUDED.display_name,pin_hash=EXCLUDED.pin_hash,store_pk=EXCLUDED.store_pk,active=true,updated_at=now()`,
      [`PREVIEW_STAFF_${storeId.toUpperCase()}`, `${store.name} TEST Staff`, pinHash, savedStore.rows[0].id]
    );
  }
  console.log("Four TEST/Preview stores and audit credentials are ready.");
} finally {
  await pool.end();
}
