const dbPool = require('../../config/db');

const getListProposalBab = (proposals_id) => {
  const query = `SELECT * FROM proposal_bab where proposals_id = ?`;
  return dbPool.execute(query, [proposals_id]);
};

const getDetailProposalBab = (id, proposals_id) => {
  const query = `
    SELECT * from proposal_bab where id = ? and proposals_id = ?
  `;
  return dbPool.execute(query, [id, proposals_id]);
};

const updateBabPendahuluan = (id, json_data) => {
  const query = `
    UPDATE proposal_bab
    set json_data = ?
    where id = ?;
  `;
  return dbPool.execute(query, [json_data, id]);
};

const updateBab = (id, json_data) => {
  const query = `
    UPDATE proposal_bab
    set json_data = ?
    where id = ? 
  `;

  return dbPool.execute(query, [json_data, id]);
};

module.exports = {
  getListProposalBab,
  getDetailProposalBab,
  updateBabPendahuluan,
  updateBab,
};
