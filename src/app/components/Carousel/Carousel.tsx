const carousel = [
  {
    title: "Film",
    type: "Musique"
  },
  {
    title: "Série",
    type: "Musique"
  },
  {
    title: "Film",
    type: "Parole"
  },
  {
    title: "Série",
    type: "Parole"
  },
  {
    title: "Aléatoire"
  }
]


export default function Carousel() {
  return (
    <div className="flex items-center justify-center gap-8">
      {carousel.map((carouselItem, carouselItemKey) => {
        return (
          <li
          key={carouselItemKey}
          className="col-span-1 flex flex-col text-center h-[14rem] w-[5rem] bg-primary-base relative"
          >
            <div className="flex flex-1 flex-col p-8">
              <div className="relative bottom-[-3rem] right-[7.4rem]">
                <h3 className="text-2xl text-start font-medium rotate-[-90deg] w-[14rem] uppercase">{carouselItem.title}</h3>
                <h4 className="text-lg text-start font-medium rotate-[-90deg] w-[14rem] uppercase absolute bottom-0 left-[2rem] text-primary-text/70">{carouselItem.type}</h4>
              </div>
            </div>
          </li>
        )
      })}
    </div>
  )
}