const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts');
var targets = {
	"GemFactory.sol": fs.readFileSync(contractPath + '/GemFactory.sol', 'utf8'),
	"ownership/Ownable.sol": fs.readFileSync(contractPath + '/ownership/Ownable.sol', 'utf8'),	
	"games/Zerosum.sol": fs.readFileSync(contractPath + '/games/Zerosum.sol', 'utf8')
};

//const gemPath = path.resolve(__dirname, 'contracts', 'GemFactory.sol');
//const source = fs.readFileSync(gemPath, 'utf-8');

const output = solc.compile({sources: targets}, 1).contracts;

console.log('[+] - [compile.js]');
console.log(output);

fs.ensureDirSync(buildPath);

for (let contract in output) {
	fs.outputJsonSync(
		path.resolve(buildPath, contract.replace(':', '') + '.json'),
		output[contract]
	);
}
