import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReasonFieldProps {
  control: any;
  name: string;
}

const reasons = ['Kehilangan pekerjaan', 'Kepala keluarga', 'Tergolong fakir/miskin', 'Lainnya'];

export function ReasonField({ control, name }: ReasonFieldProps) {
  const [isOther, setIsOther] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Alasan membutuhkan bantuan</FormLabel>
          <FormControl>
            {isOther ? (
              <Input
                {...field}
                placeholder='Masukkan alasan lainnya'
                onChange={(e) => {
                  field.onChange(e);
                  if (e.target.value === '') {
                    setIsOther(false);
                  }
                }}
              />
            ) : (
              <Select
                onValueChange={(value) => {
                  if (value === 'Lainnya') {
                    setIsOther(true);
                    field.onChange('');
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih alasan' />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((reason) => (
                    <SelectItem
                      key={reason}
                      value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
