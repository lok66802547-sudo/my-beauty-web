import crypto from "node:crypto";
import { readFile, unlink } from "node:fs/promises";
import { parseEnv } from "node:util";

const envFile = process.argv[2];
const passwordFile = process.argv[3];
if (!envFile) throw new Error("PREVIEW_ENV_FILE_REQUIRED");
if (!passwordFile) throw new Error("STAFF_PASSWORD_FILE_REQUIRED");

const values = parseEnv(await readFile(envFile, "utf8"));
await unlink(envFile);
const passwordText = await readFile(passwordFile, "utf8");
for (const name of [
  "STORE_PASSWORD_RED_MARKET", "STORE_PASSWORD_HAC_SA_WAN",
  "STORE_PASSWORD_TAIPA", "STORE_PASSWORD_FAI_CHI_KEI",
]) {
  const match = passwordText.match(new RegExp(`${name}\\s*=\\s*(\\S+)`));
  if (!match) throw new Error(`${name}_NOT_FOUND`);
  values[name] = match[1];
}
values.STAFF_SESSION_SECRET_TEST = crypto.randomBytes(48).toString("base64url");
Object.assign(process.env, values, { VERCEL_ENV: "preview" });

await import("./seed-staff-preview-test.mjs");
