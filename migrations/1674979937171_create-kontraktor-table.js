exports.up = ((pgm) => {
  pgm.createTable('kontraktor', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    jenis_pekerjaan: {
      type: 'VARCHAR',
      notNull: true,
    },
    nama_pekerjaan: {
      type: 'VARCHAR',
      notNull: true,
    },
    nomor_kontrak: {
      type: 'VARCHAR',
      notNull: true,
    },
    tgl_mulai: {
      type: 'TIMESTAMP',
    //   notNull: true,
    },
    tgl_selesai: {
      type: 'TIMESTAMP',
    //   notNull: true,
    },
    lokasi_pekerjaan: {
      type: 'VARCHAR',
      notNull: true,
    },
  });
});
exports.down = (pgm) => {
  pgm.dropTable('kontraktor');
};
