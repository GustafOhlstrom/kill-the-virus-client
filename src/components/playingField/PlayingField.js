import './playingField.scss'
import './loader.scss'
import React from 'react'

function PlayingField(props) {
    const { countdown, virusIcon, winner, roundNr, roundWinner, opponent, user, scores } = props

    let boardContent;
    if(opponent) {
        if(countdown) {
            // Display countdown
            boardContent = <div className="next-round countdown">{ countdown }</div>
        } else if(winner) {
            // Display game winner
            boardContent = (
                <div className="next-round"> 
                    <p>{ winner }</p>
                    <p>{ winner !== "Victory by Surrender" && scores[user.id] + " - " + scores[opponent.id] }</p>  
                </div>
            )
        } else if(roundWinner) {
            // Display round winner
            boardContent = (
                <div className="next-round"> 
                    <p>{ roundWinner === "Draw" ? "Draw" : (roundWinner=== user.name ? "You Won" : "You Lost") }</p>
                    <p className="winning-round">Round { roundNr + 1 }</p>
                </div>
            )
        } else {
            // Display virus
            boardContent = <div className="virus-icon-area">{ virusIcon }</div>
        }
    } else {
        // Display loader and looking for opponent text
        boardContent = (
            <div className="waiting-for-opponent">
                <p>Looking for an opponent</p>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return (
        <section id="playing-field">
            <div className="board">
                { boardContent }
            </div>
        </section>
    )
}

export default PlayingField