import web3 from './web3';
import Zerosum from './build/Zerosum.json';

export default (address) => {
	return new web3.eth.Contract(
		JSON.parse(Zerosum.interface),
		address
	);
};