function toKebabCase(string) {
	return string.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

function toPascalCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function toCamelCase(string) {
	return string.charAt(0).toLowerCase() + string.slice(1);
}

const FILES_CONTENT = {
	Controller: (className) =>
		`const Controller = require("../__types/Controller");

const ${className}Service = require("./${className}Service");

class ${className}Controller extends Controller {
    constructor(servicesProvider) {
        // Inicializa o controller e o serviço
        super(new ${className}Service(), servicesProvider);
        this.Service.setController(this);
    }
}

module.exports = ${className}Controller;
`,

	Service: (className) =>
		`const Service = require("../__types/Service");

const ${className}DTO = require("./${className}DTO");
const ${className}Repository = require("./${className}Repository");

class ${className}Service extends Service {
    ${className}Repository;

    constructor() {
        super();
        this.${className}Repository = new ${className}Repository(this);
    }
}

module.exports = ${className}Service;
`,

	Repository: (className) =>
		`const Repository = require("../__types/Repository");

const ${className}DTO = require("./${className}DTO");
const ${className}Entity = require("./${className}Entity");

class ${className}Repository extends Repository {
    constructor(service) {
        super(service, ${className}DTO);
    }
}

module.exports = ${className}Repository;
`,

	DTO: (className) =>
		`class ${className}DTO {
    constructor(${toCamelCase(className)}) {

    }

    toEntity() {
        return {

        };
    }

    static fromEntity(entity) {
        return new ${className}DTO(entity);
    }
}

module.exports = ${className}DTO;
`,

	Entity: (className) =>
		`const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "${className}",
    tableName: "${className}",

    columns: {},
    relations: {},
    indices: [],

    target: require("./${className}DTO"),
});
`,
};

const fileSystem = require("fs");
const path = require("path");

const arguments = process.argv.slice(2);

if (arguments.length === 0 || arguments.indexOf("-h") > 0) {
	console.error(
		"\nUtilização: generateModel <nome> <-c>? <-s>? <-r>? <-d>? <-e>? <-t>? <caminho>"
	);
	console.error("\t-c: Ignora a criação do Controller. (Opcional)");
	console.error("\t-s: Ignora a criação do Service. (Opcional)");
	console.error("\t-r: Ignora a criação do Repository. (Opcional)");
	console.error("\t-d: Ignora a criação do DTO. (Opcional)");
	console.error("\t-e: Ignora a criação da Entity. (Opcional)");
	console.error("\t-t: Adiciona um caminho adicional para a criação dos arquivos. (Opcional)");
	console.error(
		"\nExemplo com caminho específico e sem o controller: generateModel PhasesCards -c -t models/phases/relationship"
	);
	console.error("Exemplo sem caminho específico: generateModel Users\n");
	process.exit(1);
}

const fileName = toKebabCase(arguments[0]);
const className = toPascalCase(arguments[0]);

const ouputIndex = arguments.indexOf("-t");
const output = ouputIndex > 0 ? arguments[ouputIndex + 1] : "models";

const outputDirectory = path.join(__dirname, "..", output, fileName);
fileSystem.mkdirSync(outputDirectory);

function generate(type) {
	const content = FILES_CONTENT[type](className);
	fileSystem.writeFileSync(path.join(outputDirectory, `${className}${type}.js`), content);
	console.log(`${className}${type}.js criado com sucesso.`);
}

console.log(`\nGerando arquivos para ${className} em ${outputDirectory}`);
if (!arguments.includes("-c")) generate("Controller");
if (!arguments.includes("-s")) generate("Service");
if (!arguments.includes("-r")) generate("Repository");
if (!arguments.includes("-d")) generate("DTO");
if (!arguments.includes("-e")) generate("Entity");
console.log("Arquivos gerados com sucesso.\n");
