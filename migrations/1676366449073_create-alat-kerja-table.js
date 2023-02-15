exports.up = ((pgm) => {
  pgm.createTable('alat_kerja', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    alat: {
      type: 'VARCHAR',
      notNull: true,
    },
    qty: {
      type: 'INTEGER',
      notNull: true,
    },
    id_lap_harian: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'alat_kerja',
    'fk_alat_kerja.id_lap_harian_lap_harian.id',
    'FOREIGN KEY(id_lap_harian) REFERENCES lap_harian(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('alat_kerja');
};
