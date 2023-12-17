import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Chrono from "../Chrono/Chrono";
import { MouseEventHandler } from "react";
import { carouselConfigItem } from "../../page";

interface DescriptionBoardProps {
  config: carouselConfigItem
  party: boolean
  handlerStartGame: MouseEventHandler<HTMLElement>
  startGame: boolean
  count: number
}

export default function DescriptionBoard({config, party, handlerStartGame, startGame, count} : DescriptionBoardProps) {

  return (
    <Card className="h-full w-full overflow-hidden flex flex-col">
      <CardHeader className="bg-primary-100">
        <CardTitle>{config.phrase}</CardTitle>
        <CardDescription>&nbsp;</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        {startGame &&
          <Chrono count={count}/>
        }
      </CardContent>
      <CardFooter className="flex justify-between min-h-[60px]">
        {party && 
        <>
          {/* <Button variant="outline">Quitter la room</Button> */}
          {startGame ?
            <Button variant="outline" onClick={handlerStartGame}>Annuler le lancement</Button>
            :
            <Button variant="primary" onClick={handlerStartGame}>Lancer la partie</Button>
          }
        </>
        }
      </CardFooter>
    </Card>
  );
}