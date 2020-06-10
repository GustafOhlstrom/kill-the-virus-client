import './scoreboard.scss'
import React from 'react'

class Scoreboard extends React.Component {
    state = {}

    render() {
        return (
            <section id="scoreboard">
                <h2>Scoreboard</h2>
                <div className="timers">
                    <div className="timer your-timer">
                        <p className="timer-name">Player 1</p>
                        <p>00:01.412</p>
                    </div>
                    <div className="timer opponent-timer">
                        <p className="timer-name">Player 2</p>
                        <p>00:02.412</p>
                    </div>
                </div>
                <p className="scores">5 - 2</p>
                <table>
                    <tr>
                        <th>Round</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                    </tr>
                    <tr>
                        <th>1</th>
                        <td>00:01.412</td>
                        <td>00:03.012</td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td>00:01.400</td>
                        <td>00:02.523</td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td>00:01.412</td>
                        <td>00:03.012</td>
                    </tr>
                    <tr>
                        <th>4</th>
                        <td>00:01.400</td>
                        <td>00:02.523</td>
                    </tr>
                    <tr>
                        <th>5</th>
                        <td>00:01.412</td>
                        <td>00:03.012</td>
                    </tr>
                    <tr>
                        <th>6</th>
                        <td>00:01.412</td>
                        <td>00:03.012</td>
                    </tr>
                    <tr>
                        <th>7</th>
                        <td>00:01.400</td>
                        <td>00:02.523</td>
                    </tr>
                    <tr>
                        <th>8</th>
                        <td>00:01.412</td>
                        <td>00:03.012</td>
                    </tr>
                    <tr>
                        <th>9</th>
                        <td>00:01.400</td>
                        <td>00:02.523</td>
                    </tr>
                    <tr>
                        <th>10</th>
                        <td>00:01.412</td>
                        <td>00:03.012</td>
                    </tr>
                </table>
            </section>
        )
    }
}

export default Scoreboard