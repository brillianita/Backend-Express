exports.up = ((pgm) => {
  pgm.createTable('admin', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    nama: {
      type: 'VARCHAR',
      notNull: true,
    },
    sap: {
      type: 'VARCHAR',
      notNull: true,
    },
    seksi: {
      type: 'VARCHAR',
      notNull: true,
    },
    id_user: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'admin',
    'fk_admin.id_user_users.id',
    'FOREIGN KEY(id_user) REFERENCES users(id) ON DELETE CASCADE',
  );
});
exports.down = (pgm) => {
  pgm.dropTable('admin');
};
