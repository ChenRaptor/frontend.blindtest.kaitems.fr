"use client"

// Import
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import styles from "./AdvancedForm.module.css"
import { FormConfig } from "../type"
import FormGroup from "../FormGroup/FormGroup"

export const prevent = (fn: (event: React.MouseEvent<HTMLElement, MouseEvent>, ...params: any[]) => void) => {
  return (event: React.MouseEvent<HTMLElement, MouseEvent>, ...params: any[]) => {
    event.currentTarget === event.target && fn && fn(event, ...params);
  };
};

export default function AdvancedForm({config, onSubmit} : {config: FormConfig, onSubmit: any}) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        {config.formFields.map((formField, key) => (
          <FormGroup config={formField} form={form} key={`formField-${key}`}/>
        ))}
        <div className={styles['action-button']}>
          <Button variant="primary" type="submit">{config.formSubmit}</Button>
        </div>
      </form>
    </Form>
  )
}