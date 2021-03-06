export const connectSocket = socket => ({
  type: 'CONNECT_SOCKET',
  payload: socket
})
export const startGame = room => ({ type: 'START_GAME', payload: room })
export const endGame = () => ({ type: 'END_GAME' })
export const createNotifier = manager => ({
  type: 'CREATE_NOTIFIER',
  payload: manager
})
export const notify = (type, message, title) => ({
  type: 'NOTIFY',
  payload: { type, message, title }
})
