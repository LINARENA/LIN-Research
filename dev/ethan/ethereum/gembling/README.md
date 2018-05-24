# Gembling Project

This PoC poject runs on `Ropsten` test network.

## Introduction

The gembling system built on Ethereum blockchain provides various games that transfer real money to each other.

I'm not only concened making games on Eth., but also structure, security, or interaction between front-to-back, vise versa.

This project will expand to trading, rewarding, or other interesting topics.

## Considerations

The gembling system consists of three parts.

- Solitidy
  - split contracts as many as possible
  - manage useful solidity utils
  - versioning issue
  - best practice
  - predict pseudo random
- EVM
  - reversing :P
  - gas fee
- Security
- React + next.js
  - taste it
  - componenets
  - callbacks

## Solidity Structures

last modifed at 2018.05.24

- [D] Gembling
  - [D] Utils
    - [D] safemath
    - [D] tokens
    - [D] ownership
    - [D] payment
    - [D] lifecycle
  - [D] Games
    - Zerosum.sol
    - Lottery.sol
  - GemFactory.sol
  - Gem.sol
