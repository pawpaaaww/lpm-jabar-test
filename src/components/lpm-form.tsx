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
      nik: 0,
      noKK: 0,
      fotoKTP: undefined,
      fotoKK: undefined,
      umur: 25,
      jenisKelamin: 'Laki-laki',
      provinsi: '',
      kabKota: '',
      kecamatan: '',
      kelurahan: '',
      alamat: '',
      rt: '',
      rw: '',
      penghasilanSebelum: 0,
      penghasilanSetelah: 0,
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

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div
      className={cn('grid gap-6', className)}
      {...props}>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className='space-y-2'>
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='fotoKTP'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Foto KTP</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/jpeg,image/png,image/bmp'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    {...field}
                    value={value instanceof File ? undefined : (value as unknown as string)}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='fotoKK'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Foto KK</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/jpeg,image/png,image/bmp'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    {...field}
                    value={value instanceof File ? undefined : (value as unknown as string)}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='umur'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Umur</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan Umur '
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
            name='jenisKelamin'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
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
          <LocationField
            control={form.control}
            name='provinsi'
            label='Provinsi'
            options={provinces}
            placeholder='Pilih atau isi provinsi'
            onValueChange={handleProvinceChange}
          />
          <LocationField
            control={form.control}
            name='kabKota'
            label='Kabupaten/Kota'
            options={cities}
            placeholder='Pilih atau isi kabupaten/kota'
            onValueChange={handleCityChange}
          />

          <LocationField
            control={form.control}
            name='kecamatan'
            label='Kecamatan'
            options={districts}
            placeholder='Pilih atau isi kecamatan'
            onValueChange={handleDistrictChange}
          />

          <LocationField
            control={form.control}
            name='kelurahan'
            label='Kelurahan/Desa'
            options={villages}
            placeholder='Pilih atau isi kelurahan/desa'
            onValueChange={() => {}}
          />
          <FormField
            control={form.control}
            name='alamat'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan Alamat Lengkap Anda '
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
            name='rt'
            render={({ field }) => (
              <FormItem>
                <FormLabel> RT </FormLabel>
                <FormControl>
                  <Input
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
                    placeholder='Masukkan RW  '
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
            name='penghasilanSebelum'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Penghasilan sebelum pandemi</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan Penghasilan sebelum pandemi'
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
            name='penghasilanSetelah'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Penghasilan setelah pandemi</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan Penghasilan setelah pandemi'
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ReasonField
            control={form.control}
            name='alasanBantuan'
          />

          <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
