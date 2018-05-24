pragma solidity ^0.4.23;

import "games/Zerosum.sol";

contract GemFactory {
	address[] public deployedGems;

	function createGem() public {
		address newGem = new Zerosum(msg.sender);
		deployedGems.push(newGem);
	}

	function getDeployedGems() public view returns (address[]) {
		return deployedGems;
	}
}

