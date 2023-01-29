exports.up = ((pgm) => {
  pgm.createTable('plan', {
    id_plan: {
      type: 'SERIAL',
      notNull: true,
      primaryKey: true,
    },
    datum_id: {
      type: 'INTEGER',
      notNull: true,
    },
    arr_value: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'plan',
    'fk_plan.datum_id_data_id_datum',
    'FOREIGN KEY(datum_id) REFERENCES data(id_datum) ON DELETE CASCADE',
  );
});

exports.down = (pgm) => {
  pgm.dropTable('plan');
};
