import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { connectSocket, createNotifier } from '../actions'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import io from 'socket.io-client'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Home from './Home'
import Ranking from './Ranking'
import Game from './Game'
import './index.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.props.connectSocket(io.connect('http://localhost:3001'))
    this.props.createNotifier(NotificationManager)
  }
  render() {
    return (
      <div>
        <Router>
          <div className="container App">
            <Header />
            <NotificationContainer />
            <Switch>
              <Route exact path="/ranking" render={() => <Ranking />} />
              <Route exact path="/game" render={() => <Game />} />
              <Route render={() => <Home />} />
            </Switch>
            <Footer content="Made with ♥ by github.com/lekterable" />
          </div>
        </Router>
      </div>
    )
  }
}

const mapStateToProps = state => ({ socket: state.socket })
const mapDispatchToProps = dispatch => ({
  connectSocket: socket => dispatch(connectSocket(socket)),
  createNotifier: manager => dispatch(createNotifier(manager))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
