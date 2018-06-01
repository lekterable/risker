import React, { Component } from 'react'
import { connect } from 'react-redux'

class Ranking extends Component {
  render(){
    const players = ['player1', 'player2', 'player3', 'player4'].map((player, index) => <li key={index}>{player}</li>)
    return (
      <div>
        {players}
      </div>
    )
  }
}
const mapStateToProps = (state) => ({...state})
export default connect(mapStateToProps)(Ranking)