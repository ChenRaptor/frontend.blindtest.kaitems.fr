import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export interface CustomSocket {
  id: string;
  username?: string;
}

export interface Room {
  id: string;
  socketNumber: number;
  sockets: CustomSocket[];
}

export interface PhonePageProps {
  params: {
    uuid: string
  }
}