const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

const credentialsDir = path.join(os.homedir(), ".insighta");
const credentialsFile = path.join(credentialsDir, "credentials.json");

async function ensureDirectory() {
  await fs.mkdir(credentialsDir, { recursive: true });
}

async function loadCredentials() {
  try {
    const raw = await fs.readFile(credentialsFile, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function saveCredentials(credentials) {
  await ensureDirectory();
  await fs.writeFile(
    credentialsFile,
    `${JSON.stringify(credentials, null, 2)}\n`,
    "utf8",
  );
  return credentials;
}

async function clearCredentials() {
  await fs.rm(credentialsFile, { force: true });
}

module.exports = {
  credentialsDir,
  credentialsFile,
  loadCredentials,
  saveCredentials,
  clearCredentials,
};