import './playingField.scss'
import React from 'react'

class PlayingField extends React.Component {
    state = {}

    render() {
        return (
            <section id="playingField">
                {/* Countdown for next round */}
                <div className="next-round">
                    3
                </div>
                <canvas></canvas>
            </section>
        )
    }
}

export default PlayingField