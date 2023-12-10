import { z } from "zod"

export interface FormGroupInterface {
  name: string
  type: string
  label: string
  description?: string
  placeholder: string
  defaultValue?: string
  schema: {
    min: number,
    max: number
  }
}

export interface ActionPanelConfig {
  formTitle: string
  formDescription: string
  formSubmit: string
  formCancel: string
  formFields: Array<FormGroupInterface>
}

export type OnSubmit = (values: z.infer<z.ZodObject<any, "strip", z.ZodTypeAny, {
  [x: string]: any;
}, {
  [x: string]: any;
}>>) => any

export interface ActionPanelProps {
  config: ActionPanelConfig
  active: boolean
  onSubmit: OnSubmit
  onOverlay?: (event:any) => void
  onCancel?: (event:any) => void
}