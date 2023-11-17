"use client"

import { useSocket } from "@/providers/socket-provider";
import { useEffect } from "react";

interface PhonePageProps {
  params: {
    uuid: string
  }
}

const enterRoomEmiter = (params: PhonePageProps["params"]) => ({
  room: params.uuid,
  object: {
    type: 'terminal'
  }
})

export default function Terminal({ params }: PhonePageProps) {
  const { socket } = useSocket();

  const socketInitializer = async () => {
    // Socket Emit
    socket.emit("enterRoom", enterRoomEmiter(params));

    // Socket On
    socket.on("terminalJoinRoom", ({room}) => console.log(room));
  }

  useEffect(() => {
    socket && socketInitializer();
  }, [socket]);

  return (
    <div>
      Terminal
    </div>
  )
}

