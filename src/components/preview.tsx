import React, { useCallback, useMemo } from 'react';
import { FormValues } from '@/lib/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { X, User, CreditCard, Home, DollarSign, HelpCircle, FileText } from 'lucide-react';

interface PreviewDataProps {
  data: FormValues;
  onClose: () => void;
  isOpen: boolean;
}

export function PreviewData({ data, onClose, isOpen }: PreviewDataProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const previewSections = useMemo(
    () => [
      {
        title: 'Informasi Pribadi',
        icon: <User className='w-6 h-6 text-blue-500' />,
        items: [
          { label: 'Nama', value: data.nama },
          { label: 'NIK', value: data.nik.toString() },
          { label: 'Nomor KK', value: data.noKK.toString() },
          { label: 'Umur', value: data.umur.toString() },
          { label: 'Jenis Kelamin', value: data.jenisKelamin },
        ],
      },
      {
        title: 'Alamat',
        icon: <Home className='w-6 h-6 text-green-500' />,
        items: [
          { label: 'Provinsi', value: data.provinsi },
          { label: 'Kabupaten/Kota', value: data.kabKota },
          { label: 'Kecamatan', value: data.kecamatan },
          { label: 'Kelurahan/Desa', value: data.kelurahan },
          { label: 'RT', value: data.rt.toString() },
          { label: 'RW', value: data.rw.toString() },
          { label: 'Alamat', value: data.alamat },
        ],
      },
      {
        title: 'Informasi Finansial',
        icon: <DollarSign className='w-6 h-6 text-yellow-500' />,
        items: [
          { label: 'Penghasilan Sebelum Pandemi', value: `Rp ${data.penghasilanSebelum.toLocaleString()}` },
          { label: 'Penghasilan Setelah Pandemi', value: `Rp ${data.penghasilanSetelah.toLocaleString()}` },
        ],
      },
      {
        title: 'Alasan Bantuan',
        icon: <HelpCircle className='w-6 h-6 text-purple-500' />,
        items: [{ label: 'Alasan', value: data.alasanBantuan }],
      },
      {
        title: 'Pernyataan',
        icon: <FileText className='w-6 h-6 text-indigo-500' />,
        items: [{ label: 'Persetujuan', value: data.pernyataan ? 'Disetujui' : 'Tidak Disetujui' }],
      },
    ],
    [data]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-[800px] p-0 bg-gray-50'
        onKeyDown={handleKeyDown}>
        <DialogHeader className='px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg'>
          <DialogTitle className='text-2xl font-bold'>Preview Data Pengajuan</DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-[70vh] p-6'>
          <div className='space-y-6'>
            {previewSections.map((section, index) => (
              <PreviewSection
                key={index}
                {...section}
              />
            ))}
            <ImagePreviewSection
              ktpFile={data.fotoKTP}
              kkFile={data.fotoKK}
            />
          </div>
        </ScrollArea>
        <div className='px-6 py-4 bg-gray-100 rounded-b-lg flex justify-end'>
          <DialogClose asChild>
            <button className='px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center'>
              <X className='w-4 h-4 mr-2' />
              Tutup Preview
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PreviewSection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string }[];
}) {
  return (
    <div className='bg-white rounded-lg shadow-md p-4'>
      <div className='flex items-center mb-3'>
        {icon}
        <h3 className='text-lg font-semibold ml-2'>{title}</h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {items.map((item, index) => (
          <div
            key={index}
            className='flex flex-col'>
            <span className='text-sm text-gray-500'>{item.label}</span>
            <span className='font-medium'>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImagePreviewSection({ ktpFile, kkFile }: { ktpFile: File | undefined; kkFile: File | undefined }) {
  return (
    <div className='bg-white rounded-lg shadow-md p-4'>
      <div className='flex items-center mb-3'>
        <CreditCard className='w-6 h-6 text-red-500' />
        <h3 className='text-lg font-semibold ml-2'>Dokumen</h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <ImagePreview
          label='Foto KTP'
          file={ktpFile}
        />
        <ImagePreview
          label='Foto KK'
          file={kkFile}
        />
      </div>
    </div>
  );
}

function ImagePreview({ label, file }: { label: string; file: File | undefined }) {
  return (
    <div className='space-y-2'>
      <span className='text-sm text-gray-500'>{label}</span>
      {file ? (
        <div className='mt-2 relative group'>
          <img
            src={URL.createObjectURL(file)}
            alt={label}
            className='w-full h-auto rounded-lg shadow-sm transition-all duration-200 group-hover:shadow-md'
          />
        </div>
      ) : (
        <p className='text-red-500 text-sm'>Tidak ada file yang diunggah</p>
      )}
    </div>
  );
}
