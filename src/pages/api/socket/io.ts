import fs from 'fs';
import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/type"
import { getSocketsData, getSocketsInRoom, handleEnterRoom } from "@/lib/socket";
import path from "path";
import { Server as SocketIOServer } from "socket.io";


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
      questionNumero: number,
      question: string,
      musiqueLink: string,
      options: string[]
    },
    countdown?: number,
    players: {
      id: string,
      username: string,
      score: number,
      averageTimeToAnswer: number,
      correctAnswers: number,
      incorrectAnswers: number,
      history: {
        playerAnswer: string,
        isCorrect: boolean
        timeToAnswer: number
        rank: number | null
      }[],
      currentResponse: string
    }[]
  }
}

export type JsonContent = {
  id: string,
  title: string,
  associated_piece: string,
  tag: string,
  imageUrl: string | null
}

export interface ServerStateData {
  sockets: any[],
  room: string,
  io: SocketIOServer
}


// Constante pour le chemin du fichier JSON
const jsonFilePath = path.join(process.cwd(), 'public', 'json', 'audio.json');

// Methode pour lancer le compte à rebours
function startCountdown(gameStatus: GameStatus, {room, io}: ServerStateData): Promise<void> {
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
function getCorrectObjectAudio(array: any[], selectedElements: any[]): any | undefined {
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
function getWrongResponse(array: any[], randomElement: any, count: number): any[] {
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


/**
 * Handles player responses during a game round.
 * 
 * @param correctResponse - The correct response to compare player responses against.
 * @param gameStatus - The current game status including player information.
 * @param serverStateData - Data containing sockets, room, and io necessary for communication.
 * @returns {Promise<void>} - A Promise that resolves once player responses are handled.
 */

async function handlePlayerResponse(
  correctResponse: string,
  gameStatus: GameStatus,
  { sockets, room, io }: ServerStateData
): Promise<void> {

  const startedTimestampStep = new Date().getTime();


  gameStatus.response.players.forEach((player) => {
    player.history[(gameStatus.response.step as any).questionNumero - 1] = {
      playerAnswer: "",
      isCorrect: false,
      timeToAnswer: 15000,
      rank: null
    };
  })

  /**
   * Validates a player's response and updates the current response in the game status.
   * 
   * @param {string} answer - The player's response.
   * @param {string} playerIdWhoAnswered - The ID of the player who provided the response.
   */

  const getPlayerResponse = ({answer, playerIdWhoAnswered}: {answer: string, playerIdWhoAnswered: string}) => {
    const timestamp = new Date().getTime();

    const playerIndex = gameStatus.response.players.findIndex((player) => player.id === playerIdWhoAnswered);
    if (playerIndex !== -1) {
      gameStatus.response.players[playerIndex].currentResponse = answer;
      gameStatus.response.players[playerIndex].history[(gameStatus.response.step as any).questionNumero - 1] = {
        playerAnswer: answer,
        isCorrect: answer === correctResponse,
        timeToAnswer: timestamp - startedTimestampStep,
        rank: null
      };
    }
  }

  // Adds event listener for "player-response" for each socket
  sockets.forEach((socket) => {
    socket.on("player-response", getPlayerResponse);
  })

  // Starts the response countdown (15 seconds)
  await startCountdown(gameStatus, {sockets, room, io});

  // Removes event listener for "player-response" for each socket
  sockets.forEach((socket) => {
    socket.off("player-response", getPlayerResponse);
  })

  
  // Sorts players by time to answer and attaches rank to each player and atributs points
  // TODO rank 3 pour 1er pas normal
  gameStatus.response.players.sort((a, b) => {

    if (!a.history[(gameStatus.response.step as any).questionNumero - 1].isCorrect) {
      return -1;
    }

    const aTimeToAnswer = a.history[(gameStatus.response.step as any).questionNumero - 1].timeToAnswer;
    const bTimeToAnswer = b.history[(gameStatus.response.step as any).questionNumero - 1].timeToAnswer;

    if (aTimeToAnswer < bTimeToAnswer) {
      return -1;
    } else if (aTimeToAnswer > bTimeToAnswer) {
      return 1;
    } else {
      return 0;
    }
  }).forEach((player, index) => {

    if (!player.history[(gameStatus.response.step as any).questionNumero - 1].isCorrect) {
      player.history[(gameStatus.response.step as any).questionNumero - 1].rank = -1;
      player.incorrectAnswers += 1;
    }
    else {
      player.history[(gameStatus.response.step as any).questionNumero - 1].rank = index + 1;
      player.correctAnswers += 1;
    }
    
  });

  // Adds points to players in function of their rank
  gameStatus.response.players.forEach((player) => {
    switch (player.history[(gameStatus.response.step as any).questionNumero - 1].rank) {
      case 1:
        console.log(gameStatus.response.step?.questionNumero, player, player.history[(gameStatus.response.step as any).questionNumero - 1].rank, "+3")
        player.score += 3;
        break;
      case 2:
        console.log(gameStatus.response.step?.questionNumero, player, player.history[(gameStatus.response.step as any).questionNumero - 1].rank, "+2")
        player.score += 2;
        break;
      case 3:
        console.log(gameStatus.response.step?.questionNumero, player, player.history[(gameStatus.response.step as any).questionNumero - 1].rank, "+1")
        player.score += 1;
        break;
      default:
        console.log(gameStatus.response.step?.questionNumero, player, player.history[(gameStatus.response.step as any).questionNumero - 1].rank, "+0")
        player.score += 0;
        break;
    }
  });

  // Checks player responses and awards points
  // gameStatus.response.players.forEach((player) => {
  //   if (player.currentResponse === correctResponse) {
  //     player.score += 1;
  //   }
  // })
};






async function gameInProgess(categoryData: Array<JsonContent>, gameStatus: GameStatus, serverStateData: ServerStateData) {
  const selectedElements: any[] = [];
  for (let i = 0; i < 2; i++) {
    const objectAudio : ObjectAudio = getCorrectObjectAudio(categoryData, selectedElements);

    const correctResponse : string = objectAudio.associated_piece;
    const wrongResponses : string[] = getWrongResponse(categoryData, objectAudio.id, 3)
    
    const allElementsToMix = [correctResponse, ...wrongResponses];
    const mixedResponse = allElementsToMix.sort(() => Math.random() - 0.5);
    console.log(mixedResponse)

    gameStatus.currentStep = "game-in-progress"
    gameStatus.response.step = {
      questionNumero: i + 1,
      question: "Cette musique est associée à quel série ?",
      musiqueLink: `/audio/${objectAudio.id}.mp3`,
      options: mixedResponse,
    }

    await handlePlayerResponse(correctResponse, gameStatus, serverStateData);
  }
}




/**
 * Starts a game round, including countdowns and gameplay.
 * 
 * @param io - The Socket.IO server instance.
 * @param room - The name of the room for the game.
 * @param mode - The mode or category of the game.
 * @returns {Promise<void>} - A Promise that resolves once the game round is completed.
 */

async function startGameRound(io: SocketIOServer, room: string, mode: string): Promise<void> {
  // Retrieves sockets in the room
  const sockets = await getSocketsInRoom(io, room);

  // Retrieves data from the sockets
  const userSockets = getSocketsData(sockets);

  // Creates players
  const players = userSockets.map((player) => ({ 
    ...player, 
    score: 0, 
    averageTimeToAnswer: null,
    correctAnswers: 0,
    incorrectAnswers: 0,
    history: [], 
    currentResponse: null 
  }));

  // Creates the gameStatus object
  let gameStatus: GameStatus = {
    currentStep: "launching-game-countdown",
    response: {
      players,
    },
  };

  // Creates the serverStateData object
  let serverStateData: ServerStateData = {
    sockets,
    room,
    io,
  };

  // Starts the launch game countdown (5 seconds)
  await startCountdown(gameStatus, serverStateData);

  let categoryData : Array<JsonContent> | undefined;

  if (mode === "aleatoire") {
    const JsonFileParsed = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    for (const [key, value] of Object.entries(JsonFileParsed)) {
      categoryData = [...(categoryData ?? []), ...value as Array<JsonContent>]
    }
  }
  else {
    // Retrieves data from the audio.json file
    categoryData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))[mode];
  }

  // Checks that the categoryData array is defined
  if (categoryData === undefined) {
    throw new Error("The categoryData array is undefined. Please check the JSON data.");
  } else {
    // Starts the game
    await gameInProgess(categoryData, gameStatus, serverStateData);
  }

  // Displays the final score
  gameStatus.currentStep = "game-completed";

  gameStatus.response.players.forEach((player) => {
    player.averageTimeToAnswer = (Math.floor((player.history.reduce((acc, curr) => acc + curr.timeToAnswer, 0) / player.history.length)/10))/100;
  })

  // Sends the gameStatus to all sockets in the room
  io.to(room).emit('game-status', gameStatus);
}






export default function SocketHandler( req: NextApiRequest, res: NextApiResponseServerIo ) {

  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io : SocketIOServer = new Server(res.socket.server as any);
  res.socket.server.io = io;

  const onConnection = (socket: any) => {
    socket.on('enterRoom', handleEnterRoom(io, socket));
    socket.on("launchGame", ({room, mode}: {
      room: string, 
      mode: string
    }) => startGameRound(io, room, mode));
  };

  io.on("connection", onConnection);

  res.end();
}