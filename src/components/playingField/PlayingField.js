import './playingField.scss'
import React from 'react'

function PlayingField(props) {
    const { countdown, countdownActive, virusIcon } = props

    return (
        <section id="playing-field">
            <div className="board">
                {countdownActive 
                    ? <div className="next-round">{ countdown }</div>
                    : <div className="virus-icon-area">{ virusIcon }</div> 
                }   
            </div>
        </section>
    )
}

export default PlayingField