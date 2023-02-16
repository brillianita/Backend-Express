exports.up = ((pgm) => {
  pgm.createTable('note', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    masalah: {
      type: 'VARCHAR',
      notNull: true,
    },
    solusi: {
      type: 'VARCHAR',
      notNull: true,
    },
    id_lap_harian: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'note',
    'fk_note.id_lap_harian_lap_harian.id',
    'FOREIGN KEY(id_lap_harian) REFERENCES lap_harian(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('note');
};
