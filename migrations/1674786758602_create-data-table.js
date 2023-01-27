exports.up = ((pgm) => {
  pgm.createTable('data', {
    id_datum: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    nm_jenis: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    tahun: {
      type: 'INTEGER(4)',
      notNull: true,
    },
    no_proyek: {
      type: 'VARCHAR(15)',
      notNull: true,
    },
    tgl_mulai: {
      type: 'TIMESTAMP',
      // notNull: true,
    },
    tgl_akhir: {
      type: 'TIMESTAMP',
      // notNull: true,
    },
    nm_proyek: {
      type: 'TEXT',
      notNull: true,
    },
    nm_rekanan: {
      type: 'TEXT',
      notNull: true,
    },
    nm_proye: {
      type: 'TEXT',
      notNull: true,
    },
    nm_pro: {
      type: 'TEXT',
      notNull: true,
    },
  });
});

exports.down = (pgm) => {
  pgm.dropTable('data');
};
