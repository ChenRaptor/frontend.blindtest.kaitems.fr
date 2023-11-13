"use client"
import Carousel from "./components/Carousel/Carousel";
import { v4 as uuidv4 } from 'uuid';
import QuickResponseCode from "./components/QuickResponseCode/QuickResponseCode";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface carouselConfigItem {
  title: string
  type?: string
  description: string
  phrase: string
}

export type CarouselConfig = Array<carouselConfigItem>


const carouselConfig : CarouselConfig = [
  {
    title: "Film",
    type: "Musique",
    description: "lorem",
    phrase: "Blindtest sur les musiques de film"
  },
  {
    title: "Série",
    type: "Musique",
    description: "lorem",
    phrase: "Blindtest sur les musiques de série"
  },
  {
    title: "Film",
    type: "Réplique",
    description: "lorem",
    phrase: "Blindtest sur les répliques de film"
  },
  {
    title: "Série",
    type: "Réplique",
    description: "lorem",
    phrase: "Blindtest sur les répliques de série"
  },
  {
    title: "Aléatoire",
    description: "lorem",
    phrase: "Blindtest aléatoire"
  }
]

export default function Home() {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/room/${uuidv4()}/phone`;

  const [optionCarousel, setOptionCarousel] = useState<number>(0)

  return (
    <main className='h-full w-full'>
      <div className="flex flex-col h-full">
        <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="py-20 grid grid-cols-1 gap-6 lg:grid-cols-3">



            <div className="flex items-start flex-col">
              <h3 className="text-2xl font-semibold leading-7 text-gray-900">{carouselConfig[optionCarousel].title}{carouselConfig[optionCarousel].type}</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{carouselConfig[optionCarousel].description}</p>
            </div>

            <div className="flex items-center justify-center w-80">
              <QuickResponseCode url={url}/>
            </div>

            <div className="flex items-end flex-col">
              <h3 className="text-2xl font-semibold leading-7 text-gray-900">Player</h3>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>


            
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <Carousel mutate={setOptionCarousel} value={optionCarousel} config={carouselConfig}/>
        </div>
        <div className="px-4 py-4 sm:px-6 text-center">
          <p>{carouselConfig[optionCarousel].phrase}</p>
        </div>
      </div>
    </main>
  )
}


