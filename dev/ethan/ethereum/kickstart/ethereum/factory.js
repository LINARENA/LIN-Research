import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0x80e5C26E35d78FA424a6206688849FEC25E15c4d'
);

export default instance;