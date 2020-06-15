import './scoreboard.scss'
import React from 'react'

function Scoreboard(props) {
    let { user, opponent, rounds, userTimer, opponentTimer } = props
    if(!opponent) opponent = { id: null, name: "..." }

    return (
        <section id="scoreboard">
            <h2>Scoreboard</h2>
            <div className="timers">
                <div className="timer your-timer">
                    <p className="timer-name">{ user.name }</p>
                    <p>{ userTimer }</p>
                </div>
                <div className="timer opponent-timer">
                    <p className="timer-name">{ opponent.name }</p>
                    <p>{ opponentTimer }</p>
                </div>
            </div>
            <p className="scores">5 - 2</p>
            <table>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>{ user.name }</th>
                        <th>{ opponent ? opponent.name : "..." }</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>1</th>
                        {rounds[0]
                            ? <>
                                <td>{ rounds[0][user.id] ? rounds[0][user.id] : "" }</td>
                                <td>{ rounds[0][opponent.id] ? rounds[0][opponent.id] : "" }</td>
                            </>
                            : <>
                                <td></td>
                                <td></td>
                            </>
                        }
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
                </tbody>
            </table>
        </section>
    )
    
}

export default Scoreboard