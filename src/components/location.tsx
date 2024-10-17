import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from './ui/button';

interface LocationFieldProps {
  control: any;
  name: string;
  label: string;
  options: { id: string; name: string }[];
  placeholder: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
}

export function LocationField({
  control,
  name,
  label,
  options,
  placeholder,
  onValueChange,
  disabled,
}: LocationFieldProps) {
  const [isCustomInput, setIsCustomInput] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isCustomInput ? (
              <Input
                {...field}
                placeholder={placeholder}
                onChange={(e) => {
                  field.onChange(e);
                  onValueChange(e.target.value);
                }}
                disabled={disabled}
              />
            ) : (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onValueChange(value);
                }}
                disabled={disabled}
                value={field.value}>
                <SelectTrigger disabled={disabled}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={disabled}
            onClick={() => setIsCustomInput(!isCustomInput)}>
            {isCustomInput ? 'Pilih dari daftar' : 'Isi manual'}
          </Button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
