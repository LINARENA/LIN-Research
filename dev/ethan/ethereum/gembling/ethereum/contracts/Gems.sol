pragma solidity ^0.4.23;

import './Zerosum.sol';

contract Gems {
	address[] public deployedGems;
	address public owner;

	modifier restricted() {
		require(msg.sender == owner);
		_;
	}

	constructor() public {
		owner = msg.sender;
	} 

	function createGem(uint _type) public restricted{
		address newGem = new Zerosum(msg.sender);
		deployedGems.push(newGem);
	}

	function getDeployedGems() public restricted view returns (address[]) {
		return deployedGems;
	}
}
