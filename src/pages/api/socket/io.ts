import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/type"

export default function SocketHandler( req: NextApiRequest, res: NextApiResponseServerIo ) {

  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server as any);
  res.socket.server.io = io;

  const onConnection = (socket: any) => {

  };

  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}