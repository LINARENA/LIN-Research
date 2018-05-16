const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
  // web3.eth.getAccounts()
    // .then(fetchedAccounts => {
    //   console.log(fetchedAccounts);
    // });
  accounts = await web3.eth.getAccounts();

  console.log("[*] construct : ", accounts);

  // inst of contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  //lottery.setProvider(provider);
});

describe('[*] Lottery Contract', () => {
  it('test', async () => {
    // is exists?
    assert.ok(lottery.options.address);

    const manager = await lottery.methods.getManager().call();
    console.log('[*] get manager :', manager);    
  });

  it('get manager', async () => {
    const manager = await lottery.methods.getManager().call();
    console.log(manager);
  });

  // it('allows one account to play', async () => {
  //   await lottery.methods.play().send({
  //     from: accounts[0],
  //     value: web3.utils.toWei('1', 'ether')
  //   });
  //
  //   const players = await lottery.methods.getPlayers().call({
  //     from: accounts[0]
  //   });
  //
  //   assert.equal(accounts[0], players[0]);
  //   assert.equal(1, players.length);
  // });
  //
  // // try-catch
  // it('requires a minimum amount of playing', async () => {
  //   try {
  //     await lottery.methods.play().send({
  //       from: accounts[0],
  //       value: 0
  //     });
  //     assert(false);
  //   } catch(err) {
  //     assert(err);
  //   }
  // });
  //
  // it('manager only', async() => {
  //   const manager = await lottery.methods.manager().call();
  //   console.log('manager', manager);
  //   console.log('player[1]', accounts[1]);
  //   try {
  //     await lottery.methods.pickWinner().send({
  //       from:accounts[1]
  //     });
  //     assert(false);
  //   } catch(err) {
  //     assert(err);
  //     console.log('err :', err.message);
  //   }
  // });
  //
  // it('sends money to the winner and resets the players array', async() => {
  //   await lottery.methods.play().send({
  //     from: accounts[0],
  //     value: web3.utils.toWei('2', 'ether')
  //   });
  //
  //   const initBalance = await web3.eth.getBalance(accounts[0]);
  //   await lottery.methods.pickWinner().send({
  //     from: accounts[0]
  //   });
  //   const finalBalance = await web3.eth.getBalance(accounts[0]);
  //
  //   const diffBalance = finalBalance - initBalance;
  //
  //   console.log("diff :", diffBalance);
  //
  // });

});
