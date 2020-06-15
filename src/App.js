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
		opponent: null,			
		room: null,

		countdown: null,
        countdownActive: false,
        newGame: true,
		virusIcon: null,

		virusFound: null,

		userTimer: "00:00.000",
		opponentTimer: "00:00.000",
		rounds: [
			// {
			// 	userId: "time in milliseconds",
			// 	opponentId: "time in milliseconds"
			// },
		]
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
			console.log(Object.entries(data.players))
			
			let opponent;
			Object.keys(data.players).forEach(id => {
				if(id !== this.state.user.id) opponent = { id, name: data.players[id]}
			})

			this.setState({ opponent, room: data.name, countdownActive: true })
		})

		// Display each countdown number from server
		socket.on('countdown', countdown => {
			console.log(countdown)
			countdown === 0 
				? this.setState({ countdownActive: false })
				: this.setState({ countdown })
		})

		// Display virus icon with coordinates from server and save start time
		socket.on('display-virus', data => {
			const { top, left, startTime } = data
            console.log(`Virus displayed`, top + " " + left)
			this.displayVirus(top,left)
			
			// Start timers
			const timerId = setInterval(() => {
				const { rounds, user, opponent } = this.state
				const round = rounds[Object.keys(rounds).length - 1]
				
				const time = this.getTimeString(new Date() - startTime)

				// Update both user and opponent
				if(!round) {
					this.setState({ userTimer: time, opponentTimer: time })
				} else {
					const playerRound = round[user.id]
					const opponentRound = round[opponent.id]
					// Update only user 
					if(!playerRound) {
						this.setState({ userTimer: time  })
					// Update only opponent
					} else if(!opponentRound) {
						this.setState({ opponentTimer: time  })
					// Update only opponent
					} else {
						clearInterval(timerId)
					}
				}
				
			}, 10);
		})

		// Update scoreboard
		socket.on('scoreboard-update', data => {
			const { user, opponent } = this.state
			let { round, times } = data

            // Save times
			this.setState(state => {
				let rounds = [...state.rounds]
				let formatedTime = {}

				// Format time 
				Object.keys(times).forEach(id => formatedTime[id] = this.getTimeString(times[id]))
				rounds[round] = formatedTime;

				// Update rounds and each timer
				let newStates = { rounds }
				if(rounds[round][user.id]) newStates.userTimer = rounds[round][user.id]
				if(rounds[round][opponent.id]) newStates.opponentTimer = rounds[round][opponent.id]

				return newStates
			})
		})

		this.setState({ socket })
	}

	// Handle clicking on the virus icon
	handleOnClick = () => {
		const { socket, room, virusFound, rounds } = this.state 
		if(!virusFound) {
			const clickTime = new Date().getTime()

			this.setState({ virusFound: true })
			
			// Send time taken to click virus to both players
			socket.emit('click-virus', { clickTime, room } );
		}
	}

	// Save username
	registerUser = user => this.setState({ user })

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
	
	getTimeString = time => (
		("0" + Math.floor((time / (1000 * 60)) % 60)).slice(-2) + ":" +
		("0" + Math.floor((time / 1000) % 60)).slice(-2) + "." +
		("00" + Math.floor(time % 1000)).slice(-3)
	)		

	render() {
		const { user, opponent, socket, countdown, countdownActive, virusIcon, userTimer, opponentTimer, rounds } = this.state

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
							<Scoreboard 
								user={user}
								opponent={opponent}
								rounds={rounds}
								userTimer={userTimer}
								opponentTimer={opponentTimer}
							/>
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
