"use client"
import ActionPanels, { ActionPanelConfig } from "@/components/custom/ActionPanel/ActionPanel";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/providers/socket-provider";
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

interface PhonePageProps {
  params: {
    uuid: string
  }
}

interface User {
  username?: string
}

interface CustomSocket {
  socket_id: string;
  pseudo?: string;
}

interface Room {
  id: string;
  socketNumber: number;
  sockets: CustomSocket[];
}


const enterRoomEmiter = (params: PhonePageProps["params"], user?: User) => ({
  room: params.uuid,
  object: {
    type: 'player', 
    pseudo: user?.username 
  }
})

const userJoinRoomListener = (setRoomData: Dispatch<SetStateAction<Room | undefined>>) => ({newPlayer, room} : {newPlayer: any, room: Room}) => {
  console.log(room)
  setRoomData(room);
  console.log(`${newPlayer.username} vient de joindre le salon. Il y a maintenant ${room.socketNumber} personnes dans le salon.`);
};

export default function Phone({ params }: PhonePageProps) {
  const { socket } = useSocket();

  const [user, setUser] = useState<User>()
  const [roomData, setRoomData] = useState<Room>();
  const [actionPanel, setActionPanel] = useState<boolean>(true)

  const socketInitializer = async () => {
    // Socket Emit
    socket.emit("enterRoom", enterRoomEmiter(params, user));

    // Socket On
    socket.on("userJoinRoom", userJoinRoomListener(setRoomData));
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
    <div>
      <ActionPanels
      config={config}
      active={actionPanel}
      onSubmit={onSubmit}
      onCancel={onCancel}
      />
      <p>{user?.username}</p>
      <div className="px-4 grid grid-cols-2 gap-4">
        <Button onClick={() => {console.log("responseA")}}>A</Button>
        <Button onClick={() => {console.log("responseB")}}>B</Button>
        <Button onClick={() => {console.log("responseC")}}>C</Button>
        <Button onClick={() => {console.log("responseD")}}>D</Button>
      </div>
    </div>
  )
}

