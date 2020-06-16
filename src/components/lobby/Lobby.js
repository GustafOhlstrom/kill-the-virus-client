import './lobby.scss'
import React from 'react'

class Lobby extends React.Component {
    state = {
        username: null,
        error: null,
    }

    handleChange = e => this.setState({ [e.target.id]: e.target.value })

    handleSubmit = e => {
        e.preventDefault()
        
        const { username } = this.state
        this.props.socket.emit('user-register', username, data => {
            if(data.error) {
                this.setState({ error: data.error })
            } else {
                this.props.registerUser(data)
            }
		});
    }

    render() {
        const { error } = this.state
        
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
                        <p className="error">{ error }</p>
                    </div>
                </form>
            </section>
        )
    }
}

export default Lobby