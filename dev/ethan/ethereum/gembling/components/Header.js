import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
	return (
		<Menu style={{ marginTop: '10px' }}>
			<Link route="/">
				<a className="item">Gembling</a>
			</Link>

			<Menu.Menu position="right">
				<Link route="/">
					<a className="item">Login</a>
				</Link>
				<Link route="/">
					<a className="item">Join</a>
				</Link>
			</Menu.Menu>
		</Menu>
	);
};