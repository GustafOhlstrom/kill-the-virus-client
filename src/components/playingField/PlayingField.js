import './playingField.scss'
import './loader.scss'
import React from 'react'

function PlayingField(props) {
    const { countdown, virusIcon, winner, roundNr, roundWinner, opponent } = props

    return (
        <section id="playing-field">
            <div className="board">
                {opponent 
                    ? countdown
                        ? <div className="next-round">{ countdown }</div>
                        : winner || roundWinner 
                            ? <div className="next-round">
                                {winner 
                                    ? <p>{ winner }</p>
                                    : <>
                                        <p>{ roundWinner }</p>
                                        <p className="winning-round">Won Round { roundNr + 1 }</p>
                                    </> 
                                }
                            </div>
                            : <div className="virus-icon-area">{ virusIcon }</div> 
                    : <div className="waiting-for-opponent">
                        <p>Looking for an opponent</p>
                        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                } 
            </div>
        </section>
    )
}

export default PlayingField