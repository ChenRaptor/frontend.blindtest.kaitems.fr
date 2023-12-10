import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/type"
import { handleEnterRoom } from "@/lib/socket";

function startCountdown(io: any, room: string, gameStatus: any): Promise<void> {
  return new Promise((resolve) => {
    
    let secondsLeft : number = 15;
    switch (gameStatus.currentStep) {
      case "launching-game-countdown":
        secondsLeft = 5;
        break;
      case "game-in-progress":
        secondsLeft = 15;
        break;
    }
    
    const countdownInterval = setInterval(() => {
      // Emit the countdown event to all sockets in the room
      gameStatus.response.countdown = secondsLeft;
      
      io.to(room).emit('game-status', { gameStatus });
      
      if (secondsLeft === 0) {
        // Countdown finished, resolve the promise
        clearInterval(countdownInterval);
        console.log(`Game started in room ${room}`);
        resolve();
      } else {
        secondsLeft--;
      }
    }, 1000);
  });
}

async function startGameRound(io: any, room: string, socket: any) {
  let gameStatus : any = {
    currentStep: "launching-game-countdown",
    response: {
      countdown: 5,
      players: [
        {player: "player1", score: 0},
        {player: "player2", score: 0},
        {player: "player3", score: 0},
        {player: "player4", score: 0},
      ]
    }
  };

  await startCountdown(io, room, gameStatus);

  gameStatus = {
    currentStep: "game-in-progress",
    response: {
      step: {
        question: "Cette musique est associée à quel série ?",
        musiqueLink: "https://www.youtube.com/watch?v=1q6QOYtT3uM",
        options: ["Paris", "London", "Berlin", "Madrid"],
      },
      countdown: 15,
      players: [
        {player: "player1", score: 0},
        {player: "player2", score: 0},
        {player: "player3", score: 0},
        {player: "player4", score: 0},
      ]
    }
  };

  await startCountdown(io, room, gameStatus);

  io.to(room).emit('game-status', { gameStatus: "finish" });
}


export default function SocketHandler( req: NextApiRequest, res: NextApiResponseServerIo ) {

  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server as any);
  res.socket.server.io = io;

  const onConnection = (socket: any) => {
    socket.on('enterRoom', handleEnterRoom(io, socket));

    socket.on("launchGame", ({room}: {room: string}) => {
      console.log(`Game Launching ${room} in progress...`);
      startGameRound(io, room, socket)
    });



  };

  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}