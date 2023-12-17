import fs from 'fs';
import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/type"
import { getSocketsData, getSocketsInRoom, handleEnterRoom } from "@/lib/socket";
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

async function handlePlayerResponse(socket: any, room: string, io: any, correctResponse: string, gameStatus: GameStatus) {

  console.log(`player-response-${room}`)

  const responseValidator = ({answer, playerIdWhoAnswered}: {answer: string, playerIdWhoAnswered: string}) => {
    console.log("answer,correctResponse")
    console.log(answer,correctResponse)
    const isCorrect = answer === correctResponse;

    if (isCorrect) {
      const playerIndex = gameStatus.response.players.findIndex((player: any) => player.id === playerIdWhoAnswered);
      if (playerIndex !== -1) {
        gameStatus.response.players[playerIndex].score += 1;
      }
    }
  }

  //TODO
  // socket.on(`player-response-${room}`, (res : any) =>  console.log(res));

  await startCountdown(io, room, gameStatus);
};


// Methode pour lancer une partie
async function startGameRound(io: any, room: string, socket: any) {

  const sockets = await getSocketsInRoom(io, room)
  const userSockets = getSocketsData(sockets)
  const players = userSockets.map((player) => ({...player, score: 0}))

  let gameStatus : GameStatus = {
    currentStep: "launching-game-countdown",
    response: {
      players
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

    gameStatus.currentStep = "game-in-progress"
    gameStatus.response.step = {
      question: "Cette musique est associée à quel série ?",
      musiqueLink: `/audio/${objectAudio.id}.mp3`,
      options: mixedResponse,
    }
  
    await handlePlayerResponse(socket, room, io, correctResponse, gameStatus);
  }

  // Affichage du score

  gameStatus.currentStep = "game-completed"

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

      getSocketsInRoom(io, room)
        .then(res => {
          res.forEach((socket2: any) => { // Add type annotation 'any' to socket2
            socket2.on("player-response", (res : any) =>  console.log(res));
          })
        })
        
      startGameRound(io, room, socket)
    });


    // socket.on("player-response", function({room, response} : any) {
    //   // Émettre l'événement à tous les clients de la room
    //   io.to(room).emit("player-response", response);
    // });



  };

  io.on("connection", onConnection);

  res.end();
}