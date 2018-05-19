const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
//const { interface, bytecode } = require('./compile');
const compiledFactory = require('./build/CampaignFactory.json')

// cur address: 0x9c11983749d025ea4D2c1C75d3B3fc8e736962F0
const mnemonic = process.env.ETH_MNEMONIC;
const eth_net  = process.env.ETH_NETWORK;

const provider = new HDWalletProvider (
  mnemonic,
  eth_net
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("account :", accounts);

  // provide ABI
  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({
      data: '0x' + compiledFactory.bytecode
    })
    .send({
      from: accounts[0] // deployed from
      //gas: '225925'
    });

  // record where our contract is exist
  console.log('Contract deployed to', result.options.address);
};

deploy();