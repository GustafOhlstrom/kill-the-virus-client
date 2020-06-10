import './main.scss'
import React from 'react';
import PlayingField from './components/playingField/PlayingField'
import Scoreboard from './components/scoreboard/Scoreboard'

function App() {
	return (
		<main id="app">
			<h1 className="title">Kill The Virus</h1>
			<div className="flex-container">
				<PlayingField />
				<Scoreboard />
			</div>
		</main>
	);
}

export default App;
