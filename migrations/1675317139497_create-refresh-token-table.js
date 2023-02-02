exports.up = ((pgm) => {
  pgm.createTable('refresh_token', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    token: {
      type: 'VARCHAR',
      notNull: true,
    },
    tanggal_expired: {
      type: 'TIMESTAMP',
      notNull: false,
    },
    id_user: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'refresh_token',
    'fk_refresh_token.id_user_users.id',
    'FOREIGN KEY(id_user) REFERENCES users(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('refresh_token');
};
