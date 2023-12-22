"use client"
import Carousel from "./components/Carousel/Carousel";
import { v4 as uuidv4 } from 'uuid';
import QuickResponseCode from "./components/QuickResponseCode/QuickResponseCode";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import PlayerBoard from "./components/PlayerBoard/PlayerBoard";
import DescriptionBoard from "./components/DescriptionBoard/DescriptionBoard";
import { Button } from "@/components/ui/button";
import { useBoolean, useCountdown } from 'usehooks-ts'
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";
import { PhonePageProps } from "@/type";
import Image from "next/image";


export interface carouselConfigItem {
  id: string
  title: string
  type?: string
  description: string
  phrase: string
}

export type CarouselConfig = Array<carouselConfigItem>


const carouselConfig : CarouselConfig = [
  {
    id: "movie_music",
    title: "Film",
    type: "Musique",
    description: "lorem",
    phrase: "Blindtest sur les musiques de film"
  },
  {
    id: "serie_music",
    title: "Série",
    type: "Musique",
    description: "lorem",
    phrase: "Blindtest sur les musiques de série"
  },
  {
    id: "aleatoire",
    title: "Aléatoire",
    description: "lorem",
    phrase: "Blindtest aléatoire"
  }
]

interface QRCode {
  url: string
}

const enterRoomEmiter = (params: PhonePageProps["params"]) => ({
  room: params.uuid,
  object: {
    type: 'terminal'
  }
})

export default function Home() {

  const { socket } = useSocket();
  const [quickResponseCode, setQuickResponseCode] = useState<QRCode | null>(null)
  const { value: startGame, toggle: toggleStartGame } = useBoolean(false)

  const handleRefresh = () => {
    // LA METHODE LARACHE: https://www.la-rache.com
    window.location.reload();
  };


  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  })

  const link = useMemo(() => uuidv4(),[])

  const [option, setOption] = useState<string>(carouselConfig[0].id)

  const handlerQRCode : MouseEventHandler<HTMLElement> = () => {
    setQuickResponseCode({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/room/${link}/phone?type=${option}`
    })
    if (socket) {
      socket.emit("enterRoom", enterRoomEmiter({uuid: link}));
    }
  }

  const handlerStartGame : MouseEventHandler<HTMLElement> = () => {
    startGame ? resetCountdown() : startCountdown()
    toggleStartGame()
  }

  useEffect(() => {
    count === 0 && redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/room/${link}/terminal?type=${option}`)
  },[count, option])
  
  return (
    <main className='h-full w-full'>
      <div className="flex flex-col h-full">
        <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="py-20 grid grid-cols-1 gap-20 lg:grid-cols-3">
            <div className="flex items-start flex-col">
              <DescriptionBoard config={carouselConfig.filter((item) => item.id === option)[0]} party={!!quickResponseCode} handlerStartGame={handlerStartGame} startGame={startGame} count={count}/>
            </div>
            <div className="flex items-center justify-center xl:w-[384px]">
              {quickResponseCode ?
                <div className="grid gap-8">
                  <QuickResponseCode url={quickResponseCode.url}/>
                  <Button onClick={handleRefresh}>Retour</Button>
                </div>
                :
                <Button onClick={handlerQRCode}>Générer la partie</Button>
              }
            </div>
            <div className="flex items-end flex-col">
              <PlayerBoard/>
            </div>
          </div>

        </div>
        {!quickResponseCode?.url &&
          <div className="px-4 py-4 sm:p-6">
            <Carousel mutate={setOption} config={carouselConfig}/>
          </div>
        }
        <div className="px-4 py-4 sm:px-6 text-center">
          {quickResponseCode?.url &&
            <Link href={quickResponseCode.url} target="_blank">Lien</Link>
          }
        </div>
      </div>
    </main>
  )
}