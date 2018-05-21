import Web3 from 'web3';

// window is not defined by default
//const web3 = new Web3(window.web3.currentProvider);

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	// we are in the browser and metamask is running
	web3 = new Web3(window.web3.currentProvider);
} else {
	// we are on the server or the user is not running metamask
	const provider = new Web3.providers.HttpProvider(
		process.env.ETH_NETWORK
	);
	web3 = new Web3(provider);
}

export default web3;