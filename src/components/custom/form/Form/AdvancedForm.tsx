import { Form, useForm } from "react-hook-form";
import FormGroup from "../FormGroup/FormGroup";
import { Button } from "@/components/ui/button";
import styles from "./AdvancedForm.module.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionPanelConfig, OnSubmit } from "../type";

const AdvancedForm = ({config, onSubmit} : {config: ActionPanelConfig, onSubmit: OnSubmit}) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        {config.formFields.map((formField, key) => (
          <FormGroup config={formField} form={form} key={`formField-${key}`}/>
        ))}
        <div className={styles['action-button']}>
          <Button type="submit">{config.formSubmit}</Button>
        </div>
      </form>
    </Form>
  );
};

export default AdvancedForm;