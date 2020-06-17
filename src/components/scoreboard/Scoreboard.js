import './scoreboard.scss'
import React from 'react'

function Scoreboard(props) {
    let { user, opponent, rounds, userTimer, opponentTimer, scores } = props
    if(!opponent) {
        opponent = { id: null, name: "..." }
    }

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
            <p className="scores">{ scores ? scores[user.id] + " - " + scores[opponent.id] : "0 - 0" }</p>
            <table>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>{ user.name }</th>
                        <th>{ opponent.name }</th>
                    </tr>
                </thead>
                <tbody>
                    {rounds.map((round, index) => ( 
                        <tr key={ index + 1 }>
                            <th>{ index + 1 }</th>
                            <td className={ round[user.id] < round[opponent.id] ? "round-win" : ((round[user.id] && round[opponent.id]) && "round-loss") }>
                                { round[user.id] ? round[user.id] : round[1] }
                            </td>
                            <td className={ round[opponent.id] < round[user.id] ? "round-win" : ((round[opponent.id] && round[user.id]) && "round-loss") }>
                                { round[opponent.id] ? round[opponent.id] : round[2] }
                            </td>
                        </tr>  
                    ))}
                </tbody>
            </table>
        </section>
    )
    
}

export default Scoreboard