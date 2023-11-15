"use client"

// Import
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormGroup, { FormGroupInterface } from "../FormGroup/FormGroup"
import styles from "./ActionPanel.module.css"
import { MouseEventHandler, useRef } from "react"
// Inteface
export interface ActionPanelConfig {
  formTitle: string
  formDescription: string
  formSubmit: string
  formCancel: string
  formFields: Array<FormGroupInterface>
}

export interface ActionPanelProps {
  config: ActionPanelConfig
  active: boolean
  onClose: (event:any) => void
}

export const prevent = (fn: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, ...params: any[]) => void) => {
  return (event: React.MouseEvent<HTMLDivElement, MouseEvent>, ...params: any[]) => {
    event.currentTarget === event.target && fn && fn(event, ...params);
  };
};

export default function ActionPanels({config, active, onClose} : ActionPanelProps) {
  const defaultValues : any = {};
  const defaultSchema : any = {};

  config.formFields.forEach(({name, defaultValue, schema}) => {
    if (defaultValue) defaultValues[name] = defaultValue;

    defaultSchema[name] = z.string().superRefine((data, ctx) => {
      if (data.length > schema.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Must be at most ${schema.max} characters.`
        });
      }
      if (data.length < schema.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Must be at least ${schema.min} characters.`
        });
      }
    })
  })

  const formSchema = z.object(defaultSchema)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  
  return (
    <>
    { active &&
    <div className={styles['overlay']} onClick={prevent(onClose)}>
      <div className={styles['box']}>
        <div className={styles['box-content']}>
          <h3 className={styles['title']}>{config.formTitle}</h3>
          <div className={styles['description']}>
            <p>{config.formDescription}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
              {config.formFields.map((formField, key) => (
                <FormGroup config={formField} form={form} key={`formField-${key}`}/>
              ))}
              <div className={styles['action-button']}>
                <Button onClick={onClose}>{config.formCancel}</Button>
                <Button type="submit">{config.formSubmit}</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
    }
    </>
  )
}