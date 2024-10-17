'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/lib/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Icons } from './icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCities, getDistricts, getProvinces, getVillages } from '@/utils/wilayah-api';
import { LocationField } from './location';
import { ReasonField } from './reason';
import { StyleInput } from './style-input';
import { Checkbox } from './ui/checkbox';
import { simulateBackendResponse } from '@/lib/simulate-backend';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface LocationData {
  id: string;
  name: string;
}

export function LpmForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [provinces, setProvinces] = useState<LocationData[]>([]);
  const [cities, setCities] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<LocationData[]>([]);
  const [villages, setVillages] = useState<LocationData[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      nik: undefined,
      noKK: undefined,
      fotoKTP: undefined,
      fotoKK: undefined,
      umur: undefined,
      jenisKelamin: 'Laki-laki',
      provinsi: '',
      kabKota: '',
      kecamatan: '',
      kelurahan: '',
      alamat: '',
      rt: '',
      rw: '',
      penghasilanSebelum: undefined,
      penghasilanSetelah: undefined,
      alasanBantuan: 'Kehilangan pekerjaan',
      pernyataan: false,
    },
  });

  useEffect(() => {
    getProvinces().then((data: LocationData[]) => setProvinces(data));
  }, []);

  const handleProvinceChange = async (value: string) => {
    form.setValue('kabKota', '');
    form.setValue('kecamatan', '');
    form.setValue('kelurahan', '');
    if (provinces.some((p) => p.id === value)) {
      try {
        const citiesData: LocationData[] = await getCities(value);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    } else {
      setCities([]);
    }
  };

  const handleCityChange = async (value: string) => {
    form.setValue('kecamatan', '');
    form.setValue('kelurahan', '');
    if (cities.some((c) => c.id === value)) {
      try {
        const districtsData: LocationData[] = await getDistricts(value);
        setDistricts(districtsData);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (value: string) => {
    form.setValue('kelurahan', '');
    if (districts.some((d) => d.id === value)) {
      try {
        const villagesData: LocationData[] = await getVillages(value);
        setVillages(villagesData);
      } catch (error) {
        console.error('Error fetching villages:', error);
      }
    } else {
      setVillages([]);
    }
  };

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const response = await simulateBackendResponse(data);
      console.log('Data submitted successfully:', response.data);
      alert('Data berhasil dikirim!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(
        error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn('w-full max-w-4xl mx-auto', className)}
      {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='nama'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Lengkap'
                      {...field}
                      disabled={isLoading}
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nik'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan NIK lengkap'
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                        field.onChange(value === '' ? undefined : Number(value));
                      }}
                      value={field.value || ''}
                      maxLength={16}
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='noKK'
            render={({ field }) => (
              <FormItem>
                <FormLabel>NO KARTU KELUARGA</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan Kartu Keluarga lengkap'
                    {...field}
                    disabled={isLoading}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    value={field.value || ''}
                    maxLength={16}
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='space-y-4'>
            <StyleInput
              control={form.control}
              name='fotoKTP'
              label='Foto KTP'
              accept='image/jpeg,image/png,image/bmp'
              disabled={isLoading}
            />
            <StyleInput
              control={form.control}
              name='fotoKK'
              label='Foto KK'
              accept='image/jpeg,image/png,image/bmp'
              disabled={isLoading}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='umur'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Umur</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      placeholder='Masukkan Umur Berumur lebih dari atau sama dengan 25 tahun '
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      value={field.value || ''}
                      min={25}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='jenisKelamin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih jenis kelamin' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Laki-laki'>Laki-laki</SelectItem>
                      <SelectItem value='Perempuan'>Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <LocationField
              control={form.control}
              name='provinsi'
              label='Provinsi'
              options={provinces}
              placeholder='Pilih atau isi provinsi'
              onValueChange={handleProvinceChange}
              disabled={isLoading}
            />
            <LocationField
              control={form.control}
              name='kabKota'
              label='Kabupaten/Kota'
              options={cities}
              placeholder='Pilih atau isi kabupaten/kota'
              onValueChange={handleCityChange}
              disabled={isLoading}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <LocationField
              control={form.control}
              name='kecamatan'
              label='Kecamatan'
              options={districts}
              placeholder='Pilih atau isi kecamatan'
              onValueChange={handleDistrictChange}
              disabled={isLoading}
            />
            <LocationField
              control={form.control}
              name='kelurahan'
              label='Kelurahan/Desa'
              options={villages}
              placeholder='Pilih atau isi kelurahan/desa'
              onValueChange={() => {}}
              disabled={isLoading}
            />
          </div>
          <FormField
            control={form.control}
            name='alamat'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat </FormLabel>
                <FormControl>
                  <Input
                    className='w-full'
                    placeholder='Masukkan Alamat Lengkap Anda '
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='rt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel> RT </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      placeholder='Masukkan RT Lengkap Anda '
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rw'
              render={({ field }) => (
                <FormItem>
                  <FormLabel> RW </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      placeholder='Masukkan RW  '
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='penghasilanSebelum'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penghasilan sebelum pandemi</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      placeholder='Masukkan Penghasilan sebelum pandemi'
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      value={field.value || ''}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='penghasilanSetelah'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penghasilan setelah pandemi</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      placeholder='Masukkan Penghasilan setelah pandemi'
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      value={field.value || ''}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ReasonField
            control={form.control}
            name='alasanBantuan'
            disabled={isLoading}
          />
          <FormField
            control={form.control}
            name='pernyataan'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border-transparent p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>
                    Saya menyatakan bahwa data yang diisikan adalah benar dan siap mempertanggungjawabkan
                    apabila ditemukan ketidaksesuaian dalam data tersebut.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            className='w-full md:w-auto'
            type='submit'
            disabled={isLoading}>
            {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
