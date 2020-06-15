import './playingField.scss'
import React from 'react'

function PlayingField(props) {
    const { countdown, virusIcon, winner, roundNr, roundWinner } = props

    return (
        <section id="playing-field">
            <div className="board">
                {countdown
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
                }   
            </div>
        </section>
    )
}

export default PlayingField