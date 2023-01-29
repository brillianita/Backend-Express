exports.up = ((pgm) => {
  pgm.createTable('monitoring_pr', {
    id_monitor: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    tahun: {
      type: 'INTEGER',
      notNull: true,
    },
    opex_capex: {
      type: 'VARCHAR(20)',
      // notNull: true,
    },
    pr_date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    notifikasi: {
      type: 'VARCHAR(100)',
      // notNull: true,
    },
    pr_number: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    pr_valprice: {
      type: 'BIGINT',
      notNull: true,
    },
    coll_status: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    purchase_order: {
      type: 'VARCHAR(11)',
      // notNull: true,
    },
    pic: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
});

exports.down = (pgm) => {
  pgm.dropTable('monitoring_pr');
};
