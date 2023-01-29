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
    user_id: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'refresh_token',
    'fk_refresh_token.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('refresh_token');
};
