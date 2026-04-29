const api = require("./api");

function buildProfileQuery(options = {}) {
  // Normalize commander-style camelCase and kebab-case option names to the
  // snake_case keys expected by the backend API.
  const map = {
    ageGroup: 'age_group',
    countryId: 'country_id',
    minAge: 'min_age',
    maxAge: 'max_age',
    minGenderProbability: 'min_gender_probability',
    minCountryProbability: 'min_country_probability',
    sortBy: 'sort_by',
    // common aliases
    country: 'country_id',
    q: 'q',
    gender: 'gender',
    page: 'page',
    limit: 'limit',
    order: 'order',
  };

  const query = {};

  Object.entries(options || {}).forEach(([key, value]) => {
    if (value === undefined || value === '') return;

    // commander converts kebab-case to camelCase on option names, so handle both
    // the original and mapped forms. Also accept snake_case passed directly.
    let outKey = map[key] || key;

    // If key is camelCase and not in map, convert to snake_case
    if (!map[key] && /[A-Z]/.test(key)) {
      outKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    }

    // Accept hyphenated keys (rare) by replacing - with _
    outKey = outKey.replace(/-/g, '_');

    query[outKey] = value;
  });

  // Coerce numeric parameters
  ['min_age', 'max_age', 'min_gender_probability', 'min_country_probability', 'page', 'limit'].forEach((k) => {
    if (query[k] !== undefined) query[k] = Number(query[k]);
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
  const params = { ...buildProfileQuery(options) };
  params.format = options.format || 'csv';

  const response = await api.get('/profiles/export', {
    params,
    responseType: 'text',
  });

  return {
    csv: response.data,
    headers: response.headers,
  };
}

async function createProfile(payload = {}) {
  const response = await api.post('/profiles', { name: payload.name });
  return response.data;
}

module.exports = {
  buildProfileQuery,
  listProfiles,
  searchProfiles,
  getProfile,
  exportProfiles,
  createProfile,
};