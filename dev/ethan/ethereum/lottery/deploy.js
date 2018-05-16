const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

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

  console.log(JSON.parse(interface));
  console.log(bytecode);

  // provide ABI
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: '0x' + bytecode
    })
    .send({
      from: accounts[0] // deployed from
      //gas: '225925'
    });

  console.log(interface);
  // record where our contract is exist
  console.log('Contract deployed to', result.options.address);
};

deploy();
