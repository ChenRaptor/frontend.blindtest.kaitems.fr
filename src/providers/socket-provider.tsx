"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Socket } from "socket.io";

import io from "socket.io-client";

type SocketContextType = {
  socket: any | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
})

export const useSocket : () => {socket: Socket} = () => {
  return useContext(SocketContext);
}


export const SocketProvider = ({
  children
}: {
  children: React.ReactNode
}) => {

  const [socket, setSocket] = useState<any>(null);

  const socketInstance = useMemo(() => io(), [])

  useEffect(() => {
    if(socketInstance) {
      socketInitializer(socketInstance);
    }
  }, [socketInstance])

  const socketInitializer = async (socketInstance: any) => {
    await fetch("/api/socket/io");
    
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    }
  }



  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}