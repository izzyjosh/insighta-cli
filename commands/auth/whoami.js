const { getUser, getToken } = require("../../services/auth.store");

module.exports = async function whoami() {
  const user = await getUser();

  if (user) {
    console.log(JSON.stringify(user, null, 2));
    return;
  }

  if (await getToken()) {
    console.log("Logged in, but no cached user profile was saved.");
    return;
  }

  console.log("Not logged in.");
};