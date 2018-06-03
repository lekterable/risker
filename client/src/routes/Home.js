import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startGame, endGame, notify } from '../actions'
import { withRouter } from 'react-router-dom'
import './Home.css'

class Home extends Component {
  state = {
    players: [],
    opponent: ''
  }
  invite = () => {
    this.props.startGame(this.props.socket.id)
    this.props.socket.emit('invitation', this.state.opponent, (res) => res?this.handleAcceptedInvite():this.handleDeclinedInvite())
  }
  handleAcceptedInvite = () => {
    this.props.notify('success', 'Accepted')
  }
  handleDeclinedInvite = () => {
    this.props.notify('error', 'Declined')
  }
  acceptInvite = (room, callback) => {
    callback(true)
    this.props.startGame(room)
  }
  declineInvite = (room, callback) => {
    callback(false)
    this.props.endGame(room)
  }
  componentDidMount() {
    this.props.socket.emit('info')

    this.props.socket.on('start-game', ()=>{
      this.props.history.push('/game')
    })

    this.props.socket.on('info', (data) => {
      this.setState({players: data.players.filter((player) => player !== this.props.socket.id)})
    })
    
    this.props.socket.on('invitation', (data, callback) => {
      if(this.props.playing)
        return callback(false)
      this.props.notify('info', <span><button className='btn btn-primary btn-sm' onClick={() => this.acceptInvite(data, callback)}>Accept</button><button className='btn btn-primary btn-sm' onClick={() => this.declineInvite(data, callback)}>Decline</button></span>,'Received an invitation!')
    })
    
  }
  componentWillUnmount() {
    this.props.socket.off('start-game')
    this.props.socket.off('info')
    this.props.socket.off('invitation')
  }
  render(){
    const players = this.state.players.map((player, index) => <li className='list-group-item text-center' key={index}>{player}</li>)
    return (
      <div className='main'>
        <div className='form-group row'>
          <label className='col-3 offset-md-3 col-md-2 offset-lg-4 col-lg-1 col-form-label text-center'>My ID:</label>
          <div className='col-9 col-md-5 col-lg-3'><input className='form-control text-center' type='text' readOnly value={this.props.socket.id || ''}/></div>
        </div>
        <div className='players-list row'>
          <div className='text-center col-12'>Players:</div>
          <div className='col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4'>
            <ul className='list-group'>
              {players}
            </ul>
          </div>
        </div>
        <div className='invite-form row'>
          <div className='col-12 text-center'>
            <input className='form-control text-center col-8 offset-2 col-md-4 offset-md-4' placeholder='Insert ID' type='text' value={this.state.opponent} onChange={(e) => this.setState({opponent: e.target.value})}/>
            <button className='btn btn-outline-primary' onClick={() => this.props.socket.id !== this.state.opponent?this.invite():''}>Invite</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({...state})
const mapDispatchToProps = (dispatch) => ({startGame: (room) => dispatch(startGame(room)), notify: (type, message, title) => dispatch(notify(type, message, title)), endGame: (room) => dispatch(endGame(room))})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))