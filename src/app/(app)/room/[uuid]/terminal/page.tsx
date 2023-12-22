"use client"
import AudioPlayer from "@/components/custom/AudioPlayer/AudioPlayer";
import Timer from "@/components/custom/Timer/Timer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameStatus } from "@/pages/api/socket/io";
import { useSocket } from "@/providers/socket-provider";
import { PhonePageProps } from "@/type";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Terminal({ params }: PhonePageProps) {
  const { socket } = useSocket();
  const [gameStatusPage, setGameStatusPage] = useState<GameStatus>({} as GameStatus)

  const searchParams = useSearchParams();

  const socketActions = async () => {
    socket.emit("launchGame", {room: params.uuid, mode: searchParams?.get('type')});
    socket.on("terminalJoinRoom", ({room}) => console.log(room));
    socket.on("game-status", (gameStatus: GameStatus) => {setGameStatusPage(gameStatus)});
  }

  useEffect(() => {
    socket && socketActions();
  }, [socket]);

  return (
    <div className="flex items-center mx-auto max-w-3xl h-full">
      <div className="fixed top-12 right-12">
        <div className="flex items-center justify-center w-64 h-16 bg-primary-100 rounded-t-xl text-primary-800">
          <p className="text-2xl font-semibold">Terminal</p>
        </div>
        <ul className="bg-primary-50 rounded-b-xl">
          {(gameStatusPage?.response?.players ?? []).sort((a,b) => {
            return a.score > b.score ? -1 : 1
          }).map(player => 
            <li key={player.id} className="flex items-center justify-between p-4 gap-4">
              <div className="w-8 aspect-square bg-primary-800 rounded-full"></div>
              <div className="flex items-center justify-between gap-4 w-full h-">
                <p className="text-2xl">{player.username}</p>
                <p className="text-2xl">{player.score}</p>
              </div>
            </li>
          )}
        </ul>
      </div>

      {gameStatusPage?.currentStep === "launching-game-countdown" &&
        <div className="flex items-center justify-center h-full w-full">
          <h2 className='text-6xl'>Launching game ...</h2>
          <Timer time={gameStatusPage?.response?.countdown ?? 0} totalTime={5}/>
        </div>
      }

      {gameStatusPage?.currentStep === "game-in-progress" &&
        <div className="flex items-center justify-center h-full flex-col w-full">
          <h2 className='text-4xl mb-4'>Question {gameStatusPage?.response.step?.questionNumero}</h2>
          <p className='text-3xl'>{gameStatusPage?.response?.step?.question}</p>
          <AudioPlayer path={gameStatusPage?.response.step?.musiqueLink as string}/>

          <div className="h-96 flex items-center justify-center mx-auto">
            <Timer time={gameStatusPage?.response?.countdown ?? 0} totalTime={15}/>
          </div>
          <p>Répondez sur votre téléphone</p>
        </div>
      }

      {gameStatusPage?.currentStep === "game-reveal-response" &&
        <div className="flex items-center justify-center h-full flex-col w-full">
          <h2 className='text-4xl mb-4'>Question {gameStatusPage?.response.step?.questionNumero}</h2>
          <p className='text-3xl'>{gameStatusPage?.response?.step?.validResponse}</p>

          {gameStatusPage?.response.step?.imageUrl &&
            <Image loader={({ src, width, quality }) => {
              return `${src}?w=${width}&q=${quality || 50}`
            }} src={gameStatusPage?.response.step?.imageUrl as string} alt="question image" width={200} height={200} className="rounded-xl shadow-xl my-4"/>
          }
        </div>
      }

      {gameStatusPage?.currentStep === "game-completed" &&
        <Card className="w-full overflow-hidden">
          <CardHeader className="bg-primary-100">
            <CardTitle>ScoreBoard</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <ul role="list" className="divide-y divide-primary-300">
              <li className='py-4 flex justify-between'>
                <span className="min-w-0 flex items-center justify-center flex-1">Pseudo</span>
                <span className="min-w-0 flex items-center justify-center flex-1">&#9201; moy.</span>
                <span className="min-w-0 flex items-center justify-center flex-1">&#9989;</span>
                <span className="min-w-0 flex items-center justify-center flex-1">&#10060;</span>
                <span className="min-w-0 flex items-center justify-center flex-1">&#129351;</span>
              </li>
              {gameStatusPage.response.players.sort((a,b) => {
                return a.score > b.score ? -1 : 1
              }).map((player) => (
                <li key={player.id} className="flex justify-between gap-x-6 py-5">
                  <div className="min-w-0 flex items-center justify-center flex-1">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{player.username}</p>
                  </div>
                  <div className="min-w-0 flex items-center justify-center flex-1">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{player.averageTimeToAnswer + "s"}</p>
                  </div>
                  <div className="min-w-0 flex items-center justify-center flex-1">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{player.correctAnswers}</p>
                  </div>
                  <div className="min-w-0 flex items-center justify-center flex-1">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{player.incorrectAnswers}</p>
                  </div>
                  <div className="min-w-0 flex items-center justify-center flex-1">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{player.score}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/">Retour à l&apos;accueil</Link>
          </CardContent>
        </Card>
      }
    </div>
  )
}

