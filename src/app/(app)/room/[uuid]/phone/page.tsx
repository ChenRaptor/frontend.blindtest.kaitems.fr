"use client"
import Timer from "@/components/custom/Timer/Timer";
import ActionPanels from "@/components/custom/form/ActionPanel/ActionPanel";
import { ActionPanelConfig } from "@/components/custom/form/type";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/pages/api/socket/io";
import { useSocket } from "@/providers/socket-provider";
import { PhonePageProps, Room } from "@/type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const config : ActionPanelConfig = {
  formTitle: "Créer son nom d'utilisateur",
  formDescription: "Change the email address you want associated with your account.",
  formSubmit: "Confirmer",
  formCancel: "Quitter la salle",
  formFields: [
    {
      name: "username",
      type: "text",
      label: "Nom d'utilisateur",
      placeholder: "Pseudonyme",
      schema: {
        min: 2,
        max: 10
      }
    }
  ]
}

interface User {
  username?: string
}

const enterRoomEmiter = (params: PhonePageProps["params"], user?: User) => ({
  room: params.uuid,
  object: {
    type: 'player', 
    pseudo: user?.username 
  }
})

const userJoinRoomListener = (setRoomData: Dispatch<SetStateAction<Room | undefined>>) => ({newPlayer, room} : {newPlayer: any, room: Room}) => {
  setRoomData(room);
};

export default function Phone({ params }: PhonePageProps) {
  const { socket } = useSocket();
  const [ gameStatusPage , setGameStatusPage] = useState<GameStatus>();

  const [user, setUser] = useState<User>()
  const [roomData, setRoomData] = useState<Room>();
  const [actionPanel, setActionPanel] = useState<boolean>(true)

  const socketInitializer = async () => {
    // Socket Emit
    socket.emit("enterRoom", enterRoomEmiter(params, user));

    // Socket On
    socket.on("userJoinRoom", userJoinRoomListener(setRoomData));
    socket.on("game-status", (gameStatus: GameStatus) => {setGameStatusPage(gameStatus)});

    console.log(socket.id)
  }

  useEffect(() => {
    user && socketInitializer();
  }, [user, socket]);

  const onSubmit = (values: User) => {
    setUser(values)
    setActionPanel(false)
  }

  const onCancel = (event : Event) => {
    // automatiser les preventDefault
    event.preventDefault()
    console.log("cancel")
  }
  // améliorer chrono
  return (
    <div className="my-10">
      <ActionPanels
        config={config}
        active={actionPanel}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      <h1 className='text-center text-4xl font-bold mb-10'>{user?.username}</h1>
      {
        gameStatusPage?.currentStep === "launching-game-countdown" ?
          <div className='flex flex-col justify-center items-center'>
            <p className='text-center mb-2'>The game start in </p>
            <Timer time={gameStatusPage?.response?.countdown ?? 0} totalTime={5}/>
          </div>
          :
          gameStatusPage?.currentStep === "game-in-progress" ?
            <div className='px-4 grid grid-cols-2 gap-4 gap-y-8'>
              {
                gameStatusPage.response.step?.options.map((answer) => 
                  <Button key={answer} onClick={() => { 
                    socket.emit("player-response", {answer, playerIdWhoAnswered: socket.id});
                  }}>{answer}</Button>
                )
              }
            </div>
            :
            <p className='text-center'>La partie n&apos;a pas encore commencé.</p>
      }
    </div>
  )
}

