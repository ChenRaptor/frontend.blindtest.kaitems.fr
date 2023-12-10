"use client"

import { useSocket } from "@/providers/socket-provider";
import { PhonePageProps } from "@/type";
import { useEffect } from "react";
import YouTubeAudioExtractor from "./components/YouTubeAudioExtractor";
// import YouTube, { YouTubeProps } from 'react-youtube';

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

  // const onPlayerReady: YouTubeProps['onReady'] = (event) => {
  //   // access to player in all event handlers via event.target
  //   event.target.pauseVideo();
  // }

  // const opts: YouTubeProps['opts'] = {
  //   height: '390',
  //   width: '640',
  //   playerVars: {
  //     // https://developers.google.com/youtube/player_parameters
  //     autoplay: 1,
  //   },
  // };

  return (
    <div>
      Terminal
      <YouTubeAudioExtractor />
      {/* <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={onPlayerReady} />; */}
    </div>
  )
}

