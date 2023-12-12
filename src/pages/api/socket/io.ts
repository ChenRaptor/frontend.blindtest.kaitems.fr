import fs from 'fs';
import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/type"
import { handleEnterRoom } from "@/lib/socket";
import path from "path";

export interface ObjectAudio {
  id: string,
  title: string,
  associated_piece: string,
  tag: string,
  imageUrl: string | null
}

export interface GameStatus {
  currentStep: string,
  response: {
    step?: {
      question: string,
      musiqueLink: string,
      options: string[]
    },
    countdown?: number,
    players: {
      id: string,
      username: string,
      score: number
    }[]
  }
}

// Constante pour le chemin du fichier JSON
const jsonFilePath = path.join(process.cwd(), 'public', 'json', 'audio.json');

// Methode pour lancer le compte à rebours
function startCountdown(io: any, room: string, gameStatus: GameStatus): Promise<void> {
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
      
      io.to(room).emit('game-status', gameStatus);
      
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

// Methode pour récupérer un élément aléatoire dans un tableau
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

// Methode pour récupérer des éléments aléatoires dans un tableau
function getUniqueRandomElements(array: any[], randomElement: any, count: number): any[] {
  const newArray = [...array]
  const uniqueRandomElements: any[] = [];

  while (uniqueRandomElements.length < count && newArray.length > 0) {
    const index = Math.floor(Math.random() * newArray.length);
    const selectedElement = newArray.splice(index, 1)[0].associated_piece;

    // Vérifier que l'élément n'est pas déjà sélectionné et n'est pas égal à randomElement
    if (selectedElement !== randomElement) {
      uniqueRandomElements.push(selectedElement);
    }
  }

  return uniqueRandomElements;
}

async function handlePlayerResponse(room: string, io: any, correctResponse: string, gameStatus: GameStatus) {

  const responseValidator = ({answer, playerIdWhoAnswered}: {answer: string, playerIdWhoAnswered: string}) => {
    const isCorrect = answer === correctResponse;

    if (isCorrect) {
      const playerIndex = gameStatus.response.players.findIndex((player: any) => player.id === playerIdWhoAnswered);
      if (playerIndex !== -1) {
        gameStatus.response.players[playerIndex].score += 1;
      }
    }
  }

  io.to(room).on(`player-response-${correctResponse}`, responseValidator);

  await startCountdown(io, room, gameStatus);

  io.to(room).off(`player-response-${correctResponse}`, responseValidator);
};


// Methode pour lancer une partie
async function startGameRound(io: any, room: string, socket: any) {
  let gameStatus : GameStatus = {
    currentStep: "launching-game-countdown",
    response: {
      countdown: 5,
      players: [
        {id: "player1", username: "", score: 0},
        {id: "player2", username: "", score: 0},
        {id: "player3", username: "", score: 0},
        {id: "player4", username: "", score: 0},
      ]
    }
  };

  await startCountdown(io, room, gameStatus);

  const jsonContent : {[key: string]: any} = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  const arrayTag = jsonContent["serie_music"];

  const selectedElements: any[] = [];


  for (let i = 0; i < 2; i++) {
    const objectAudio : ObjectAudio = getRandomUniqueElement(arrayTag, selectedElements);

    const correctResponse : string = objectAudio.associated_piece;
    const wrongResponses : string[] = getUniqueRandomElements(arrayTag, objectAudio.id, 3)
    
    const allElementsToMix = [correctResponse, ...wrongResponses];
    const mixedResponse = allElementsToMix.sort(() => Math.random() - 0.5);
    console.log(mixedResponse)

    gameStatus = {
      currentStep: "game-in-progress",
      response: {
        step: {
          question: "Cette musique est associée à quel série ?",
          musiqueLink: objectAudio.id,
          options: mixedResponse,
        },
        countdown: 15,
        players: [
          {id: "player1", username: "", score: 0},
          {id: "player2", username: "", score: 0},
          {id: "player3", username: "", score: 0},
          {id: "player4", username: "", score: 0},
        ]
      }
    };
  
    await handlePlayerResponse(room, io, correctResponse, gameStatus);
  }

  // Affichage du score

  gameStatus = {
    currentStep: "game-completed",
    response: {
      players: [
        {id: "player1", username: "", score: 0},
        {id: "player2", username: "", score: 0},
        {id: "player3", username: "", score: 0},
        {id: "player4", username: "", score: 0},
      ]
    }
  };

  io.to(room).emit('game-status', gameStatus);
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