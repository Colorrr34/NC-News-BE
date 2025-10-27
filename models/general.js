const db = require("../db/connection");

exports.readRowInColumn = (table, columnName, value) => {
  //table and columnName must be hardcoded
  return db
    .query(`SELECT * FROM ${table} WHERE ${columnName} = $1`, [value])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not Found`,
        });
      } else return rows;
    });
};
