import './main.scss'
import React from 'react';
import Lobby from './components/lobby/Lobby'
import PlayingField from './components/playingField/PlayingField'
import Scoreboard from './components/scoreboard/Scoreboard'

import socketIOClient from 'socket.io-client';

class App extends React.Component{

	state = {
		socket: null,
		user: null,
	}

	componentDidMount() {
		const socket = socketIOClient('http://localhost:3000');
		socket.emit('register-user', (status) => {
			console.log("Server acknowledged the registration :D", status);
		});

		this.setState({ socket })
	}

	registerUser = username => this.setState({ user: username })

	render() {
		const { user, socket } = this.state
		return (
			<main id="app">
				<h1 className="title">Kill The Virus</h1>
				<div className="flex-container">
					{user
						? <>
							<PlayingField />
							<Scoreboard />
						</>
						: <Lobby 
							socket={socket}
							registerUser={username => this.registerUser(username)}
						/>}
				</div>
			</main>
		)
	}
}

export default App;
