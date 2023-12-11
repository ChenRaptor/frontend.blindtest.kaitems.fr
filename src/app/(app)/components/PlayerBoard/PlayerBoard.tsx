"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/providers/socket-provider";
import { Room } from "@/type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
        <CardDescription>{roomData?.socketNumber ?? 0} joueurs dans la salle</CardDescription>
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