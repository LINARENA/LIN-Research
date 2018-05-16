# 2018_defcon_sag

## Challenge

The challenge gave us the contract address and two sources (js, sol).

- contract address
  - https://ropsten.etherscan.io/txs?a=0xa019c785322b921a84d086502da0d0dbdb993fba&p=9

- sagd.js

```javascript
// some code would keep running

const EthCrypto = require('eth-crypto');
const FLAG = 'OOO{NOTFLAG}';
const sag_proxy_addr = '0x...';

var halloffame = {};

(async () => {
    try {
        var sag_proxy = await SagProxy.at(sag_proxy_addr);

        sag_proxy.PrizeRequest(null, {
            fromBlock: 1
        }, async (e, r) => {
            const m = r.args.msgHash;
            const sig = '0x' + r.args.r.substr(2) + r.args.s.substr(2) + r.args.v.toString(16);
            const pubkey = EthCrypto.recoverPublicKey(sig, m);
            const addr = EthCrypto.publicKey.toAddress(pubkey);
            if (!(addr in halloffame)) {
                const encrypted = await EthCrypto.encryptWithPublicKey(pubkey, FLAG);
                const prize = '0x' + EthCrypto.cipher.stringify(encrypted);
                await sag_proxy.deliverPrize(addr, prize);
                halloffame[addr] = pubkey;
            }
        })
    } catch (e) {
        console.error(e);
    }
})();
```

- SagProxy.sol

```javascript
pragma solidity ^0.4.17;

import "./Sag.sol";

contract SagProxy {
    event PrizeRequest(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s);
    event PrizeReady(address winner, bytes prize);

    Sag private sag;

    address private owner;

    modifier onlyOwner
    {
        require(msg.sender == owner);
        _;
    }

    constructor(address sag_addr) public
    {
        owner = msg.sender;
        sag = Sag(sag_addr);
    }

    function gamble(uint256 guess, uint256 seed) public
    {
        sag.gamble(guess, seed);
    }

    function requestPrize(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public
        returns (bool is_winner)
    {
        if (ecrecover(msgHash, v, r, s) == msg.sender && sag.isWinner(msg.sender)) {
            emit PrizeRequest(msgHash, v, r, s);
            return true;
        }
        return false;
    }

    function deliverPrize(address winner, bytes prize) public onlyOwner
    {
        emit PrizeReady(winner, prize);
    }
}
```

There is FLAG in `sagd.js` but they hide the detail implementation in solidity source. However, we can see hidden detail implementation by reversing the  bytecode in the contract address.

- https://ropsten.etherscan.io/address/0xa019c785322b921a84d086502da0d0dbdb993fba#code

So, we can convert this to bytecode.
- https://ethervm.io/decompile

The result bytecode is

```javascript
contract Contract {
    function main() {
        memory[0x40:0x60] = 0x80;

        if (msg.data.length < 0x04) { revert(memory[0x00:0x00]); }
        else {
            var var0 = 0xffffffff & msg.data[0x00:0x20] / 0x0100000000000000000000000000000000000000000000000000000000;

            if (0x22e8c8fc == var0) {
                var var1 = msg.value;

                if (var1) { revert(memory[0x00:0x00]); }

                var1 = 0x00a7;
                var var2 = msg.data[0x04:0x24];
                var var3 = msg.data[0x24:0x44];
                // Method call to func_01CF
                stop();
            } else if (0x6bd5450a == var0) {
                var1 = msg.value;

                if (var1) { revert(memory[0x00:0x00]); }

                var1 = 0x00ea;
                var2 = 0xffffffffffffffffffffffffffffffffffffffff & msg.data[0x04:0x24];
                // Method call to func_049C
                var temp0 = memory[0x40:0x60];
                memory[temp0:temp0 + 0x20] = !!!!var2;
                var temp1 = memory[0x40:0x60];
                return memory[temp1:temp1 + (0x20 + temp0) - temp1];
            } else if (0x7e467819 == var0) {
                var1 = msg.value;

                if (var1) { revert(memory[0x00:0x00]); }

                var1 = 0x012f;
                var2 = msg.data[0x04:0x24];
                // Method call to func_04BC
                stop();
            } else if (0x92a0f6f9 == var0) {
                var1 = msg.value;

                if (var1) { revert(memory[0x00:0x00]); }

                var1 = 0x0172;
                var2 = 0xffffffffffffffffffffffffffffffffffffffff & msg.data[0x04:0x24];
                // Method call to func_0522
                stop();
            } else {
                if (0x9d9ca28d != var0) { revert(memory[0x00:0x00]); }

                var1 = msg.value;

                if (var1) { revert(memory[0x00:0x00]); }

                var1 = 0x01b5;
                var2 = 0xffffffffffffffffffffffffffffffffffffffff & msg.data[0x04:0x24];
                // Method call to func_05D8
                var temp2 = memory[0x40:0x60];
                memory[temp2:temp2 + 0x20] = !!!!var1;
                var temp3 = memory[0x40:0x60];
                return memory[temp3:temp3 + (0x20 + temp2) - temp3];
            }
        }
    }

    function func_01CF() {
        var var0 = 0x00;
        var var1 = var0;
        var var2 = 0x00;
        var var3 = var2;

        if (msg.gas >= storage[0x02]) { revert(memory[0x00:0x00]); }

        memory[0x00:0x20] = 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & msg.sender;
        memory[0x20:0x40] = 0x00;

        if (0xff & storage[keccak256(memory[0x00:0x40])] / 0x0100 ** 0x00) { revert(memory[0x00:0x00]); }

        var temp0 = memory[0x40:0x60];
        memory[temp0:temp0 + 0x20] = 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & msg.sender;
        var temp1 = memory[0x40:0x60];
        log(memory[temp1:temp1 + (0x20 + temp0) - temp1], [0x13b5333f210c6f5716ba38a687328636d36778572f6e032a83950c9a238356b9]);
        var2 = 0xffffffffffffffffffffffffffffffffffffffff & msg.sender;
        var3 = arg0;
        var0 = 0x00;

        if (var0 >= 0x20) {
        label_030A:
            var0 = 0x00;

            if (var0 >= 0x20) {
            label_03B8:
                var var4 = 0x03;
                var var5 = 0x00;

                if (var5 >= 0x20) { assert(); }

                if (arg1 != storage[var5 + var4]) {
                    // Could not resolve jump destination (is this a return?)
                } else {
                    var temp2 = memory[0x40:0x60];
                    memory[temp2:temp2 + 0x20] = 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & msg.sender;
                    var temp3 = 0x20 + temp2;
                    memory[temp3:temp3 + 0x20] = arg0;
                    var temp4 = memory[0x40:0x60];
                    log(memory[temp4:temp4 + (0x20 + temp3) - temp4], [0xf524cff290ca88948da219ef106f97024214703e20ea88ab521bea6781ab5b41]);
                    memory[0x00:0x20] = 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & msg.sender;
                    var temp5 = 0x20 + 0x00;
                    memory[temp5:temp5 + 0x20] = 0x00;
                    var temp6 = keccak256(memory[0x00:0x00 + 0x20 + temp5]);
                    var temp7 = 0x0100 ** 0x00;
                    storage[temp6] = !!0x01 * temp7 | (~(0xff * temp7) & storage[temp6]);
                    // Could not resolve jump destination (is this a return?)
                }
            } else {
            label_0319:
                var1 = var0 + 0x01;

                if (var1 >= 0x20) {
                label_03AB:
                    var0 = 0x01 + var0;

                    if (var0 >= 0x20) { goto label_03B8; }
                    else { goto label_0319; }
                } else {
                label_0329:
                    var4 = 0x03;
                    var5 = var1;

                    if (var5 >= 0x20) { assert(); }

                    var4 = storage[var5 + var4];
                    var5 = 0x03;
                    var var6 = var0;

                    if (var6 >= 0x20) { assert(); }

                    if (storage[var6 + var5] >= var4) {
                    label_039E:
                        var1 = 0x01 + var1;

                        if (var1 >= 0x20) { goto label_03AB; }
                        else { goto label_0329; }
                    } else {
                        var4 = 0x03;
                        var5 = var0;

                        if (var5 >= 0x20) { assert(); }

                        var3 = storage[var5 + var4];
                        var4 = 0x03;
                        var5 = var1;

                        if (var5 >= 0x20) { assert(); }

                        var4 = storage[var5 + var4];
                        var5 = 0x03;
                        var6 = var0;

                        if (var6 >= 0x20) { assert(); }

                        storage[var6 + var5] = var4;
                        var4 = var3;
                        var5 = 0x03;
                        var6 = var1;

                        if (var6 >= 0x20) { assert(); }

                        storage[var6 + var5] = var4;
                        goto label_039E;
                    }
                }
            }
        } else {
        label_02CB:
            var temp8 = memory[0x40:0x60];
            memory[temp8:temp8 + 0x20] = var3;
            var temp9 = memory[0x40:0x60];
            var temp10 = keccak256(memory[temp9:temp9 + (0x20 + temp8) - temp9]) / 0x01 ~ var2;
            var3 = temp10;
            var4 = var3;
            var5 = 0x03;
            var6 = var0;

            if (var6 >= 0x20) { assert(); }

            storage[var6 + var5] = var4;
            var0 = 0x01 + var0;

            if (var0 >= 0x20) { goto label_030A; }
            else { goto label_02CB; }
        }
    }

    function func_049C() {
        memory[0x20:0x40] = 0x00;
        memory[0x00:0x20] = arg0;
        arg0 = 0xff & storage[keccak256(memory[0x00:0x40])] / 0x0100 ** 0x00;
        // Could not resolve jump destination (is this a return?)
    }

    function func_04BC() {
        if (0xffffffffffffffffffffffffffffffffffffffff & msg.sender != 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & storage[0x01] / 0x0100 ** 0x00) { revert(memory[0x00:0x00]); }

        storage[0x02] = arg0;
        // Could not resolve jump destination (is this a return?)
    }

    function func_0522() {
        if (0xffffffffffffffffffffffffffffffffffffffff & msg.sender != 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & storage[0x01] / 0x0100 ** 0x00) { revert(memory[0x00:0x00]); }

        memory[0x00:0x20] = 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & arg0;
        var temp0 = 0x20 + 0x00;
        memory[temp0:temp0 + 0x20] = 0x00;
        var temp1 = keccak256(memory[0x00:0x00 + 0x20 + temp0]);
        var temp2 = 0x0100 ** 0x00;
        storage[temp1] = !!0x01 * temp2 | (~(0xff * temp2) & storage[temp1]);
        // Could not resolve jump destination (is this a return?)
    }

    function func_05D8() {
        memory[0x00:0x20] = 0xffffffffffffffffffffffffffffffffffffffff & 0xffffffffffffffffffffffffffffffffffffffff & arg0;
        var temp0 = 0x20 + 0x00;
        memory[temp0:temp0 + 0x20] = 0x00;
        arg1 = 0xff & storage[keccak256(memory[0x00:0x00 + 0x20 + temp0])] / 0x0100 ** 0x00;
        // Could not resolve jump destination (is this a return?)
    }
}
```

Before reversing this, we tried gamble function. The gamble function take 2 arguments (guess, seed). We gave random arguments to the gamble function and it fails. :(

```
// FYI
I've tested in https://remix.ethereum.org.
You can easily testing in Javascript VM Environment in remix.
And also, you need metamask (chrom extension) to create account for test network.

https://blog.kyber.network/kybernetwork-s-ropsten-testnet-release-and-tutorial-3129928660d7
```

When we saw the fail log, the data start with `22e8c8fc...` so the function `func_01CF` is gamble function.

After reversing this, the gamble function check that it hashes seed with keccak256 and xor my account address, 32 times. (32 different hashes)

After that they sorted in descending order and finally check the guess value and first value of sorted list.

So, we can simply generate the biggest hash value given seed and my account address.

The simple validate code is

```javascript
function my_gamble(int256 guess, int256 seed) view returns(uint256)
{
  uint i;
  uint max = 0;
  uint v = seed;  
  for(i=0 ; i<32 ; i++) {
    v = uint256(keccak256(v)) ^ uint256(msg.sender);
    if (v > max)
      max = v;
  }
  return max  
}
```

After we calculate the maximum hash value in the list, and send the hash value but it failed. The fail log said

```
Warning! Error encountered during contract execution [Out of gas]
```

When we look at the code carefully, the sorting operate too much when the hash list is uniformly distribute formed.

So, we need to pick the seed that already almost sorted by default. The maximum sorting count is `(32 * 33)/2 = 528`. We try to find the seed value that reduced sorting count is less than 130.

If the sorting count is less than 130, the gas fee is not exceeded. lol!

The brutefoce code is

```python
from web3 import Web3
import random
import sys

print("I'm running :)")

# limit count     : sys.argv[1]
# account address : sys.argv[2]

limit = 130
if len(sys.argv) < 2:
    limit = int(sys.argv[1])

while True:
    lst = []

    init_seed = random.randint(2**24, 2**128)
    seed = init_seed

    for i in range(0x20):
        k = Web3.soliditySha3(['uint256'], [seed]).hex()
        seed = int(k, 16) ^ int(sys.argv[2], 16)
        lst.append(seed)

    lower = False
    count = 0
    for i in range(0x20):
        for j in range(i+1, 0x20):
            if lst[i] <= lst[j]:
                count += 1

    if count < limit:
        print("[*] Found it !! Flag is :", init_seed, lst[0])
```

When we send the value found from the test code to the address (`0xa019...`), it succeed the gamble function. And the response data will be create the block at (https://ropsten.etherscan.io/address/0x2f797ebd6bb007b0bb1df71cb3b827a3e35a7625).

After checking the data, and sign the msg with my private key and send it again with proper values then the encrypted flag block will be created at (https://ropsten.etherscan.io/address/0xfbff9420d2a6568f2e739cae39e50dbcd10b39ff).

```javascript
const EthCrypto = require('eth-crypto');
const abiDecoder = require('abi-decoder');
const ethers = require('ethers');

const testABI = [{
    "constant":false,
    "inputs":[
      {
        "name":"guess",
        "type":"uint256"
      },{
        "name":"seed",
        "type":"uint256"
      }],
    "name":"gamble",
    "outputs":[],
    "payable":false,
    "stateMutability":"nonpayable",
    "type":"function"
  },{
    "constant":false,
    "inputs":[{
      "name":"winner",
      "type":"address"
    },{
      "name":"prize",
      "type":"bytes"
    }],
    "name":"deliverPrize",
    "outputs":[],
    "payable":false,
    "stateMutability":"nonpayable",
    "type":"function"
  },{
    "constant":false,
    "inputs":[{
      "name":"msgHash",
      "type":"bytes32"
    },{
      "name":"v",
      "type":"uint8"
    },{
      "name":"r",
      "type":"bytes32"
    },{
      "name":"s",
      "type":"bytes32"
    }],
    "name":"requestPrize",
    "outputs":[{
      "name":"is_winner",
      "type":"bool"
    }],
    "payable":false,
    "stateMutability":"nonpayable",
    "type":"function"
  },{
    "inputs":[{
      "name":"sag_addr",
      "type":"address"
    }],
    "payable":false,
    "stateMutability":"nonpayable",
    "type":"constructor"
  },{
    "anonymous":false,
    "inputs":[{
      "indexed":false,
      "name":"msgHash",
      "type":"bytes32"
    },{
      "indexed":false,
      "name":"v",
      "type":"uint8"
    },{
      "indexed":false,
      "name":"r",
      "type":"bytes32"
    },{
      "indexed":false,
      "name":"s",
      "type":"bytes32"
    }],
    "name":"PrizeRequest",
    "type":"event"
  },{
    "anonymous":false,
    "inputs":[{
      "indexed":false,
      "name":"winner",
      "type":"address"
    },{
      "indexed":false,
      "name":"prize",
      "type":"bytes"
    }],
    "name":"PrizeReady",
    "type":"event"
  }];
abiDecoder.addABI(testABI);

// response data at 0x2f79...
const data = '0xfb4fd98450ac91e5a0c7aace09d82f3711f651334d8fdded424ab0f230adb2e6effec4cc000000000000000000000000000000000000000000000000000000000000001bea4268e48991d148488b208add8bca8d20a01c66eaf013cd4f6a8f38424891e3284ca93459bbcc081eb444ca720c67133fd07067c21aa3942297e1caadd7e8c7';
const dec_data = abiDecoder.decodeMethod(data);
console.log(dec_data);

// test to check signing
const msgHash = dec_data['params'][0]['value'];
const v = dec_data['params'][1]['value'];
const r = dec_data['params'][2]['value'];
const s = dec_data['params'][3]['value'];

const test_sig = '0x' + r.substr(2) + s.substr(2) + v.toString(16);
console.log("sig : ", test_sig);
const testPubKey = EthCrypto.recoverPublicKey(test_sig, msgHash);
console.log("pubkey ? : ", testPubKey);
const my_addr = EthCrypto.publicKey.toAddress(testPubKey);
// my_addr should be my account address
console.log("addr :", my_addr);

// decrypt FLAG
const pvKey = '899d0e0.....'; // my private key
const pubKey = EthCrypto.publicKeyByPrivateKey(pvKey);
const signature = EthCrypto.sign(
    pvKey,
    msgHash // hash of message
);
console.log("pvkey  :", pvKey);
console.log("pubkey :", pubKey);
console.log("signature :", signature);
const sig = ethers.utils.splitSignature(signature);
console.log(sig);

// decrypt flag
const enc_resp = ''; // final block data
const dec_resp = abiDecoder.decodeMethod(enc_resp);
console.log(dec_resp);

const enc_flag = dec_resp['params'][1]['value'];
const decrypted = EthCrypto.decryptWithPrivateKey(
    pvKey,
    enc_flag
);
decrypted.then(function(result) {
  console.log(result);
});
```
