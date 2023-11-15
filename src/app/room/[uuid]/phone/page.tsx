"use client"
import ActionPanels, { ActionPanelConfig } from "@/components/custom/ActionPanel/ActionPanel";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";
import { useBoolean } from "usehooks-ts";

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


export default function Phone() {
  const { socket } = useSocket();

  const [user, setUser] = useState<any>()
  const [actionPanel, setActionPanel] = useState<boolean>(true)

  useEffect(() => {
    console.log(user)
  },[user])

  const onSubmit = (values: {username?: string}) => {
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

