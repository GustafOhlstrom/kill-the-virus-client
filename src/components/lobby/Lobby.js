import './lobby.scss'
import React from 'react'

class Lobby extends React.Component {
    state = {
        username: null,
    }

    handleChange = e => this.setState({ [e.target.id]: e.target.value })

    handleSubmit = e => {
        e.preventDefault()
        
        const { username } = this.state
        this.props.socket.emit('user-register', username, user => {
            console.log(`Server acknowledged the registration of user: ${username}`);
            this.props.registerUser(user)
		});
    }

    render() {
        return (
            <section id="lobby">
                <form 
                    className="register"
                    onSubmit={this.handleSubmit}
                >
                    <div className="username">
                        <label htmlFor="username">
                            Username
                        </label>
                        <input 
                            id="username"
                            type="text"
                            onChange={this.handleChange}
                        />
                    </div>
                </form>
            </section>
        )
    }
}

export default Lobby