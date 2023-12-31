"use client"
import AdvancedForm from "@/components/custom/form/Form/AdvancedForm"
import { FormGroupInterface } from "@/components/custom/form/type";
import axios from "axios";
import { useMutation } from "react-query";

type Config = {
  formSubmit: string,
  formFields: FormGroupInterface[]
} 

const config : Config = {
  formSubmit: "Confirmer",
  formFields: [
    {
      name: "id",
      type: "text",
      label: "Identifiant video youtube",
      placeholder: "XXXXXXXXXXXXX",
      schema: {
        min: 0,
        max: 255
      }
    },
    {
      name: "started_at",
      type: "number",
      label: "Commence à",
      defaultValue: "0",
      placeholder: "",
      schema: {
        min: 0,
        max: 255
      }
    },
    {
      name: "title",
      type: "text",
      label: "Titre du son",
      placeholder: "",
      schema: {
        min: 0,
        max: 255
      }
    },
    {
      name: "associated_piece",
      type: "text",
      label: "Titre de l'Oeuvre associé",
      placeholder: "",
      schema: {
        min: 0,
        max: 255
      }
    },
    {
      name: "tag",
      type: "select",
      label: "Tag",
      selectValue: "Sélectionne un tag pour ce song",
      options: [
        {placeholder: "Musique de série", value: "serie_music"},
        {placeholder: "Musique de film", value: "movie_music"}
      ],
      placeholder: "",
      schema: {
        min: 0,
        max: 255
      }
    },
    {
      name: "imageUrl",
      type: "text",
      label: "URL de l'image",
      placeholder: "",
      schema: {
        min: 0,
        max: 255
      }
    }
  ]
}

export default function AddingPanel() {

  const mutation = useMutation((formData: any) => {
    return axios.post('/api/ytb/download', formData)
      .then((response) => response.data);
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        console.log('Réponse de l\'API :', data);
      },
      onError: (error) => {
        console.error('Erreur lors de l\'envoi :', error);
      },
    });
  };

  return (
    <div>
      <AdvancedForm config={config} onSubmit={onSubmit}/>
    </div>
  )
}