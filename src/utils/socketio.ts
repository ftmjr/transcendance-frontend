import { io } from 'socket.io-client'

class SocketioService {
  socket: any

  constructor() {}

  connectChat(socketOptions: any) {
    const url = '/chat'
    this.socket = io(url, socketOptions) // connects to websocket in the backend
    //console.log('hello from socket service')
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
