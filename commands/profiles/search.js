const ora = require("ora");
const { searchProfiles } = require("../../services/profile.client");
const { renderProfilesTable } = require("../../services/cli-ui");

module.exports = async function searchProfilesCommand(queryOrOptions = {}, maybeOptions = {}) {
  const spinner = ora('Searching profiles...').start();

  // Support two invocation forms:
  // 1. search(queryString, options)
  // 2. search(options)
  let options;
  if (typeof queryOrOptions === 'string') {
    options = { ...(maybeOptions || {}), q: queryOrOptions };
  } else {
    options = queryOrOptions || {};
  }

  try {
    const response = await searchProfiles(options);
    const profiles = response.data || [];

    spinner.succeed(`Found ${profiles.length} profile(s)`);

    if (profiles.length === 0) {
      console.log('No profiles found.');
      return;
    }

    console.log(renderProfilesTable(profiles));
    if (response.total !== undefined) {
      console.log(
        `Page ${response.page} of ${response.total_pages || 1} | Total: ${response.total}`,
      );
    }
  } catch (err) {
    spinner.fail('Failed to search profiles');
    console.error(err.response?.data || err.message);
  }
};