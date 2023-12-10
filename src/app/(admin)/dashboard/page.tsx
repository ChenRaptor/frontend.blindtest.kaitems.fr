"use client"
import AdvancedForm from '@/components/custom/form/Form/AdvancedForm';
import { ActionPanelConfig } from '@/components/custom/form/type';
import React, { useState } from 'react';


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


const YouTubeUpload = () => {
  const [videoId, setVideoId] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <div>
      <h1>Upload YouTube Video</h1>
      <AdvancedForm config={config} onSubmit={onSubmit}/>
    </div>
  );
};

export default YouTubeUpload;