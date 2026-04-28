const {
  loadCredentials,
  saveCredentials,
  clearCredentials,
} = require("./credentials");

async function saveSession({ token, refreshToken, user }) {
  const current = (await loadCredentials()) || {};
  return saveCredentials({
    ...current,
    token: token ?? current.token,
    refreshToken: refreshToken ?? current.refreshToken,
    user: user ?? current.user,
  });
}

async function saveToken(token) {
  return saveSession({ token });
}

async function getToken() {
  const credentials = await loadCredentials();
  return credentials?.token || null;
}

async function getRefreshToken() {
  const credentials = await loadCredentials();
  return credentials?.refreshToken || null;
}

async function getUser() {
  const credentials = await loadCredentials();
  return credentials?.user || null;
}

async function clearToken() {
  const credentials = (await loadCredentials()) || {};
  delete credentials.token;
  return saveCredentials(credentials);
}

async function clearSession() {
  return clearCredentials();
}

module.exports = {
  saveSession,
  saveToken,
  getToken,
  getRefreshToken,
  getUser,
  clearToken,
  clearSession,
};