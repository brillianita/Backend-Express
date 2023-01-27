exports.up = ((pgm) => {
  pgm.createTable('users', {
    id_user: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    nama: {
      type: 'VARCHAR',
      notNull: true,
    },
    email: {
      type: 'VARCHAR',
      notNull: true,
    },
    password: {
      type: 'VARCHAR',
      notNull: true,
    },
    username: {
      type: 'VARCHAR',
      notNull: true,
    },
  });
});

exports.down = (pgm) => {
  pgm.dropTable('users');
};
