# Ethan Kim

- Blog  : [hackability.kr](http://hackability.kr)
- Email : <hackability@i2sec.co.kr>

## Dev issues

- UnhandledPromiseRejectionWarning: Error: The contract code couldn't be stored, please check your gas limit.
    - https://hanezu.github.io/posts/Gas-Limit-Error-when-deploy-Truffle-project-on-Private-Network.html
    ```javascript
    // original code
    const result = await new web3.eth.Contract( JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({
          from: accounts[0],
          gas: '2000000'
        });

    // resolved code
    const result = await new web3.eth.Contract( JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({
          from: accounts[0]
          //gas: '2000000'
        });    
    ```
- UnhandledPromiseRejectionWarning: Error: invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field CallArgs.data of type hexutil.Bytes
    - https://github.com/ConsenSys/ethjsonrpc/issues/26
    - Add the prefix `0x` to the hexstring

## CTF
  - 2018 DEFCON sag

## ETC
  - (encrypt and sign) and (decrypt and verify)
    - https://github.com/pubkey/eth-crypto/blob/master/tutorials/encrypted-message.md
  - EVM deompiler
    - https://ethervm.io/decompile
    - https://github.com/ajlopez/Yasold
