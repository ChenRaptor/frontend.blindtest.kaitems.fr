"use client"

import { useSocket } from "@/providers/socket-provider";
import { PhonePageProps } from "@/type";
import { useEffect, useState } from "react";
import YouTubeAudioExtractor from "./components/YouTubeAudioExtractor";
// import YouTube, { YouTubeProps } from 'react-youtube';

export default function Terminal({ params }: PhonePageProps) {
  const { socket } = useSocket();
  const [ gameStatusPage , setGameStatusPage] = useState();

  const socketActions = async () => {
    // Socket Emit
    socket.emit("launchGame", {room: params.uuid});

    // Socket On
    socket.on("terminalJoinRoom", ({room}) => console.log(room));
    socket.on("game-status", ({gameStatus}) => setGameStatusPage(gameStatus));
  }

  useEffect(() => {
    socket && socketActions();
  }, [socket]);

  return (
    <div>
      {
        (gameStatusPage as any)?.currentStep === "launching-game-countdown" ?
          <>
            <p>Launching game</p>
            <p className='text-5xl'>{(gameStatusPage as any)?.response?.countdown}</p>
          </>
          :
          (gameStatusPage as any)?.currentStep === "game-in-progress" ?
          <>
            <p>Question 1</p>
            <p className='text-5xl'>{(gameStatusPage as any)?.response?.countdown}</p>
          </>
          :
        null
      }
    </div>
  )
}

