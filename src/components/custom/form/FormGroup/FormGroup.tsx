"use client"

// Import
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormGroupInterface } from "../type"

export default function FormGroup({config, form} : {config: FormGroupInterface, form: any}) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            <Input type={config.type} placeholder={config.placeholder} {...field} />
          </FormControl>
          {Boolean(config.description) &&
          <FormDescription>
            {config.description}
          </FormDescription>
          }
          <FormMessage />
        </FormItem>
      )}
    />
  )
}