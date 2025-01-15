export const Fields = {
  author: [
    { name: 'given', label: 'Nama Depan', type: 'text', size: 6 },
    { name: 'family', label: 'Nama Belakang', type: 'text', size: 6 }
  ],
  buku: [
    { name: 'title', label: 'Judul', type: 'text', size: 4 },
    { name: 'publisher', label: 'Penerbit', type: 'text', size: 2 },
    { name: 'publisher_place', label: 'Tempat Terbit', type: 'text', size: 4 },
    { name: 'date_parts', label: 'Tanggal Terbit', type: 'date', size: 2 },
    { name: 'ISBN', label: 'ISBN', helperText: 'Opsional / Tidak wajib', type: 'text', size: 2 },
    { name: 'edition', label: 'Edisi', helperText: 'Opsional / Tidak wajib', type: 'text', size: 2 },
    { name: 'volume', label: 'Volume', helperText: 'Opsional / Tidak wajib', type: 'text', size: 2 },
    { name: 'page', label: 'Halaman', helperText: 'Opsional / Tidak wajib', type: 'text', size: 2 },
    { name: 'URL', label: 'URL', helperText: 'Opsional / Tidak wajib', type: 'text', size: 2 },
    { name: 'access_date', label: 'Tanggal Akses', helperText: 'Opsional / Tidak wajib', type: 'date', size: 2 },
    {
      name: 'abstract',
      label: 'Abstrak',
      helperText: 'Opsional / Tidak wajib',
      type: 'textarea',
      size: 12,
      rows: 4
    }
  ],
  jurnal: [
    { name: 'title', label: 'Judul', type: 'text', size: 4 },
    { name: 'container_title', label: 'Nama Jurnal', type: 'text', size: 2 },
    { name: 'volume', label: 'Volume', type: 'text', size: 2 },
    { name: 'issue', label: 'Edisi', type: 'text', size: 2 },
    { name: 'page', label: 'Halaman', type: 'text', size: 2 },
    { name: 'date_parts', label: 'Tanggal Terbit', type: 'date', size: 2 },
    { name: 'publisher', label: 'Penerbit', type: 'text', size: 3 },
    { name: 'publisher_place', label: 'Tempat Terbit', type: 'text', size: 3 },
    { name: 'DOI', label: 'DOI', helperText: 'Opsional / Tidak wajib', type: 'text', size: 4 },
    { name: 'access_date', label: 'Tanggal Akses', helperText: 'Opsional / Tidak wajib', type: 'date', size: 2 },
    { name: 'URL', label: 'URL', helperText: 'Opsional / Tidak wajib', type: 'text', size: 6 },
    { name: 'issn', label: 'ISSN', helperText: 'Opsional / Tidak wajib', type: 'text', size: 4 },
    { name: 'abstract', label: 'Abstrak', helperText: 'Opsional / Tidak wajib', type: 'textarea', size: 12, rows: 4 }
  ],
  url: [
    { name: 'title', label: 'Judul', type: 'text', size: 4 },
    { name: 'url', label: 'URL', type: 'text', size: 4 },
    { name: 'date_parts', label: 'Tanggal Publish', type: 'date', size: 4 },
    { name: 'access_date', label: 'Tanggal Akses', type: 'date', size: 4 },
    { name: 'publisher', label: 'Penerbit', helperText: 'Opsional / Tidak wajib', type: 'text', size: 4 },
    { name: 'note', label: 'Catatan', helperText: 'Opsional / Tidak wajib', type: 'text', size: 4 },
    { name: 'abstract', label: 'Abstrak', helperText: 'Opsional / Tidak wajib', type: 'textarea', size: 12, rows: 4 }
  ]
};
