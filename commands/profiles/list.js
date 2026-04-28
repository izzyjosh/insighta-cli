const ora = require("ora");
const { listProfiles } = require("../../services/profile.client");
const { renderProfilesTable } = require("../../services/cli-ui");

module.exports = async function listProfilesCommand(options = {}) {
  const spinner = ora("Fetching profiles...").start();

  try {
    const response = await listProfiles(options);
    const profiles = response.data || [];

    spinner.succeed(`Loaded ${profiles.length} profile(s)`);

    if (profiles.length === 0) {
      console.log("No profiles found.");
      return;
    }

    console.log(renderProfilesTable(profiles));
    if (response.total !== undefined) {
      console.log(
        `Page ${response.page} of ${response.total_pages || 1} | Total: ${response.total}`,
      );
    }
  } catch (err) {
    spinner.fail("Failed to fetch profiles");
    console.error(err.response?.data || err.message);
  }
};