"use client"

// Import
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormGroupInterface } from "../type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FormGroup({config, form} : {config: FormGroupInterface, form: any}) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          {config.type === "select" ?
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={config.selectValue} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {config.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.placeholder}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            :
            <FormControl>
              <Input type={config.type} placeholder={config.placeholder} {...field} />
            </FormControl>
          }
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