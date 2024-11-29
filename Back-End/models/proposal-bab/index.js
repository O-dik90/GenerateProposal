const dbPool = require('../../config/db');

const getListProposalBab = (proposal_id) => {
  const query = `SELECT * FROM proposal_bab where proposals_id = ?`;
  return dbPool.execute(query, [proposal_id]);
};

const getDetailProposalBab = (id) => {
  const query = `
    SELECT * from proposal_bab where id = ?
  `;
  return dbPool.execute(query, [id]);
};

const updateBabPendahuluan = (id, json_data) => {
  const query = `
    UPDATE proposal_bab
    set json_data = ?
    where id = ?;
  `;
  return dbPool.execute(query, [json_data, id]);
};

const updateDapus = (id, json_data) => {
  const query = `
    UPDATE proposal_bab
    set json_data = ?
    where id = ? and bab_title like '%DAFTAR PUSTAKA%'
  `;
  return dbPool.execute(query, [json_data, id]);
};

module.exports = {
  getListProposalBab,
  getDetailProposalBab,
  updateBabPendahuluan,
  updateDapus,
};
