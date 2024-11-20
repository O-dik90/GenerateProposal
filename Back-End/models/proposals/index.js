const dbPool = require('../../config/db');

const getAllProposals = (user_id) => {
  const query = `SELECT * FROM proposals where user_id = ${user_id}`;
  return dbPool.execute(query);
}

const getProposalId = (id) => {
  const query = 'SELECT * FROM proposals WHERE id = ?';
  return dbPool.execute(query, [id]);
}

const addProposal = (data) => {
  const query = `INSERT INTO proposals (user_id, title, description, year, type, category, creation_date) VALUES (${data.user_id}, '${data.title}', '${data.description}', ${data.year}, '${data.type}', '${data.category}', NOW())`;
  return dbPool.execute(query);
}

const deleteProposal = (id) => {
  const query = `DELETE FROM proposals WHERE id = ${id}`;
  return dbPool.execute(query);
}
const updateProposal = (id, data) => {
  const query = `UPDATE proposals SET title = '${data.title}', description = '${data.description}', year = ${data.year} ,  type = '${data.type}', category = '${data.category}' WHERE id = ${id}`;
  return dbPool.execute(query);
}

module.exports = {
  getAllProposals,
  getProposalId,
  addProposal,
  deleteProposal,
  updateProposal
}