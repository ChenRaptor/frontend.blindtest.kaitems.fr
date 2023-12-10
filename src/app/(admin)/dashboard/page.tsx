"use client"
import AdvancedForm from '@/components/custom/form/Form/AdvancedForm';
import { ActionPanelConfig } from '@/components/custom/form/type';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


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

const YouTubeUpload = () => {

  const [filesMP3, setFilesMP3]

  //const { data, isLoading, isError } = useQuery('videoData', fetchData);

  // TODO use react query 

  const fetchData = async () => {
    // Replace 'your-api-endpoint-url' with the actual URL of your API endpoint
    const response = await axios.get('your-api-endpoint-url');
    return response.data;
  };


  useEffect(() => async () => {
    return await fetchData()
  }
  ,[])

  const onSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <div className='sm:px-20 sm:py-10 w-full flex items-center justify-center flex-col'>
      <div>
        <h1>Upload YouTube Video</h1>
        <div className="w-96">
          <AdvancedForm config={config} onSubmit={onSubmit}/>
        </div>
        <ul>
          <li>sas</li>
        </ul>
      </div>
    </div>
  );
};

export default YouTubeUpload;