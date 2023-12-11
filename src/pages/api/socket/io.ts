import fs from 'fs';
import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/type"
import { handleEnterRoom } from "@/lib/socket";
import path from "path";

const jsonFilePath = process.env.METHOD_PATH === 'PROCESS_CWD' ?
  path.join(process.cwd(), 'public', 'json', 'audio.json') : path.join(process.cwd(), 'public', 'json', 'audio.json');

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

function getRandomUniqueElement(array: any[], selectedElements: any[]): any | undefined {
  if (array.length === 0) {
    return undefined; // Le tableau est vide, aucun élément disponible
  }

  const index = Math.floor(Math.random() * array.length);
  const selectedElement = array.splice(index, 1)[0];

  // Ajouter l'élément sélectionné à la liste des éléments déjà sélectionnés
  selectedElements.push(selectedElement);

  return selectedElement;
}


function getUniqueRandomElements(array: any[], randomElement: any, count: number): any[] {
  const newArray = [...array]
  const uniqueRandomElements: any[] = [];

  while (uniqueRandomElements.length < count && newArray.length > 0) {
    const index = Math.floor(Math.random() * newArray.length);
    const selectedElement = newArray.splice(index, 1)[0].id;

    // Vérifier que l'élément n'est pas déjà sélectionné et n'est pas égal à randomElement
    if (selectedElement !== randomElement.id) {
      uniqueRandomElements.push(selectedElement);
    }
  }

  return uniqueRandomElements;
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

  const jsonContent : {[key: string]: any} = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  const arrayTag = jsonContent["serie_music"];

  const selectedElements: any[] = [];
  for (let i = 0; i < 2; i++) {
    const correctResponse = getRandomUniqueElement(arrayTag, selectedElements);
    const wrongResponse = getUniqueRandomElements(arrayTag, correctResponse, 3)
    const allElementsToMix = [correctResponse.id, ...wrongResponse];
    const mixedResponse = allElementsToMix.sort(() => Math.random() - 0.5);
    console.log(mixedResponse)

    gameStatus = {
      currentStep: "game-in-progress",
      response: {
        step: {
          question: "Cette musique est associée à quel série ?",
          musiqueLink: correctResponse.id,
          options: mixedResponse,
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
  }

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