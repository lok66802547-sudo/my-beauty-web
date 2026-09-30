import { readFile } from "node:fs/promises";
import { json } from "../_campaign-test-db.js";
import { requireStaff } from "../_staff-session.js";

const materials = {
  offer1: {
    file: new URL("../../private-staff-assets/internal-offers-01.png", import.meta.url),
    type: "image/png",
    alt: "皇牌面部護理抗衰雙體驗內部資料",
    caption: "皇牌面部護理・抗衰雙體驗",
  },
  offer2: {
    file: new URL("../../private-staff-assets/internal-offers-02.jpg", import.meta.url),
    type: "image/jpeg",
    alt: "皇牌抗衰套餐及 HIFU 會員福利內部資料",
    caption: "皇牌抗衰套餐・HIFU 會員福利",
  },
  offer3: {
    file: new URL("../../private-staff-assets/internal-offers-03.jpg", import.meta.url),
    type: "image/jpeg",
    alt: "皇牌身體護理內部資料",
    caption: "皇牌身體護理・冬蔭覺醒 SPA",
  },
};

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "METHOD_NOT_ALLOWED" });
  const session = requireStaff(req, res);
  if (!session) return;
  const id = String(req.query?.id || "");
  if (!id) {
    return json(res, 200, {
      materials: Object.entries(materials).map(([materialId, item]) => ({
        id: materialId, alt: item.alt, caption: item.caption,
      })),
    });
  }
  const material = materials[id];
  if (!material) return json(res, 404, { error: "MATERIAL_NOT_FOUND" });
  const body = await readFile(material.file);
  res.statusCode = 200;
  res.setHeader("Content-Type", material.type);
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(body);
}
