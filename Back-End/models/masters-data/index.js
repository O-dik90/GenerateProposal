const dbPool = require('../../config/db');

const getMasterSourceName = (params) => {
  const query = `SELECT * FROM master_data where source_name like '${params}%'`;
  return dbPool.execute(query);
};

module.exports = {
  getMasterSourceName,
};
