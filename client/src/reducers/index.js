export default (state = { socket: {} }, action) => {
  switch (action.type) {
    case 'CREATE_NOTIFIER':
      return { ...state, notifier: action.payload }
    case 'NOTIFY':
      state.notifier[action.payload.type](
        action.payload.message,
        action.payload.title
      )
      return { ...state }
    case 'CONNECT_SOCKET':
      return { ...state, socket: action.payload }
    case 'START_GAME':
      return { ...state, room: action.payload, playing: true }
    case 'END_GAME':
      return { ...state, room: '', playing: false }
    default:
      return state
  }
}
