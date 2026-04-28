const ora = require("ora");
const api = require("../../services/api");
const {
  getRefreshToken,
  clearSession,
} = require("../../services/auth.store");

module.exports = async function logout() {
  const spinner = ora("Logging out...").start();

  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }

    await clearSession();
    spinner.succeed("Logged out successfully");
  } catch (err) {
    spinner.fail("Logout failed");
    console.error(err.response?.data || err.message);
  }
};