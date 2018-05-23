import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Zerosum from '../ethereum/zerosum';

class RowZerosum extends Component {
	/*
	onApprove = async () => {
		const zerosum = Zerosum(this.props.address);
		const accounts = await web3.eth.getAccounts();
		await zerosum.methods.approveRequest(this.props.id)
			.send({
				from: accounts[0]
			});
	};

	onFinalize = async () => {
		const campaign = Campaign(this.props.address);
		const accounts = await web3.eth.getAccounts();
		await campaign.methods.finalizeRequest(this.props.id)
			.send({
				from: accounts[0]
			});
	};
	*/

	render() {
		const { Row, Cell } = Table;
		const { game } = this.props;
		const readyToFinalize = game.nPlayers >= game.minPlayers;

		return (
			<Row disabled={!game.winner} positive={readyToFinalize}>
				<Cell>
					{
						game.state ? (<Button color="green" basic onClick={this.onJoin}>Play</Button>) : null
					}
				</Cell>
				<Cell>{game.round}</Cell>
				<Cell>{game.state}</Cell>
				<Cell>{game.nPlayers} / {game.minPlayers}</Cell>
				<Cell></Cell>
				<Cell>
					{
						game.state ? null : game.winner
					}
				</Cell>
			</Row>
		);
	}
}

export default RowZerosum;