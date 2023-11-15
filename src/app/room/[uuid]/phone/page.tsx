"use client"
import ActionPanels, { ActionPanelConfig } from "@/components/custom/ActionPanel/ActionPanel";
import { useSocket } from "@/providers/socket-provider";

const config : ActionPanelConfig = {
  formTitle: "Créer son nom d'utilisateur",
  formDescription: "Change the email address you want associated with your account.",
  formSubmit: "Submit",
  formCancel: "Cancel",
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
  
  return (
    <div>
      <ActionPanels config={config} active={true} onClose={() => {console.log("overlay")}} />
    </div>
  )
}

