import { json } from "../_campaign-test-db.js";
import { clearStaffSession, requireStaff } from "../_staff-session.js";

export default async function handler(req, res) {
  if (req.method === "DELETE") { clearStaffSession(res); return json(res, 200, { ok: true }); }
  if (req.method !== "GET") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  const session = requireStaff(req, res);
  if (session) return json(res, 200, { authenticated: true, store: { storeId: session.storeId, storeName: session.storeName } });
}
