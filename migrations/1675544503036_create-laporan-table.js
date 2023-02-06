exports.up = ((pgm) => {
  pgm.createTable('laporan', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    jenis_laporan: {
      type: 'VARCHAR',
      notNull: true,
    },
    urutan_lap: {
      type: 'INTEGER',
      notNull: false,
    },
    nama_vendor: {
      type: 'VARCHAR',
      notNull: true,
    },
    file: {
      type: 'VARCHAR',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    catatan: {
      type: 'TEXT',
    },
    status: {
      type: 'VARCHAR',
      notNull: true,
    },
    id_datum: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'laporan',
    'fk_laporan.id_datum_data.id_datum',
    'FOREIGN KEY(id_datum) REFERENCES data(id_datum) ON DELETE CASCADE',
  );
});
exports.down = (pgm) => {
  pgm.dropTable('laporan');
};
