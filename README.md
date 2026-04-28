# Insighta CLI

Insighta CLI is the command-line companion for the Insighta backend. It supports GitHub authentication, authenticated profile browsing, CSV export, and local credential storage with automatic token refresh.

## Features

- GitHub login through the backend OAuth flow.
- Automatic use of access tokens on every authenticated request.
- Auto-refresh of expired access tokens when a refresh token is available.
- Structured table output for profile lists and searches.
- CSV export saved to the current working directory.
- Clear loading and error feedback for long-running operations.

## Requirements

- Node.js 18 or newer.
- The Insighta backend running locally at `http://localhost:3000`.
- A GitHub OAuth app configured for the backend.

## Installation

From the `insighta-cli` folder:

```bash
npm install
```

If you want to use the CLI globally during development:

```bash
npm link
```

## Configuration

The CLI currently talks to the backend at `http://localhost:3000/api`.

If your backend runs on a different host or port, update the base URL in `services/api.js`.

## Authentication

Login opens the GitHub authorization page in your browser, then asks you to paste the JSON response returned by the backend callback page.

```bash
insighta login
```

Logout clears the local credential file and revokes the refresh token on the backend when possible.

```bash
insighta logout
```

Show the cached user profile:

```bash
insighta whoami
```

### Credential storage

Credentials are stored at:

```text
~/.insighta/credentials.json
```

The file stores the access token, refresh token, and cached user profile.

## Profile Commands

Profiles are displayed in structured tables, with loading spinners shown while requests are in progress.

### List profiles

```bash
insighta profiles list
```

Useful filters:

```bash
insighta profiles list --gender female --country-id US --page 1 --limit 10
```

Supported list filters:

- `--gender <gender>`
- `--age-group <ageGroup>`
- `--country-id <countryId>`
- `--min-age <minAge>`
- `--max-age <maxAge>`
- `--min-gender-probability <value>`
- `--min-country-probability <value>`
- `--page <page>`
- `--limit <limit>`
- `--sort-by <sortBy>`
- `--order <order>`

### View a profile

```bash
insighta profiles get <id>
```

Example:

```bash
insighta profiles get 01J1234567890ABCDE
```

### Search profiles

```bash
insighta profiles search --q "young female from nigeria"
```

Supported search filters:

- `--q <query>`
- `--gender <gender>`
- `--age-group <ageGroup>`
- `--country-id <countryId>`
- `--min-age <minAge>`
- `--max-age <maxAge>`
- `--min-gender-probability <value>`
- `--min-country-probability <value>`
- `--page <page>`
- `--limit <limit>`
- `--sort-by <sortBy>`
- `--order <order>`

### Export profiles to CSV

Exports are saved to the current working directory.

```bash
insighta profiles export --gender male --sort-by created_at --order desc
```

The file is named like `profiles_<timestamp>.csv`.

## How token refresh works

The CLI automatically attaches the stored access token to every request.

When the backend responds with an auth failure and a refresh token is available, the CLI:

1. Calls the backend refresh endpoint.
2. Saves the new token pair back to `~/.insighta/credentials.json`.
3. Retries the original request.

If refresh is not possible, the CLI clears the local credentials and asks you to log in again.

## Error handling

The CLI prints clear messages when:

- login fails,
- credentials are missing,
- token refresh fails,
- a profile request returns an error,
- CSV export cannot be written to disk.

## Development

Run the CLI directly from the package during development:

```bash
node ./bin/insighta.js --help
```

Lint the project:

```bash
npm run lint
```

## Troubleshooting

- If login keeps failing, confirm the backend is running and GitHub OAuth is configured correctly.
- If requests keep returning `403`, log out and log in again to refresh the local session.
- If export files are not appearing, check the current working directory where you launched the command.

## Command Summary

| Command | Description |
| --- | --- |
| `insighta login` | Sign in with GitHub |
| `insighta logout` | Clear local credentials and revoke the refresh token |
| `insighta whoami` | Show the cached user profile |
| `insighta profiles list` | List profiles with filters and sorting |
| `insighta profiles get <id>` | Show a single profile |
| `insighta profiles search` | Search profiles with natural language filters |
| `insighta profiles export` | Export profiles to a CSV file |