const dbPool = require('../../config/db');

const getListProposalBab = (proposal_id) => {
  const query = `SELECT * FROM proposal_bab where proposals_id = ?`;
  return dbPool.execute(query, [proposal_id]);
};

const updateBabPendahuluan = (id, json_data) => {
  const query = `
    UPDATE proposal_bab
    set json_data = ?
    where id = ?;
  `;
  return dbPool.execute(query, [json_data, id]);
};

module.exports = {
  getListProposalBab,
  updateBabPendahuluan,
};
