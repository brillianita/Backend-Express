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
    SAP: {
      type: 'VARCHAR',
      notNull: true,
    },
    seksi: {
      type: 'VARCHAR',
      notNull: true,
    },
  });
});
exports.down = (pgm) => {
  pgm.dropTable('admin');
};
