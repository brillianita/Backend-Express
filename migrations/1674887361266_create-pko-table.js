exports.up = ((pgm) => {
  pgm.createTable('pko', {
    id_pko: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    tahun: {
      type: 'INTEGER',
      notNull: true,
    },
    pekerjaan: {
      type: 'TEXT',
      notNull: true,
    },
    notifikasi: {
      type: 'VARCHAR(15)',
      // notNull: true,
    },
    nomor_po: {
      type: 'VARCHAR(10)',
      // notNull: true,
    },
    tgl_mulai: {
      type: 'TIMESTAMP',
      // notNull: true,
    },
    target_selesai: {
      type: 'TIMESTAMP',
      // notNull: true,
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    keterangan: {
      type: 'TEXT',
      // notNull: true,
    },
    nilai_project: {
      type: 'BIGINT',
      // notNull: true,
    },
    status_penagihan: {
      type: 'VARCHAR(100)',
      // notNull: true,
    },
  });
});

exports.down = (pgm) => {
  pgm.dropTable('pko');
};
