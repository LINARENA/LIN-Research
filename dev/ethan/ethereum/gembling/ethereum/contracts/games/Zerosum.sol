pragma solidity ^0.4.23;

contract Zerosum {
	string public constant VERSION = "0.0.1";
	string public constant NAME = "zerosum";

	address public manager;

	struct Game {
		uint round;
		uint state;
		uint startTime;
		uint endTime;
		uint nPlayers;
		uint minPlayers;
		address[] players;
		address winner;
		mapping(address => bool) mapPlayers;
	}

	uint public currentRound;
	Game[] public games;

	modifier onlyManager() {
		require(msg.sender == manager);
		_;
	}

	constructor(address _creator) public{
		manager = _creator;
		currentRound = 0;

		Game memory newGame = Game({
			round: currentRound,
			state: 1,
			startTime: now,
			endTime: 0,
			nPlayers: 0,
			minPlayers: 3,
			players: new address[](0),
			winner: address(0)
		});

		games.push(newGame);
	}

	function play() public payable {
		require(
			games[currentRound].state != 0 &&
			msg.value > .0003 ether &&
			!games[currentRound].mapPlayers[msg.sender]
		);

		games[currentRound].players.push(msg.sender);
		games[currentRound].mapPlayers[msg.sender] = true;
		games[currentRound].nPlayers++;
	}

	function getPlayers() public onlyManager view returns(address[]) {
		return games[currentRound].players;
	}

	function random() private view returns (uint) {
		return uint(keccak256(block.difficulty, now, games[currentRound].players));
	}

	function getWinner() public onlyManager {
		require(games[currentRound].nPlayers >= games[currentRound].minPlayers);

		games[currentRound].state = 0;

		uint index = random() % games[currentRound].nPlayers;
		games[currentRound].winner = games[currentRound].players[index];
		games[currentRound].players[index].transfer(address(this).balance);
		games[currentRound].endTime = now;

		currentRound++;
		Game memory newGame = Game({
			round: currentRound,
			state: 1,
			startTime: now,
			endTime: 0,
			nPlayers: 0,
			minPlayers: 3,
			players: new address[](0),
			winner: address(0)
		});
		games.push(newGame);

		games[currentRound].state = 1;
	}
}