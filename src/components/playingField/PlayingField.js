import './playingField.scss'
import virusA from '../../assets/virus-icons/a.svg'
import React from 'react'

class PlayingField extends React.Component {
    state = {
        countDown: 1,
        startGame: false,
        newGame: true,
        virusIcon: null,
    }

    componentDidMount() {
        this.newGame()
    }

    handleOnClick = () => {
        console.log("faaaast")
    }
    
    displayVirus = () => {
        this.setState({
            virusIcon: <img 
                className="virus-icon"
                src={virusA} 
                alt="kill it" 
                style={{ top: "50%", left: "50%" }}
                onClick={this.handleOnClick}
            />
        })
    }

    newRound = () => {
        const { newGame } = this.state

        // Check if new game and set countdown timer accordingly
        newGame
            ? this.setState({ newGame: false })
            : this.setState({ countDown: 3 })

        const roundCountDownId = setInterval(() => {
            if(this.state.countDown <= 1) {
                clearInterval(roundCountDownId)
                this.setState({ startGame: true })
                this.displayVirus()
            }
            this.setState(state => ({ countDown: state.countDown - 1 }))
        }, 1000);
    }

    newGame = () => {
        this.newRound()
    }
    
    render() {
        const { countDown, startGame, virusIcon } = this.state

        return (
            <section id="playing-field">
                {/* Countdown for next round */}
                {!startGame
                    ? <div className="next-round">{ countDown }</div>
                    : <div className="board">{ virusIcon }</div>
                }
            </section>
        )
    }
}

export default PlayingField