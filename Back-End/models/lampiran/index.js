const dbPool = require('../../config/db');

const getListImage = (id, condition) => {
  let query =
    'SELECT id, proposals_id, type, description, filename, url, upload_date FROM proposal_lampiran';
  if (condition) {
    query + `WHERE proposals_id = ? AND type = ?`;
    return dbPool.execute(query, [id, condition]);
  } else {
    query + `WHERE proposals_id = ?`;
    return dbPool.execute(query, [id]);
  }
};

const addImage = (data) => {
  const query = `
  INSERT INTO proposal_lampiran (proposals_id, type, description, filename, url, upload_date)
  VALUES (?, ?,?, ?, ?, NOW())
  `;
  return dbPool.execute(query, data);
};

const updateImage = (data) => {
  const query = `
  UPDATE proposal_lampiran SET description = ?, filename = ?, url = ? WHERE id = ?
  `;
  return dbPool.execute(query, data);
};

const deleteImage = (id) => {
  const query = `
  DELETE FROM proposal_lampiran WHERE id = ?
  `;
  return dbPool.execute(query, [id]);
};
module.exports = {
  getListImage,
  addImage,
  updateImage,
  deleteImage,
};
