import { io } from 'socket.io-client'

class SocketioService {
  socket: any

  constructor() {}

  connectChat(user: any) {
    const url = '/chat'
    this.socket = io(url, {
      auth: {
        user: user
      }
    })
  }
  disconnect() {
    if (this.socket) {
      //console.log('hello from socket service')
      this.socket.disconnect()
    }
  }
}

const chatSocketService = new SocketioService()

export default chatSocketService
