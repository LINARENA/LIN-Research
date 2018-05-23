const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledGems = require('./build/GemFactory.json');

const mnemonic = process.env.ETH_MNEMONIC;
const eth_net = process.env.ETH_NETWORK;

const provider = new HDWalletProvider(
	mnemonic,
	eth_net
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	// provider ABI
	const result = await new web3.eth.Contract(
		JSON.parse(compiledGems.interface)
	).deploy({
		data: '0x' + compiledGems.bytecode
	}).send({
		from: accounts[0]
	});

	console.log('[+] deploy.js')
	console.log('  [-] account :', accounts);
	console.log('  [-] Contract deployed to', result.options.address);
};

deploy();