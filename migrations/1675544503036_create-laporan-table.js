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
    nama_proyek: {
      type: 'VARCHAR',
      notNull: true,
    },
    nama_vendor: {
      type: 'VARCHAR',
      notNull: true,
    },
    file: {
      type: 'VARCHAR',
      notNull: true,
    },
    nomor_kontrak: {
      type: 'VARCHAR',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    catatan: {
      type: 'VARCHAR',
    },
    status: {
      type: 'VARCHAR',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'laporan',
    'fk_laporan.nomor_kontrak_kontraktor.nomor_kontrak',
    'FOREIGN KEY(nomor_kontrak) REFERENCES kontraktor(nomor_kontrak) ON DELETE CASCADE',
  );
});
exports.down = (pgm) => {
  pgm.dropTable('laporan');
};
