const api = require("./api");

function buildProfileQuery(options = {}) {
  const query = {};

  [
    "gender",
    "age_group",
    "country_id",
    "q",
    "sort_by",
    "order",
  ].forEach((key) => {
    if (options[key] !== undefined && options[key] !== "") {
      query[key] = options[key];
    }
  });

  [
    "min_age",
    "max_age",
    "min_gender_probability",
    "min_country_probability",
    "page",
    "limit",
  ].forEach((key) => {
    if (options[key] !== undefined && options[key] !== "") {
      query[key] = Number(options[key]);
    }
  });

  return query;
}

async function listProfiles(options = {}) {
  const response = await api.get("/profiles", { params: buildProfileQuery(options) });
  return response.data;
}

async function searchProfiles(options = {}) {
  const response = await api.get("/profiles/search", {
    params: buildProfileQuery(options),
  });
  return response.data;
}

async function getProfile(id) {
  const response = await api.get(`/profiles/${id}`);
  return response.data;
}

async function exportProfiles(options = {}) {
  const response = await api.get("/profiles/export", {
    params: { ...buildProfileQuery(options), format: "csv" },
    responseType: "text",
  });

  return {
    csv: response.data,
    headers: response.headers,
  };
}

module.exports = {
  buildProfileQuery,
  listProfiles,
  searchProfiles,
  getProfile,
  exportProfiles,
};