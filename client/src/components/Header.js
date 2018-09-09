import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

export default class extends Component {
	render() {
		return (
			<nav className="row navbar navbar-expand-md navbar-light bg-light">
				<NavLink className="navbar-brand" to="/">
					<span role="img" aria-label="dice">
						🎲
					</span>{' '}
					risker app
				</NavLink>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarColor03"
					aria-controls="navbarColor03"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse" id="navbarColor03">
					<ul className="navbar-nav">
						<li className="nav-item">
							<NavLink exact className="nav-link" to="/game">
								<span role="img" aria-label="loupe">
									🕹
								</span>{' '}
								game
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink exact className="nav-link" to="/ranking">
								<span role="img" aria-label="plus">
									📈
								</span>{' '}
								ranking
							</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		)
	}
}
