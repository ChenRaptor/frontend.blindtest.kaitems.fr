// SocketHandler.ts

import { Server, Socket } from 'socket.io';

const socketJoiner = (socket : Socket, room: string) => {
  console.log(`Socket ${socket.id} s'est connectée à la room ${room}`);
  socket.join(room);
}

const extendSocketData = (socket: Socket, object:any) => {
  socket.data.user = {
    id: socket.id,
    username: object.pseudo,
  }
  return socket
}

const getSocketsInRoom = async (io: Server, room: string) => {
  return (await io.in(room)
    .fetchSockets())
}

const getSocketsData = (res: any[]) => {
  return res.filter((socket) => socket.data.hasOwnProperty('user'))
    .map((socket) => socket.data.user)
}

const userJoinRoomEmitter = (socket: Socket, room: string, users: any[]) => ({
  room: {
    id: room,
    socketNumber: users.length,
    sockets: users,
  },
  newPlayer: socket.data.user,
})

const terminalJoinRoomEmitter = (room: string, users: any[]) => ({
  room: {
    id: room,
    socketNumber: users.length,
    sockets: users,
  },
})


// Player
// Signaler arrivé à tous les autres joueurs
// Obtenir les autres joueurs

// Terminal
// Signaler début de partie?
// Obtenir les autres joueurs

interface HandleEnterRoomProps {
  room: string
  object: {
    type: 'player' | 'terminal'
    pseudo?: string 
  }
}

export const handleEnterRoom = (io: Server, socket: Socket) => (
  { room, object }: HandleEnterRoomProps
) => {




  if (!socket.rooms.has(room)) {
    socketJoiner(socket, room)

    if (object.type === 'player') {
      extendSocketData(socket, object)
      getSocketsInRoom(io, room)
        .then(res => {
          io.to(room).emit('userJoinRoom', userJoinRoomEmitter(socket, room, getSocketsData(res)));
        })
    }

    if (object.type === 'terminal') {
      getSocketsInRoom(io, room)
        .then(res => {
          socket.emit('terminalJoinRoom', terminalJoinRoomEmitter(room, getSocketsData(res)));
        })
      setInterval(() => {
        io.to(room).emit('ping', "Server respond!");
      }, 5000);
    }



  } else {
    console.log(`Socket ${socket.id} est déjà connectée à la room ${room}`);
  }
};
