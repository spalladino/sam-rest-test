#! /usr/bin/env node

const toml = require('toml');
const fs = require('fs');

function main(param) {
  if (!param) throw new Error('You must set the parameter to retrieve');
  const raw = fs.readFileSync('samconfig.toml').toString();
  const config = toml.parse(raw);
  process.stdout.write(config.default.deploy.parameters[param]);
}

main(process.argv[2]);