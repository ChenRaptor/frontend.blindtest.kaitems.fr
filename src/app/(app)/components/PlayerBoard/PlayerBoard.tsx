"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/providers/socket-provider";
import { Room } from "@/type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Ready"
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Not ready"
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Ready"
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Ready"
  }
]

const userJoinRoomListener = (setRoomData: Dispatch<SetStateAction<Room | undefined>>) => ({newPlayer, room} : {newPlayer: any, room: Room}) => {
  console.log(room)
  setRoomData(room);
  console.log(`${newPlayer.username} vient de joindre le salon. Il y a maintenant ${room.socketNumber} personnes dans le salon.`);
};

export default function PlayerBoard() {
  const { socket } = useSocket();
  const [roomData, setRoomData] = useState<Room>();

  useEffect(() => {
    socket && socket.on("userJoinRoom", userJoinRoomListener(setRoomData));
  }, [socket])

  return (
    <Card className="h-full w-full overflow-hidden">
      <CardHeader className="bg-primary-100">
        <CardTitle>Joueur</CardTitle>
        <CardDescription>{people.length} joueurs dans la salle</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-2">
        <ul role="list" className="divide-y divide-primary-300">

          {roomData?.sockets.map((player) => (
            <li key={player.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex items-center justify-center min-w-0 gap-x-4">
                {/* <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar> */}
                <div className="min-w-0 flex items-center justify-center">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{player.username}</p>
                </div>
              </div>
              <div className="min-w-0 flex items-center justify-center">
                <p className="text-sm font-semibold leading-6 text-gray-900">{"Ready"}</p>
              </div>
            </li>
          ))}

        </ul>
      </CardContent>
    </Card>
  );
}