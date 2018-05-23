import React, { Component } from 'react';
import { Card, Button, Form, Message, Grid } from 'semantic-ui-react';
import Layout from '../components/Layout';
import gemFactory from '../ethereum/gemFactory';
import { Link, Router } from '../routes';
import web3 from '../ethereum/web3';

class GemblingIndex extends Component {
	state = {
		loading: false,
		errorMessage: ''
	}

	static async getInitialProps() {
		//const owner = await gemFactory.methods.owner().call();
		const factory = await gemFactory.methods.getDeployedGems().call(); 
		return { factory };
	}

	onTest = async (event) => {
		event.preventDefault();
		const _fac = await gemFactory.methods.getDeployedGems().call();
		console.log(_fac);
		console.log(this.props.factory);
	};

	onAddGem = async (event) => {
		event.preventDefault();

		this.setState({
			loading: true,
			errorMessage: ''
		});

		try {
			const accounts = await web3.eth.getAccounts();
			console.log('accounts :', accounts);
			await gemFactory.methods
				.createGem()
				.send({from: accounts[0]});
			Router.push('/');
		} catch (err) {
			console.log(err.message);
			this.setState({errorMessage: err.message});
		}

		this.setState({loading: false});
	};

	renderGems() {
		const items = this.props.factory.map(address => {
			return {
				header: "Zero Sum",
				description: (
					<Link route={`/gems/${address}/zerosum`}>
					<a>The winner takes it all</a>
					</Link>
				),
				fluid: true
			};
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
			<h3>Welcome to Gembling World!</h3>


			<Grid>
				<Grid.Row>
					<Grid.Column width={10}>
						<Button
							loading={this.state.loading}
							onClick={this.onAddGem}
						 	primary>
						 	Create Gem
						</Button>

						<Button
							onClick={this.onTest}
						 	secondary>
						 	TEST
						</Button>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column width={4}>
						{this.renderGems()}
					</Grid.Column>
				</Grid.Row>
			</Grid>
			
			</Layout>
		);
	}
}

export default GemblingIndex;