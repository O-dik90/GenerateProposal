const dbPool = require('../../config/db');

const getAllProposals = (user_id) => {
  const query = `SELECT * FROM proposals where user_id = ${user_id}`;
  return dbPool.execute(query);
};

const getProposalId = (id) => {
  const query = 'SELECT * FROM proposals WHERE id = ?';
  return dbPool.execute(query, [id]);
};

const addProposal = (data) => {
  const query = `
  INSERT INTO proposals (
  user_id, title, description, year, type, category, creation_date
  ) VALUES (?,?,?,?,?,?, NOW())`;

  const params = [
    data.user_id,
    data.title,
    data.description,
    data.year,
    data.type,
    data.category,
  ];
  return dbPool.execute(query, params);
};

const deleteProposal = async (id) => {
  await dbPool.execute(`DELETE FROM proposal_bab where proposals_id = ?`, [id]);
  const query = `DELETE FROM proposals WHERE id = ?`;
  return dbPool.execute(query, [id]);
};

const updateProposal = (id, data) => {
  const query = `UPDATE proposals SET title = '${data.title}', description = '${data.description}', year = ${data.year} ,  type = '${data.type}', category = '${data.category}' WHERE id = ${id}`;
  return dbPool.execute(query);
};

const initProposal = (id) => {
  const data = [
    [`${id}`, 'BAB 1. PENDAHULUAN', 'Latar Belakang', '', 1, null],
    [`${id}`, 'BAB 1. PENDAHULUAN', 'Rumusan Masalah', '', 1, null],
    [`${id}`, 'BAB 1. PENDAHULUAN', 'Luaran', '', 1, null],
    [`${id}`, 'BAB 1. PENDAHULUAN', 'Tujuan', '', 1, null],
    [`${id}`, 'BAB 1. PENDAHULUAN', 'Manfaat', '', 1, null],
    [`${id}`, 'BAB 2. TINJAUAN PUSTAKA', '', '', 1, null],
    [`${id}`, 'BAB 3. TAHAP PELAKSANAAN', '', '', 1, null],
    [`${id}`, 'BAB 4. BIAYA DAN JADWAL KEGIATAN', '', '', 1, null],
  ];

  const placeholders = data.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');

  const query = `
    INSERT INTO proposal_bab (
      proposals_id, bab_title, subbab_title, subbab_value, seq_no, json_data
    ) VALUES ${placeholders};
  `;

  const flattenedData = data.flat();
  return dbPool.execute(query, flattenedData);
};

module.exports = {
  getAllProposals,
  getProposalId,
  addProposal,
  deleteProposal,
  updateProposal,
  initProposal,
};
