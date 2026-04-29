const ora = require('ora');
const { createProfile } = require('../../services/profile.client');
const { renderProfileDetails } = require('../../services/cli-ui');

module.exports = async function createProfileCommand(options = {}) {
  const spinner = ora('Creating profile...').start();

  try {
    const response = await createProfile(options);
    spinner.succeed('Profile created');

    const profile = response.data || response;
    console.log(renderProfileDetails(profile));
  } catch (err) {
    spinner.fail('Failed to create profile');
    console.error(err.response?.data || err.message);
  }
};
