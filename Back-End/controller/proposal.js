const dbConnection = require('../config/db');
const { sendResponse } = require('../utils/resHandler');


const getListProposals = async (req, res, next) => {
  try {
    const db = await dbConnection();
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, "User ID is required");
    }

    const [rows] = await db.query('SELECT * FROM proposals WHERE user_id = ?', [id]);
    if (rows.length === 0) {
      return sendResponse(res, 404, "No data found");
    }

    sendResponse(res, 200, "Proposals fetched successfully", rows);
  } catch (error) {
    next(error);
  }
};

const addProposal = async (req, res, next) => {
  try {
    const db = await dbConnection();
    const { user_id, title, description, year, type, category } = req.body;

    if (!title || !description) {
      return sendResponse(res, 400, "Title and description are required fields.");
    }

    const data = { user_id, title, description, year, type, category, creation_date: new Date() };
    const [result] = await db.query('INSERT INTO proposals SET ?', data);

    if (result.affectedRows === 1) {
      return sendResponse(res, 201, "Proposal successfully inserted", { proposal_id: result.insertId });
    }

    sendResponse(res, 500, "Failed to insert proposal");
  } catch (error) {
    next(error);
  }
};

const deleteProposal = async (req, res, next) => {
  try {
    const db = await dbConnection();
    const { proposal_id } = req.params;

    if (!proposal_id) {
      return sendResponse(res, 400, "Proposal ID is required");
    }

    const [result] = await db.query('DELETE FROM proposals WHERE id = ?', [proposal_id]);

    if (result.affectedRows === 1) {
      return sendResponse(res, 200, "Proposal deleted successfully");
    }

    sendResponse(res, 400, "Failed to delete proposal");
  } catch (error) {
    next(error);
  }
};

const getProposal = async (req, res, next) => {
  try {
    const db = await dbConnection();
    const { proposal_id } = req.params;

    if (!proposal_id) {
      return sendResponse(res, 400, "Proposal ID is required");
    }

    const [result] = await db.query('SELECT * FROM proposals WHERE id = ?', [proposal_id]);

    if (result.length === 0) {
      return sendResponse(res, 404, "Proposal not found");
    }

    sendResponse(res, 200, "Proposal fetched successfully", result[0]);
  } catch (error) {
    next(error);
  }
};

const updateProposal = async (req, res, next) => {
  try {
    const db = await dbConnection();
    const { proposal_id } = req.params;
    const { title, description, year, type, category } = req.body;

    if (!proposal_id) {
      return sendResponse(res, 400, "Proposal ID is required");
    }

    const [result] = await db.query('UPDATE proposals SET title = ?, description = ?, year = ?, type = ?, category = ?, last_update = ? WHERE id = ?', [title, description, year, type, category, new Date(), proposal_id]);

    if (result.affectedRows === 1) {
      return sendResponse(res, 200, "Proposal updated successfully");
    }

    sendResponse(res, 400, "Failed to update proposal");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListProposals,
  getProposal,
  addProposal,
  deleteProposal,
  updateProposal
};
