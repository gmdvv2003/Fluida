#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Usage: generate <name>');
  process.exit(1);
}

const name = args[0];
const lowercaseName = name.toLowerCase();
const capitalized = capitalizeFirstLetter(name);

// Cria a pasta com o nome fornecido em minúsculas
const dirPath = path.join(__dirname, lowercaseName);
fs.mkdirSync(dirPath);

generateController(capitalized);
generateService(capitalized);
generateEntity(capitalized);
generateDTO(capitalized);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateController(name) {
  const content = `class ${name}Controller {\n  // Your controller logic here\n}\n\nmodule.exports = ${name}Controller;`;
  fs.writeFileSync(path.join(dirPath, `${lowercaseName}.controller.js`), content);
  console.log(`${lowercaseName}.controller.js created successfully!`);
}

function generateService(name) {
  const content = `class ${name}Service {\n  // Your service logic here\n}\n\nmodule.exports = ${name}Service;`;
  fs.writeFileSync(path.join(dirPath, `${lowercaseName}.service.js`), content);
  console.log(`${lowercaseName}.service.js created successfully!`);
}

function generateEntity(name) {
  const content = `class ${name}Entity {\n  // Your entity logic here\n}\n\nmodule.exports = ${name}Entity;`;
  fs.writeFileSync(path.join(dirPath, `${lowercaseName}.entity.js`), content);
  console.log(`${lowercaseName}.entity.js created successfully!`);
}

function generateDTO(name) {
  const content = `class ${name}DTO {\n  // Your DTO logic here\n}\n\nmodule.exports = ${name}DTO;`;
  fs.writeFileSync(path.join(dirPath, `${lowercaseName}.dto.js`), content);
  console.log(`${lowercaseName}.dto.js created successfully!`);
}
