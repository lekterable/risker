import React, { Component } from 'react'
import { notify, endGame } from '../actions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class Game extends Component {
	constructor(props) {
		super(props)
		if (!this.props.playing) {
			this.props.notify('error', 'You are not in any game!')
			return this.props.history.push('/')
		}
	}

	state = {
		turn: '',
		host: '',
		player: {
			total: 0,
			round: 0,
			roll: [0, 0]
		},
		opponent: {
			total: 0,
			round: 0,
			roll: [0, 0]
		}
	}

	roll = () => this.props.socket.emit('turn-roll')

	end = () => this.props.socket.emit('turn-end')

	componentDidMount() {
		this.props.socket.emit('ready', game => {
			if (!game && this.props.playing) {
				this.props.endGame()
				this.props.notify('info', 'Game has ended!')
			}
			if (!game) {
				return this.props.history.push('/')
			}
			const player = game.players.find(
				player => player.id === this.props.socket.id
			)
			const opponent = game.players.find(
				player => player.id !== this.props.socket.id
			)
			this.setState({
				turn: game.turn,
				host: game.host,
				player: { ...player },
				opponent: { ...opponent }
			})
		})
		this.props.socket.on('update', game => {
			const player = game.players.find(
				player => player.id === this.props.socket.id
			)
			const opponent = game.players.find(
				player => player.id !== this.props.socket.id
			)
			this.setState({
				turn: game.turn,
				host: game.host,
				player: { ...player },
				opponent: { ...opponent }
			})
		})
		this.props.socket.on('win', game => {
			const player = game.players.find(
				player => player.id === this.props.socket.id
			)
			const opponent = game.players.find(
				player => player.id !== this.props.socket.id
			)
			this.setState({
				turn: game.turn,
				host: game.host,
				player: { ...player },
				opponent: { ...opponent }
			})
			console.log(
				game.players.find(player => player.total + player.round >= 100)
			)
		})
	}

	componentWillUnmount() {
		this.props.socket.off('update')
		this.props.socket.off('win')
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-12 col-md-6 text-center">
						<div>Your total score: {this.state.player.total}</div>
						<div>Your round score: {this.state.player.round}</div>
						<div>
							Your roll:
							<span role="img" aria-label="dice">
								🎲
							</span>
							{this.state.player.roll[0]} and
							<span role="img" aria-label="dice">
								🎲
							</span>
							{this.state.player.roll[1]}
						</div>
					</div>
					<div className="col-12 col-md-6 text-center">
						<div>Opponent's total score: {this.state.opponent.total}</div>
						<div>Opponent's round score: {this.state.opponent.round}</div>
						<div>
							Opponent's roll:
							<span role="img" aria-label="dice">
								🎲
							</span>
							{this.state.opponent.roll[0]} and
							<span role="img" aria-label="dice">
								🎲
							</span>
							{this.state.opponent.roll[1]}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12 col-md-6 text-center">
						<button
							className="btn btn-outline-primary"
							disabled={this.props.socket.id !== this.state.turn}
							onClick={this.roll}
						>
							Roll
						</button>
						<button
							className="btn btn-outline-primary"
							disabled={this.props.socket.id !== this.state.turn}
							onClick={this.end}
						>
							End
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({ ...state }),
	dispatch => ({
		notify: (type, message, title) => dispatch(notify(type, message, title)),
		endGame: () => dispatch(endGame())
	})
)(withRouter(Game))
