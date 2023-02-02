exports.up = ((pgm) => {
  pgm.createTable('kontraktor', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    kont_pelaksana: {
      type: 'VARCHAR',
      notNull: true,
    },
    jenis_pekerjaan: {
      type: 'VARCHAR',
      notNull: true,
    },
    nama_pekerjaan: {
      type: 'VARCHAR',
      notNull: true,
    },
    nomor_kontrak: {
      type: 'VARCHAR',
      notNull: true,
    },
    lokasi_pekerjaan: {
      type: 'VARCHAR',
      notNull: true,
    },
    id_user: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'kontraktor',
    'fk_kontraktor.id_user_users.id',
    'FOREIGN KEY(id_user) REFERENCES users(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('kontraktor');
};
