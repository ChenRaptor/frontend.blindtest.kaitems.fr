"use client"
import Carousel from "./components/Carousel/Carousel";
import { v4 as uuidv4 } from 'uuid';
import QuickResponseCode from "./components/QuickResponseCode/QuickResponseCode";
import { MouseEventHandler, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlayerBoard from "./components/PlayerBoard/PlayerBoard";
import DescriptionBoard from "./components/DescriptionBoard/DescriptionBoard";
import { Button } from "@/components/ui/button";
import { useBoolean } from 'usehooks-ts'
import Link from "next/link";

export interface carouselConfigItem {
  id: number
  title: string
  type?: string
  description: string
  phrase: string
}

export type CarouselConfig = Array<carouselConfigItem>


const carouselConfig : CarouselConfig = [
  {
    id: 0,
    title: "Film",
    type: "Musique",
    description: "lorem",
    phrase: "Blindtest sur les musiques de film"
  },
  {
    id: 1,
    title: "Série",
    type: "Musique",
    description: "lorem",
    phrase: "Blindtest sur les musiques de série"
  },
  {
    id: 2,
    title: "Film",
    type: "Réplique",
    description: "lorem",
    phrase: "Blindtest sur les répliques de film"
  },
  {
    id: 3,
    title: "Série",
    type: "Réplique",
    description: "lorem",
    phrase: "Blindtest sur les répliques de série"
  },
  {
    id: 4,
    title: "Aléatoire",
    description: "lorem",
    phrase: "Blindtest aléatoire"
  }
]

interface QRCode {
  url: string
}

export default function Home() {

  const [quickResponseCode, setQuickResponseCode] = useState<QRCode | null>(null)
  const { value: startGame, toggle: toggleStartGame } = useBoolean(false)

  const [option, setOption] = useState<number>(0)

  const handlerQRCode : MouseEventHandler<HTMLElement> = () => {
    setQuickResponseCode({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/room/${uuidv4()}/phone?type=${option}`
    })
  }

  const handlerStartGame : MouseEventHandler<HTMLElement> = () => {
    toggleStartGame()
  }


  return (
    <main className='h-full w-full'>
      <div className="flex flex-col h-full">
        <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">

          <div className="py-20 grid grid-cols-1 gap-20 lg:grid-cols-3">
            <div className="flex items-start flex-col">
              <DescriptionBoard config={carouselConfig[option]} party={!!quickResponseCode} handlerStartGame={handlerStartGame} startGame={startGame}/>
            </div>
            <div className="flex items-center justify-center xl:w-[384px]">
              {quickResponseCode ?
                <QuickResponseCode url={quickResponseCode.url}/>
              :
                <Button onClick={handlerQRCode}>Générer la partie</Button>
              }
            </div>
            <div className="flex items-end flex-col">
              <PlayerBoard/>
            </div>
          </div>

        </div>
        <div className="px-4 py-4 sm:p-6">
          <Carousel mutate={setOption} value={option} config={carouselConfig}/>
        </div>
        <div className="px-4 py-4 sm:px-6 text-center">
          {quickResponseCode?.url &&
            <Link href={quickResponseCode.url}>Lien</Link>
          }
        </div>
      </div>
    </main>
  )
}


