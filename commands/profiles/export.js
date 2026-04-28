const ora = require("ora");
const fs = require("node:fs/promises");
const path = require("node:path");
const { exportProfiles } = require("../../services/profile.client");

function parseFileName(contentDisposition) {
  if (!contentDisposition) {
    return null;
  }

  const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return match ? match[1] : null;
}

module.exports = async function exportProfilesCommand(options = {}) {
  const spinner = ora("Exporting profiles to CSV...").start();

  try {
    const response = await exportProfiles(options);
    const fileName =
      parseFileName(response.headers["content-disposition"]) ||
      `profiles_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
    const filePath = path.join(process.cwd(), fileName);

    await fs.writeFile(filePath, response.csv, "utf8");

    spinner.succeed(`CSV saved to ${filePath}`);
  } catch (err) {
    spinner.fail("Failed to export profiles");
    console.error(err.response?.data || err.message);
  }
};