const Table = require("cli-table3");

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().replace("T", " ").replace(".000Z", " UTC");
}

function renderProfilesTable(profiles = []) {
  const table = new Table({
    head: ["ID", "Name", "Gender", "Age", "Country", "Created At"],
    wordWrap: true,
    colWidths: [24, 20, 12, 8, 20, 28],
  });

  profiles.forEach((profile) => {
    table.push([
      profile.id,
      profile.name,
      profile.gender,
      profile.age,
      profile.country_name,
      formatDate(profile.created_at),
    ]);
  });

  return table.toString();
}

function renderProfileDetails(profile) {
  const table = new Table({
    head: ["Field", "Value"],
    wordWrap: true,
    colWidths: [24, 50],
  });

  Object.entries(profile).forEach(([field, value]) => {
    table.push([field, formatDate(value)]);
  });

  return table.toString();
}

module.exports = {
  formatDate,
  renderProfilesTable,
  renderProfileDetails,
};