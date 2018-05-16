pragma solidity ^0.4.23;

contract Lottery {
  address public manager;
  address[] public players;

  constructor() public{
    manager = msg.sender;
  }

  function play() public payable {
    require(msg.value > .01 ether);
    players.push(msg.sender);
  }

  function getPlayers() public view returns(address[]) {
    return players;
  }
  
  function random() private view returns (uint) {
    return uint(keccak256(block.difficulty, now, players));
  }

  function getWinner() public restricted {
    uint index = random() % players.length;
    players[index].transfer(this.balance);
    players = new address[](0);
  }

  function getManager() public view returns(address) {
    return manager;
  }

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

}
