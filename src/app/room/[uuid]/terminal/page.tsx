"use client"

import { useSocket } from "@/providers/socket-provider";
import { PhonePageProps } from "@/type";
import { useEffect } from "react";

export default function Terminal({ params }: PhonePageProps) {
  const { socket } = useSocket();

  const socketActions = async () => {
    // Socket Emit
    socket.emit("launchGame", {room: params.uuid});

    // Socket On
    socket.on("terminalJoinRoom", ({room}) => console.log(room));
    socket.on("game-status", ({gameStatus}) => console.log(gameStatus));
    // socket.on("ping", (val) => console.log(val));
  }
  useEffect(() => {
    socket && socketActions();
  }, [socket]);

  return (
    <div>
      Terminal
    </div>
  )
}

