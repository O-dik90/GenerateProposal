const dbPool = require('../../config/db');

const getMaster = () => {
  const query = `SELECT id, name, name_id, name_desc FROM master`;
  return dbPool.execute(query);
};

const getMasterSourceName = (params) => {
  const query = `SELECT id, is_default, source_name, name_id, name_desc FROM master_data where source_name like '${params}%'`;
  return dbPool.execute(query);
};

const getMasterDapus = (params) => {
  const query = `SELECT id, name, name_id, name_desc FROM master_dapus where category like '${params}%'`;
  return dbPool.execute(query);
};

module.exports = {
  getMaster,
  getMasterSourceName,
  getMasterDapus,
};
