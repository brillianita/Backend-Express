exports.up = ((pgm) => {
  pgm.createTable('kond_cuaca', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    baik: {
      type: 'TEXT[]',
      notNull: false,
    },
    mendung: {
      type: 'TEXT[]',
      notNull: false,
    },
    hujan_tinggi: {
      type: 'TEXT[]',
      notNull: false,
    },
    hujan_rendah: {
      type: 'TEXT[]',
      notNull: false,
    },
    id_lap_harian: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'kond_cuaca',
    'fk_kond_cuaca.id_lap_harian_lap_harian.id',
    'FOREIGN KEY(id_lap_harian) REFERENCES lap_harian(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('kond_cuaca');
};
