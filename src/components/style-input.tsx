import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { PlusCircle, X } from 'lucide-react';

interface FileInputProps {
  control: any;
  name: string;
  label: string;
  accept: string;
  disabled: boolean;
}

export function StyleInput({ control, name, label, accept, disabled }: FileInputProps) {
  const [fileName, setFileName] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void
  ) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemoveFile = (onChange: (value: null) => void) => {
    if (disabled) return;
    onChange(null);
    setFileName('');
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <FormField
      disabled={disabled}
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className='space-y-2'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <Input
                  type='file'
                  accept={accept}
                  disabled={disabled}
                  className='hidden'
                  id={name}
                  onChange={(e) => handleFileChange(e, onChange)}
                  {...field}
                />
                <label
                  htmlFor={name}
                  className={`flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md cursor-pointer hover:bg-gray-800 transition-colors ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={(e) => {
                    if (disabled) {
                      e.preventDefault();
                    }
                  }}>
                  <PlusCircle size={20} />
                  {fileName || `Add ${label}`}
                </label>
              </div>
              {preview && (
                <div className='relative'>
                  <img
                    src={preview}
                    alt='Preview'
                    className='w-16 h-16 object-cover rounded-md'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveFile(onChange)}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1'>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
