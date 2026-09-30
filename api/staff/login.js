import { json } from "../_campaign-test-db.js";
import { authenticateStore, setStaffSession } from "../_staff-session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  try {
    const store = authenticateStore(String(req.body?.storeId || ""), String(req.body?.password || ""));
    if (!store) return json(res, 401, { error: "INVALID_STORE_PASSWORD" });
    setStaffSession(res, store);
    return json(res, 200, { ok: true, store });
  } catch (error) {
    return json(res, 503, { error: error instanceof Error ? error.message : "STAFF_LOGIN_FAILED" });
  }
}
