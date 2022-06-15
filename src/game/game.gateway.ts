import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets'
import {Socket} from 'socket.io'

@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: any
  rooms = {1: []}
  profiles = {}

  @SubscribeMessage('msgToServer')
  handleEvent(client: Socket, text: string) {
    const response = JSON.stringify({
      text,
      id: client.id
    })
    return {
      event: 'msgToClient',
      data: response
    }
  }

  @SubscribeMessage('join')
  joinToRoom(client: Socket, room: number) {
    this.rooms[room].push(client)

    return {
      event: 'joined',
      data: JSON.stringify({room})
    }
  }

  @SubscribeMessage('setProfile')
  setProfiles(client: Socket, profile: any) {
    this.profiles[client.id] = profile

    const response = {}

    this.rooms[1].forEach(roomClient => {
      if (client.id === roomClient.id) {
        response['me'] = this.profiles[roomClient.id]
      } else {
        response['enemy'] = this.profiles[roomClient.id]
      }
    })

    this.rooms[1].forEach(roomClient => {
      roomClient.emit('getProfiles', JSON.stringify({response}))
    })
  }

  handleConnection(client: any, ...args: any[]) {
    client.id = Math.random()
    console.log('User connected')
  }

  handleDisconnect(client: any) {
    this.rooms[1].splice(
      this.rooms[1].findIndex(el => el.id === client.id),
      1
    )
    console.log('User disconnected')
  }

  afterInit(server: any) {
    console.log('Socket is live')
  }
}
