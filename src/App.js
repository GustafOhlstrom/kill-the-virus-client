import './main.scss'
import React from 'react';
import Lobby from './components/lobby/Lobby'
import PlayingField from './components/playingField/PlayingField'
import Scoreboard from './components/scoreboard/Scoreboard'

import socketIOClient from 'socket.io-client';

import virusA from './assets/virus-icons/a.svg'
import virusB from './assets/virus-icons/b.svg'
import virusC from './assets/virus-icons/c.svg'

const initialState = {
	socket: null,
	roomName: null,

	user: null,				
	opponent: null,	
	
	winner: null,
	scores: null,		
	
	countdown: null,
	virusIcon: null,
	virusFound: null,

	roundTimerId: null,
	userTimer: "00:00.000",
	opponentTimer: "00:00.000",
	
	roundWinner: false,
	roundNr: 0,
	rounds: [
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
		{ 1: "", 2: "" },
	]
}

class App extends React.Component{

	state = initialState

	componentDidMount() {
		const socket = socketIOClient('https://kill-the-virus-server.herokuapp.com');

		// Display each countdown number from server
		socket.on('countdown', countdown => {
			countdown === 0 
				? this.setState({ countdown: null, userTimer: "00:00.000", opponentTimer: "00:00.000" })
				: this.setState({ countdown, })
		})

		// Display virus icon with coordinates from server and save start time
		socket.on('display-virus', data => {
			const { top, left, startTime } = data
			this.displayVirus(top,left)
			
			// Start timers
			const timerId = setInterval(() => {
				const { roundNr, rounds, user, opponent, roundTimerId } = this.state
				const round = rounds[roundNr]
				
				// save timerId in case of a surrender (disconnect)
				if(!roundTimerId) {
					this.setState({ roundTimerId: timerId })
				}
				
				// Format time
				const milliseconds = new Date() - startTime
				let time = this.getTimeString(milliseconds)

				const playerRound = round[user.id]
				const opponentRound = round[opponent.id]

				// Stop timer if more that 10 seconds have passed and hide icon , while waiting for server stop
				if(milliseconds >= 10000) {
					time = this.getTimeString(10000)
					this.setState({ virusIcon: null })
				}
				
				if(!playerRound && !opponentRound) {
					// None done - update both user and opponent
					this.setState({ userTimer: time, opponentTimer: time })
				} else if(!playerRound) {
					// Opponent done - update only user 
					this.setState({ userTimer: time  })
				} else if(!opponentRound) {
					// User done - update only opponent
					this.setState({ opponentTimer: time  })
				} else {
					// Both done - clear timer
					clearInterval(timerId)
				}
			}, 10);
		})

		// Update base data for new round
		socket.on('new-round', roundNr => ( 
			this.setState({ 
				roundWinner: false,
				roundTimerId: null,
				countdown: null, 
				virusIcon: null, 
				virusFound: false, 
				roundNr 
			}))
		)

		// When two user are connected save opponent and room name
		socket.on('opponent-found', data => {
			const { user } = this.state
			
			// Save opponent id and name
			let opponent;
			Object.keys(data.players).forEach(id => {
				if(id !== user.id) {
					opponent = { id, name: data.players[id] }
				}
			})

			// Add players id to rounds array
			let rounds = []
			for(let i = 0; i < 10; i++) {
				rounds.push({
					[user.id]: "",
					[opponent.id]: ""
				})
			}

			this.setState({ opponent, roomName: data.name, rounds })
		})

		// Display round winner
		socket.on('round-winner', data => {
			const { user, opponent } = this.state
			const { winner, scores } = data
			
			// Update score and winner depending on output
			if(!winner) {
				this.setState({ roundWinner: "Draw", scores })
			} else if(winner === user.id) {
				this.setState({ roundWinner: user.name, scores })
			} else {
				this.setState({ roundWinner: opponent.name, scores })
			}

		})

		// Update scoreboard
		socket.on('scoreboard-update', times => {
			const { user, opponent, roundNr } = this.state
            // Save times
			this.setState(state => {
				let rounds = [...state.rounds]
				let formatedTime = {}

				// Format time 
				Object.keys(times).forEach(id => formatedTime[id] = this.getTimeString(times[id]))
				rounds[roundNr] = formatedTime;

				// Update rounds and user and opponent timer if they are done
				let newStates = { rounds }
				if(rounds[roundNr][user.id]) {
					newStates.userTimer = rounds[roundNr][user.id]
				}
				if(rounds[roundNr][opponent.id]) {
					newStates.opponentTimer = rounds[roundNr][opponent.id]
				}

				return newStates
			})
		})

		// Display winner 
		socket.on('surrender', winner => {
			clearInterval(this.state.roundTimerId)
			this.setState({ winner: "Victory by Surrender", countdown: null  })
		})

		// Display winner 
		socket.on('winner', winner => {
			winner === "Draw"
				? this.setState({ winner })		
				: winner === this.state.user.id
					? this.setState({ winner: "Victory" })
					: this.setState({ winner: "Defeat" })
		})

		this.setState({ socket })
	}

	// Display virus with cordinates from server
    displayVirus = (top, left) => {
		// Select random virus icon
		const randomIcon = [virusA, virusB, virusC][(Math.floor(Math.random() * 3))]
        this.setState({
            virusIcon: <img 
                className="virus-icon"
                src={randomIcon} 
                alt="kill it" 
                style={{top: top + "%", left: left + "%"}}
                onClick={this.handleOnClick}
            />
        })
	}

	// Reset state and start looking for a new opponent for a new game
	findNewOpponent = () => {
		const { user, socket } = this.state
		// Re-register user to server and create new state with that user
		socket.emit('find-new-opponent', user.name, user => {
			const newState = initialState
			newState.user = user
			newState.socket = socket
			this.setState(initialState)
		});
	}

	// Returns formated time string
	getTimeString = time => (
		("0" + Math.floor((time / (1000 * 60)) % 60)).slice(-2) + ":" +
		("0" + Math.floor((time / 1000) % 60)).slice(-2) + "." +
		("00" + Math.floor(time % 1000)).slice(-3)
	)

	// Handle clicking on the virus icon
	handleOnClick = () => {
		const { socket, roomName, virusFound } = this.state 
		if(!virusFound) {
			const clickTime = new Date().getTime()

			this.setState({ virusFound: true, virusIcon: null })
			
			// Send time taken to click virus to both players
			socket.emit('click-virus', { clickTime, roomName } )
		}
	}

	// Handle clicking the mobile scoreboard icon to display / hide scoreboard
	handleScoreboardArrowClick = () => {
		document.querySelector('#scoreboard').classList.toggle('scoreboard-hide')
	}

	// Save username
	registerUser = user => this.setState({ user })

	render() {
		const { user, opponent, winner, scores, socket, countdown,  virusIcon, userTimer, opponentTimer, rounds, roundNr, roundWinner } = this.state

		return (
			<main id="app">
				<h1 className="title">Kill The Virus</h1>
				{ user && 
					<button
						className="scoreboard-toggle"
						onClick={this.handleScoreboardArrowClick}
					>
						View Scoreboard
					</button> 
				}
				{/* {user && <button className="scoreboard-button">Scoreboard</button>} */}
				<div className="flex-container">
					{user
						? <>
							<PlayingField 
								countdown={countdown}
								virusIcon={virusIcon}
								roundNr={roundNr}
								winner={winner}
								roundWinner={roundWinner}
								opponent={opponent}
								user={user}
								scores={scores}
								findNewOpponent={this.findNewOpponent}
							/>
							<Scoreboard 
								user={user}
								opponent={opponent}
								rounds={rounds}
								userTimer={userTimer}
								opponentTimer={opponentTimer}
								scores={scores}
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
