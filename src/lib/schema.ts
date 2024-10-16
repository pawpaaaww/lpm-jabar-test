import * as z from 'zod';

export const formSchema = z.object({
  nama: z.string().min(1, 'Nama harus diisi'),
  nik: z.number().refine((val) => val.toString().length === 16, 'NIK harus 16 digit'),
  noKK: z.number().refine((val) => val.toString().length === 16, 'Nomor KK harus 16 digit'),
  fotoKTP: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= 2 * 1024 * 1024, 'Ukuran file maksimal 2MB')
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/bmp'].includes(file.type),
        'Format file harus JPG, PNG, atau BMP'
      ),
    z.undefined(),
  ]),
  fotoKK: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= 2 * 1024 * 1024, 'Ukuran file maksimal 2MB')
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/bmp'].includes(file.type),
        'Format file harus JPG, PNG, atau BMP'
      ),
    z.undefined(),
  ]),
  umur: z.number().min(25, 'Umur minimal 25 tahun'),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan']),
  provinsi: z.string().min(1, 'Pilih atau isi provinsi'),
  kabKota: z.string().min(1, 'Pilih atau isi kabupaten/kota'),
  kecamatan: z.string().min(1, 'Pilih atau isi kecamatan'),
  kelurahan: z.string().min(1, 'Pilih atau isi kelurahan/desa'),
  alamat: z.string().max(255, 'Alamat maksimal 255 karakter'),
  rt: z.union([z.string(), z.number()]).refine((val) => val !== '', 'RT harus diisi'),
  rw: z.union([z.string(), z.number()]).refine((val) => val !== '', 'RW harus diisi'),
  penghasilanSebelum: z.number().min(0, 'Penghasilan tidak boleh negatif'),
  penghasilanSetelah: z.number().min(0, 'Penghasilan tidak boleh negatif'),
  alasanBantuan: z.union([
    z.enum(['Kehilangan pekerjaan', 'Kepala keluarga', 'Tergolong fakir/miskin']),
    z.string().min(1, "Alasan harus diisi jika memilih 'Lainnya'"),
  ]),
  pernyataan: z.boolean().refine((val) => val === true, 'Anda harus menyetujui pernyataan ini'),
});

export type FormValues = z.infer<typeof formSchema>;
