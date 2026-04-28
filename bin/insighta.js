#!/usr/bin/env node

const { Command } = require("commander");

const program = new Command();

program
  .name("insighta")
  .description("Insighta CLI tool")
  .version("1.0.0");

// AUTH COMMANDS
program
  .command("login")
  .description("Login to Insighta")
  .action(() => require("../commands/auth/login")());

program
  .command("logout")
  .description("Logout from Insighta")
  .action(() => require("../commands/auth/logout")());

program
  .command("whoami")
  .description("Show current user")
  .action(() => require("../commands/auth/whoami")());

// PROFILE COMMANDS
const profilesCommand = program
  .command("profiles")
  .description("Manage profiles");

profilesCommand
  .command("list")
  .description("List profiles")
  .option("--gender <gender>")
  .option("--age-group <ageGroup>")
  .option("--country-id <countryId>")
  .option("--min-age <minAge>")
  .option("--max-age <maxAge>")
  .option("--min-gender-probability <value>")
  .option("--min-country-probability <value>")
  .option("--page <page>")
  .option("--limit <limit>")
  .option("--sort-by <sortBy>")
  .option("--order <order>")
  .action((options) => require("../commands/profiles/list")(options));

profilesCommand
  .command("get <id>")
  .description("Get a profile by id")
  .action((id) => require("../commands/profiles/get")(id));

profilesCommand
  .command("search")
  .description("Search profiles")
  .option("--q <query>")
  .option("--page <page>")
  .option("--limit <limit>")
  .option("--gender <gender>")
  .option("--age-group <ageGroup>")
  .option("--country-id <countryId>")
  .option("--min-age <minAge>")
  .option("--max-age <maxAge>")
  .option("--min-gender-probability <value>")
  .option("--min-country-probability <value>")
  .option("--sort-by <sortBy>")
  .option("--order <order>")
  .action((options) => require("../commands/profiles/search")(options));

profilesCommand
  .command("export")
  .description("Export profiles to CSV")
  .option("--gender <gender>")
  .option("--age-group <ageGroup>")
  .option("--country-id <countryId>")
  .option("--min-age <minAge>")
  .option("--max-age <maxAge>")
  .option("--min-gender-probability <value>")
  .option("--min-country-probability <value>")
  .option("--page <page>")
  .option("--limit <limit>")
  .option("--sort-by <sortBy>")
  .option("--order <order>")
  .action((options) => require("../commands/profiles/export")(options));

program.parse(process.argv);