exports.up = ((pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR',
      notNull: true,
    },
    password: {
      type: 'VARCHAR',
      notNull: true,
    },
    role: {
      type: 'VARCHAR',
      notNull: true,
    },
  });
});

exports.down = (pgm) => {
  pgm.dropTable('users');
};
