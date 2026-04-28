const ora = require("ora");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const { spawn } = require("node:child_process");
const api = require("../../services/api");
const { saveSession } = require("../../services/auth.store");
const { credentialsFile } = require("../../services/credentials");

function openUrl(url) {
  const platform = process.platform;

  if (platform === "win32") {
    const child = spawn("cmd", ["/c", "start", "", url], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return;
  }

  if (platform === "darwin") {
    const child = spawn("open", [url], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return;
  }

  const child = spawn("xdg-open", [url], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

function unwrapSession(payload) {
  if (typeof payload === "string") {
    return { token: payload };
  }

  if (payload && typeof payload === "object") {
    if (payload.data && typeof payload.data === "object") {
      return payload.data;
    }

    return payload;
  }

  return null;
}

async function promptSessionPayload(message) {
  const rl = readline.createInterface({ input, output });
  try {
    return await rl.question(`${message}\n> `);
  } finally {
    rl.close();
  }
}

module.exports = async function login() {
  const spinner = ora("Opening GitHub login in your browser...").start();

  try {
    const res = await api.get("/auth/github", {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const loginUrl = res.headers.location || `${api.defaults.baseURL}/auth/github`;
    openUrl(loginUrl);
    spinner.succeed("Browser opened for GitHub login");

    const sessionPayload = await promptSessionPayload(
      "Paste the JSON response from the login callback page (or paste the token directly):",
    );

    let payload;
    try {
      payload = JSON.parse(sessionPayload);
    } catch {
      payload = sessionPayload;
    }

    const session = unwrapSession(payload);
    if (!session || !session.token) {
      throw new Error("Could not read token from the provided login response.");
    }

    await saveSession({
      token: session.token,
      refreshToken: session.refreshToken,
      user: session.user,
    });

    console.log(`Login successful. Credentials saved to ${credentialsFile}`);
  } catch (err) {
    spinner.fail("Login failed");
    console.error(err.response?.data || err.message);
  }
};