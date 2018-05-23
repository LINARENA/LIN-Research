import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import Zerosum from '../../../ethereum/zerosum';
import Layout from '../../../components/Layout';
import RowZerosum from '../../../components/RowZerosum';

class ZeroSumIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;
		const zerosum = Zerosum(address);
		const rounds = await zerosum.methods.currentRound().call();
		const games = await Promise.all(
			Array(parseInt(rounds)+1)
				.fill()
				.map((ele, idx) => {
					return zerosum.methods.games(idx).call()
				})
		);

		return { rounds, games };
	}

	renderRows() {
		return this.props.games.map((game, idx) => {
			return <RowZerosum 
				key={idx}
				game={game} />;
		});
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table;
		return (
			<Layout>
			<h3>ZeroSum List</h3>

			<Table>
				<Header>
					<Row>
						<HeaderCell>Play</HeaderCell>
						<HeaderCell>Round</HeaderCell>
						<HeaderCell>State</HeaderCell>
						<HeaderCell>Players</HeaderCell>
						<HeaderCell>Prize</HeaderCell>
						<HeaderCell>Winner</HeaderCell>
					</Row>
				</Header>
				<Body>
					{this.renderRows()}
				</Body>
			</Table>

			</Layout>
		);
	}
}

export default ZeroSumIndex;