const path = require('path');
const fs = require('fs');
const solc = require('solc');

const projPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(projPath, 'utf-8');

// interface : javascript ABI
// bytecode  : compiled contract
module.exports = solc.compile(source, 1).contracts[':Lottery'];
