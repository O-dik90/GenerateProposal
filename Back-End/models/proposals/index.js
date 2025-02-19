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
  console.log(data);
  const query = `
  INSERT INTO proposals (
  user_id, title, description, year, type, category, belmawa, perguruan, creation_date
  ) VALUES (?,?,?,?,?,?,?,?, NOW())`;

  const params = [
    data.user_id,
    data.title,
    data.description,
    data.year,
    data.type,
    data.category,
    data.belmawa,
    data.perguruan,
  ];
  return dbPool.execute(query, params);
};

const deleteProposal = async (id) => {
  await dbPool.execute(`DELETE FROM proposal_bab where proposals_id = ?`, [id]);
  const query = `DELETE FROM proposals WHERE id = ?`;
  return dbPool.execute(query, [id]);
};

const updateProposal = (id, data) => {
  const query = `
  UPDATE proposals 
  SET title = '${data.title}', 
  description = '${data.description}', 
  year = ${data.year} ,  
  type = '${data.type}', 
  category = '${data.category}',
  belmawa = '${data.belmawa}',
  perguruan = '${data.perguruan}',
  last_update = NOW()
  WHERE id = ${id}
  `;
  return dbPool.execute(query);
};

const initProposal = (id) => {
  const data = [
    [`${id}`, 'BAB 1 PENDAHULUAN', 'Latar Belakang', 'latar_belakang', 1, null],
    [
      `${id}`,
      'BAB 1 PENDAHULUAN',
      'Rumusan Masalah',
      'rumusan_masalah',
      1,
      null,
    ],
    [`${id}`, 'BAB 1 PENDAHULUAN', 'Luaran', 'luaran', 1, null],
    [`${id}`, 'BAB 1 PENDAHULUAN', 'Tujuan', 'tujuan', 1, null],
    [`${id}`, 'BAB 1 PENDAHULUAN', 'Manfaat', 'manfaat', 1, null],
    [`${id}`, 'BAB 2 TINJAUAN PUSTAKA', '', '', 1, null],
    [`${id}`, 'BAB 3 TAHAP PELAKSANAAN', '', '', 1, null],
    [`${id}`, 'BAB 4 BIAYA DAN JADWAL KEGIATAN', '', '', 1, null],
    [`${id}`, 'BAB 5 DAFTAR PUSTAKA', '', '', 1, null],
    [`${id}`, 'BAB 6 LAMPIRAN', '', '', 1, null],
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

const genStatusProposal = (id) => {
  const query = `
  select json_data from proposal_bab where proposals_id = ? and json_data is null
  `;
  return dbPool.execute(query, [id]);
};

const updateLatestProposal = (id) => {
  const query = `
  UPDATE proposals SET last_update = NOW() WHERE id = ?
  `;
  return dbPool.execute(query, [id]);
};

module.exports = {
  getAllProposals,
  getProposalId,
  addProposal,
  deleteProposal,
  updateProposal,
  initProposal,
  updateLatestProposal,
  genStatusProposal,
};
