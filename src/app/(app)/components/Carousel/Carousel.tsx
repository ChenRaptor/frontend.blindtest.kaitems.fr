import { CarouselConfig } from "@/app/(app)/page"
import { Dispatch, SetStateAction } from "react"

interface CarouselProps {
  mutate: Dispatch<SetStateAction<string>>
  config: CarouselConfig
}

export default function Carousel({mutate, config} : CarouselProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      {config.map((carouselItem, carouselItemKey) => {
        return (
          <li
            key={carouselItemKey}
            className="group col-span-1 flex flex-col text-center h-[14rem] w-[5rem] bg-primary-50 shadow relative select-none hover:bg-primary-950 transition-all duration-200 ease-in-out"
            onClick={() => {mutate(carouselItem.id)}}
          >
            <div className="flex flex-1 flex-col p-8">
              <div className="relative bottom-[-3rem] right-[7.4rem]">
                <h3 className="group-hover:text-primary-50 text-primary-600 text-2xl text-start font-medium rotate-[-90deg] w-[14rem] uppercase">{carouselItem.title}</h3>
                <h4 className="group-hover:text-primary-50 text-lg text-start font-medium rotate-[-90deg] w-[14rem] uppercase absolute bottom-0 left-[2rem] text-primary-400">{carouselItem.type}</h4>
              </div>
            </div>
          </li>
        )
      })}
    </div>
  )
}