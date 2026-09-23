import { spawn } from "node:child_process";

const forwarded = process.argv.slice(2);
const args = ["dev"];
for (let index = 0; index < forwarded.length; index += 1) {
  const value = forwarded[index];
  if (value === "--host") args.push("--hostname");
  else if (value !== "--strictPort") args.push(value);
}

const child = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["next", ...args], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
