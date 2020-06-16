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
		room: null,

		user: null,				
		opponent: null,	
		
		newGame: true,
		winner: null,
		scores: null,		
		
		countdown: null,
		virusIcon: null,
		virusFound: null,

		userTimer: "00:00.000",
		opponentTimer: "00:00.000",
		
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

	componentDidMount() {
		const socket = socketIOClient('http://localhost:3000');

		// Display each countdown number from server
		socket.on('disconnect', data => {
			// console.log(data.username)
			// console.log(data.id)
		})

		// When two user are connected save opponent and room name
		socket.on('opponent-found', data => {
			const { user } = this.state
			
			// Save opponent id and name
			let opponent;
			Object.keys(data.players).forEach(id => {
				if(id !== user.id) opponent = { id, name: data.players[id] }
			})

			// Add players id to rounds array
			let rounds = []
			for(let i = 0; i < 10; i++) {
				rounds.push({
					[user.id]: "",
					[opponent.id]: ""
				})
			}

			this.setState({ opponent, room: data.name, rounds })
		})

		// Update base data for new round
		socket.on('newRound', roundNr => ( 
			this.setState({ 
				roundWinner: false,
				countdown: null, 
				virusIcon: null, 
				virusFound: false, 
				roundNr 
			}))
		)

		// Display each countdown number from server
		socket.on('countdown', countdown => {
			countdown === 0 
				? this.setState({ countdown: null })
				: this.setState({ countdown, })
		})

		// Display virus icon with coordinates from server and save start time
		socket.on('display-virus', data => {
			const { top, left, startTime } = data
			
			this.displayVirus(top,left)
			
			// Start timers
			const timerId = setInterval(() => {
				const { roundNr, rounds, user, opponent } = this.state
				const round = rounds[roundNr]
				
				// Format time
				const time = this.getTimeString(new Date() - startTime)

				const playerRound = round[user.id]
				const opponentRound = round[opponent.id]

				// None done - update both user and opponent
				if(!playerRound && !opponentRound) this.setState({ userTimer: time, opponentTimer: time })
				// Opponent done - update only user 
				else if(!playerRound) this.setState({ userTimer: time  })
				// User done - update only opponent
				else if(!opponentRound) this.setState({ opponentTimer: time  })
				// Both done - clear timer
				else clearInterval(timerId)
				
			}, 10);
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
				if(rounds[roundNr][user.id]) newStates.userTimer = rounds[roundNr][user.id]
				if(rounds[roundNr][opponent.id]) newStates.opponentTimer = rounds[roundNr][opponent.id]

				return newStates
			})
		})

		// Display round winner
		socket.on('round-winner', data => {
			const { user, opponent } = this.state
			const { winner, scores } = data
			winner === user.id
				? this.setState({ roundWinner: user.name, scores })
				: this.setState({ roundWinner: opponent.name, scores })
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

	// Handle clicking on the virus icon
	handleOnClick = () => {
		const { socket, room, virusFound } = this.state 
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
		const { user, opponent, winner, scores, socket, countdown,  virusIcon, userTimer, opponentTimer, rounds, roundNr, roundWinner } = this.state

		return (
			<main id="app">
				<h1 className="title">Kill The Virus</h1>
				<div className="flex-container">
					{user
						? <>
							<PlayingField 
								countdown={countdown}
								virusIcon={virusIcon}
								roundNr={roundNr}
								winner={winner}
								roundWinner={roundWinner}
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
