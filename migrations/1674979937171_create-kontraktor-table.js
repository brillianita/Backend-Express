exports.up = ((pgm) => {
  pgm.createTable('kontraktor', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    kont_pelaksana: {
      type: 'VARCHAR',
      notNull: true,
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
    lokasi_pekerjaan: {
      type: 'VARCHAR',
      notNull: true,
    },
  });
});
exports.down = (pgm) => {
  pgm.dropTable('kontraktor');
};
