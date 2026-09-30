import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { readFile, unlink } from "node:fs/promises";
import { parseEnv } from "node:util";

const [envFile, passwordFile] = process.argv.slice(2);
if (!envFile || !passwordFile) throw new Error("PREVIEW_ENV_AND_PASSWORD_FILES_REQUIRED");
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
const child = spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", "npx vercel dev --listen 4173"], {
  cwd: process.cwd(), stdio: "inherit",
  env: { ...process.env, ...values, VERCEL_ENV: "preview" },
});
child.on("exit", code => process.exitCode = code ?? 1);
