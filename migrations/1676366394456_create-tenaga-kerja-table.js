exports.up = ((pgm) => {
  pgm.createTable('tenaga_kerja', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    jabatan: {
      type: 'VARCHAR',
      notNull: true,
    },
    jmlh: {
      type: 'INTEGER',
      notNull: true,
    },
    status_hari: {
      type: 'VARCHAR',
      notNull: true,
    },
    id_lap_harian: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'tenaga_kerja',
    'fk_tenaga_kerja.id_lap_harian_lap_harian.id',
    'FOREIGN KEY(id_lap_harian) REFERENCES lap_harian(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('tenaga_kerja');
};
