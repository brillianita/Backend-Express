exports.up = ((pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    admin_id: {
      type: 'INTEGER',
      notNull: false,
    },
    kontraktor_id: {
      type: 'INTEGER',
      notNull: false,
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
  pgm.addConstraint(
    'users',
    'fk_users.admin_id_admin.id',
    'FOREIGN KEY(admin_id) REFERENCES admin(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'users',
    'fk_users.kontraktor_id_kontraktor.id',
    'FOREIGN KEY(kontraktor_id) REFERENCES kontraktor(id) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('users');
};
