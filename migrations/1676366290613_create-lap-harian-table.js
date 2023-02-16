exports.up = ((pgm) => {
  pgm.createTable('lap_harian', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    tgl: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    aktivitas: {
      type: 'TEXT[]',
      notNull: true,
    },
    rencana: {
      type: 'TEXT[]',
      notNull: true,
    },
    status: {
      type: 'VARCHAR',
      notNull: true,
    },
    note: {
      type: 'TEXT[]',
      notNull: false,
    },
    id_laporan: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'lap_harian',
    'fk_lap_harian.id_laporan_laporan.id',
    'FOREIGN KEY(id_laporan) REFERENCES laporan(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('lap_harian');
};
