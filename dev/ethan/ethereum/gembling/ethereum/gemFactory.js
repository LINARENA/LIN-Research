import web3 from './web3';
import gemFactory from './build/GemFactory.json';

// TODO: Automatically add the contract address
const instance = new web3.eth.Contract(
	JSON.parse(gemFactory.interface),
	'0xdbAD826a3e92fD42d65E077DE27a59e9Ff937ddE'
);

export default instance;