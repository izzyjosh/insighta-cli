const ora = require("ora");
const { getProfile } = require("../../services/profile.client");
const { renderProfileDetails } = require("../../services/cli-ui");

module.exports = async function getProfileCommand(id) {
  const spinner = ora("Fetching profile...").start();

  try {
    const response = await getProfile(id);
    spinner.succeed("Profile loaded");
    console.log(renderProfileDetails(response.data || response));
  } catch (err) {
    spinner.fail("Failed to fetch profile");
    console.error(err.response?.data || err.message);
  }
};