import ActionPanels, { ActionPanelConfig } from "@/components/custom/ActionPanel/ActionPanel";
import { useSocket } from "@/providers/socket-provider";

const config : ActionPanelConfig = {
  formTitle: "Upload a project",
  formDescription: "Change the email address you want associated with your account.",
  formSubmit: "Submit",
  formCancel: "Cancel",
  formFields: [
    {
      name: "projectName",
      type: "text",
      label: "Project name",
      placeholder: "Project name",
      schema: {
        min: 2,
        max: 10
      }
    },
    {
      name: "projectDescription",
      type: "text",
      label: "Project description",
      placeholder: "Project description",
      schema: {
        min: 5,
        max: 12
      }
    },
  ]
}


export default function Phone() {
  const { socket } = useSocket();
  
  return (
    <div>
      <ActionPanels config={config} active={true} onClose={() => console.log("close")} />
    </div>
  )
}

