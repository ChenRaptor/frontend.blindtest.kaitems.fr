import AdvancedForm from '@/components/custom/form/Form/AdvancedForm';
import { ActionPanelConfig } from '@/components/custom/form/type';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SoundTable from './components/SoundTable/SoundTable';
import AddingPanel from './components/AddingPanel/AddingPanel';
import QueryProvider from './components/QueryProvider/QueryProvider';


const config : ActionPanelConfig = {
  formTitle: "Créer son nom d'utilisateur",
  formDescription: "Change the email address you want associated with your account.",
  formSubmit: "Confirmer",
  formCancel: "Quitter la salle",
  formFields: [
    {
      name: "videoId",
      type: "text",
      label: "Identifiant video youtube",
      placeholder: "XXXXXXXXXXXXX",
      schema: {
        min: 6,
        max: 12
      }
    }
  ]
}

// const fetchData = async () => {
//   // Replace 'your-api-endpoint-url' with the actual URL of your API endpoint
//   const response = await axios.get('your-api-endpoint-url');
//   return response.data;
// };


export default function Dashboard() {

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <QueryProvider>
          <AddingPanel/>
          <SoundTable/>
        </QueryProvider>
      </div>
    </div>
  );
};