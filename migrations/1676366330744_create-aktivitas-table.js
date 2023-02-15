exports.up = ((pgm) => {
  pgm.createTable('aktivitas', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    desc: {
      type: 'TEXT',
      notNull: true,
    },
    id_lap_harian: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'aktivitas',
    'fk_aktivitas.id_lap_harian_lap_harian.id',
    'FOREIGN KEY(id_lap_harian) REFERENCES lap_harian(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('aktivitas');
};
