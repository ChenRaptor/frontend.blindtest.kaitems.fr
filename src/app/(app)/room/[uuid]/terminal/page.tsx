"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameStatus } from "@/pages/api/socket/io";
import { useSocket } from "@/providers/socket-provider";
import { PhonePageProps } from "@/type";
import { useEffect, useState } from "react";


export default function Terminal({ params }: PhonePageProps) {
  const { socket } = useSocket();
  const [gameStatusPage, setGameStatusPage] = useState<GameStatus>({
    currentStep: "game-in-progress",
    response: {
      step: {
        question: "Cette musique est associée à quel série ?",
        musiqueLink: "dzdzjdz",
        options: ["mixedResponse"],
      },
      countdown: 15,
      players: [
        {id: "player1", username: "dqdqzdq", score: 0},
        {id: "player2", username: "qzdqzdf", score: 0},
        {id: "player3", username: "fefseq", score: 0},
        {id: "player4", username: "dqzd", score: 0},
      ]
    }
  })

  const socketActions = async () => {
    socket.emit("launchGame", {room: params.uuid});
    socket.on("terminalJoinRoom", ({room}) => console.log(room));
    socket.on("game-status", (gameStatus: GameStatus) => {setGameStatusPage(gameStatus)});
  }

  useEffect(() => {
    socket && socketActions();
  }, [socket]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
      <div className="mx-auto max-w-3xl h-full">
        <div className="fixed top-12 right-12">
          <div className="flex items-center justify-center w-64 h-16 bg-primary-50 shadow">
            <p className="text-2xl">Terminal</p>
          </div>
          <ul className="bg-primary-50 mt-2">
            {gameStatusPage.response.players.map((player, index) => 
              <li key={player.id} className="flex items-center justify-between p-4 gap-4">
                <div className="w-10 aspect-square bg-primary-800">

                </div>
                <div className="flex items-center justify-between gap-4 w-full">
                  <p className="text-2xl">{player.username}</p>
                  <p className="text-2xl">{player.score}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
        {
          gameStatusPage?.currentStep === "launching-game-countdown" ? 
          <div className="flex items-center justify-center h-full">
            <h2 className='text-6xl'>Launching game ...</h2>
            <p className='text-5xl'>{(gameStatusPage as any)?.response?.countdown}</p>
          </div>
          :
          gameStatusPage?.currentStep === "game-in-progress" ? 
          <div className="flex items-center justify-center h-full flex-col">
            <h2 className='text-4xl mb-4'>Question 1</h2>

            <p className='text-3xl'>{(gameStatusPage as any)?.response?.step?.question}</p>

            <div className="h-96 flex items-center justify-center mx-auto">
              <p className='text-5xl'>{(gameStatusPage as any)?.response?.countdown}</p>
            </div>

            <p>Répondez sur votre téléphone</p>
          </div>
          :
          gameStatusPage?.currentStep === "game-completed" ?
          <Card className="h-full w-full overflow-hidden">
          <CardHeader className="bg-primary-100">
            <CardTitle>ScoreBoard</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <ul role="list" className="divide-y divide-primary-300">
    
              {gameStatusPage.response.players.map((player) => (
                <li key={player.id} className="flex justify-between gap-x-6 py-5">
                  <div className="flex items-center justify-center min-w-0 gap-x-4">
                    <div className="min-w-0 flex items-center justify-center">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{player.username}</p>
                    </div>
                  </div>
                  <div className="min-w-0 flex items-center justify-center">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{player.score}</p>
                  </div>
                </li>
              ))}
    
            </ul>
          </CardContent>
          </Card>
          :
          null
        }
      </div>
    </div>
  )
}

