import './main.scss'
import React from 'react';
import Lobby from './components/lobby/Lobby'
import PlayingField from './components/playingField/PlayingField'
import Scoreboard from './components/scoreboard/Scoreboard'

import socketIOClient from 'socket.io-client';

import virusA from './assets/virus-icons/a.svg'

class App extends React.Component{

	state = {
		socket: null,
		user: null,
		room: null,

		countdown: null,
        countdownActive: false,
        newGame: true,
        virusIcon: null,
	}

	componentDidMount() {
		const socket = socketIOClient('http://localhost:3000');

		// Log when someone connects 
		socket.on('new-user-connected', (username) => {
			console.log(`${username} connected to the game 🥳!`)
		})

		// When two user are connected save room name and display countdown for next round
		socket.on('opponent-found', data => {
			console.log(`Server acknowledged two players ${Object.keys(data)}, game is stating:`)
			this.setState({ room: data.name, countdownActive: true })
		})

		// Display each countdown number from server
		socket.on('countdown', countdown => {
			console.log(countdown)
			countdown === 0 
				? this.setState({ countdownActive: false })
				: this.setState({ countdown })
		})

		// Display virus icon with coordinates from server
		socket.on('display-virus', data => {
			const { top, left } = data
            console.log(`Virus displayed`, top + " " + left)
            this.displayVirus(top,left)
		})

		this.setState({ socket })
	}

	// Save username
	registerUser = username => this.setState({ user: username })

	// Display virus with cordinates from server
    displayVirus = (top, left) => {
        this.setState({
            virusIcon: <img 
                className="virus-icon"
                src={virusA} 
                alt="kill it" 
                style={{top: top + "%", left: left + "%"}}
                onClick={this.handleOnClick}
            />
        })
    }

	render() {
		const { user, socket, countdown, countdownActive, virusIcon } = this.state

		return (
			<main id="app">
				<h1 className="title">Kill The Virus</h1>
				<div className="flex-container">
					{user
						? <>
							<PlayingField 
								countdown={countdown}
								countdownActive={countdownActive}
								virusIcon={virusIcon}
							/>
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
