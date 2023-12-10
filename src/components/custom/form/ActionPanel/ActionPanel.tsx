"use client"

// Import
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import styles from "./ActionPanel.module.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActionPanelProps } from "../type"
import FormGroup from "../FormGroup/FormGroup"

export const prevent = (fn: (event: React.MouseEvent<HTMLElement, MouseEvent>, ...params: any[]) => void) => {
  return (event: React.MouseEvent<HTMLElement, MouseEvent>, ...params: any[]) => {
    event.currentTarget === event.target && fn && fn(event, ...params);
  };
};

export default function ActionPanels({config, active, onSubmit, onOverlay, onCancel} : ActionPanelProps) {
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

  // Créer wrapper form
  return (
    <>
      { active &&
        <div className={styles['overlay']} onClick={onOverlay && prevent(onOverlay)}>
          <Card>
            <CardHeader>
              <CardTitle>{config.formTitle}</CardTitle>
              <CardDescription>{config.formDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
                  {config.formFields.map((formField, key) => (
                    <FormGroup config={formField} form={form} key={`formField-${key}`}/>
                  ))}
                  <div className={styles['action-button']}>
                    <Button variant="outline" onClick={onCancel}>{config.formCancel}</Button>
                    <Button type="submit">{config.formSubmit}</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      }
    </>
  )
}