// SocketHandler.ts

import { Server, Socket } from 'socket.io';

export const handleEnterRoom = (io: Server, socket: Socket) => (
  { room_id, object }: { room_id: string; object: { type: 'player' | 'tablet'; pseudo?: string } }
) => {
  if (!socket.rooms.has(room_id)) {
    console.log(`Socket ${socket.id} s'est connectée à la room ${room_id}`);
    socket.join(`room-/${room_id}`);

    if (object.type === 'player') {
      socket.data.user = {
        socket_id: socket.id,
        pseudo: object.pseudo,
      };

      io.in(`room-/${room_id}`)
        .fetchSockets()
        .then((res) => {
          const socketsInRoom = res
            .filter((socket) => socket.data.hasOwnProperty('user'))
            .map((socket) => socket.data.user);

          console.log(socketsInRoom);
          io.to(`room-/${room_id}`).emit('userJoinRoom', {
            room: {
              id: `room-/${room_id}`,
              socketNumber: socketsInRoom.length,
              sockets: socketsInRoom,
            },
            newPlayer: socket.data.user,
          });
        });
    }
  } else {
    console.log(`Socket ${socket.id} est déjà connectée à la room ${room_id}`);
  }
};
