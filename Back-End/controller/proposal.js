require('date-fns/locale');
const Proposals = require('../models/proposals');

const getListProposals = async (req, res) => {
  try {
    const id = req.params.user_id;

    const [data] = await Proposals.getAllProposals(id);

    if (data.length === 0) {
      return res.json({
        message: 'data not found',
        data: [],
      });
    }

    return res.json({
      message: 'success',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

const getProposal = async (req, res) => {
  try {
    const { proposal_id } = req.params;

    if (!proposal_id) {
      return sendResponse(res, 400, 'Proposal ID is required');
    }

    const [result] = await Proposals.getProposalId(proposal_id);
    return res.json({
      message: 'success',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

const addProposal = async (req, res) => {
  try {
    const { user_id, title, description, year, type, category } = req.body;

    if (!title || !description) {
      throw new Error('Title and description are required');
    }
    const data = {
      user_id,
      title,
      description,
      year,
      type,
      category,
    };
    const [result] = await Proposals.addProposal(data);

    if (result.affectedRows === 0) {
      throw new Error('Failed add data');
    }

    const [initialData] = await Proposals.initProposal(result.insertId);

    if (initialData.length === 0) {
      throw new Error('Failed to initialize proposal');
    }

    return res.status(200).json({
      message: 'success',
      data: {
        header: result.affectedRows,
        init: initialData.affectedRows,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

const initProposal = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const [data] = await Proposals.initProposal(proposal_id);

    return res.status(200).json({
      message: 'success',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

const deleteProposal = async (req, res) => {
  try {
    const { proposal_id } = req.params;

    if (!proposal_id) {
      throw new Error('Proposal ID is required');
    }

    const [result] = await Proposals.deleteProposal(proposal_id);

    if (result.affectedRows === 0) {
      throw new Error('Proposal not found');
    }
    return res.json({
      message: 'Proposal deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

const updateProposal = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const { title, description, year, type, category } = req.body;

    if (!proposal_id) {
      throw new Error('Proposal ID is required');
    }

    const [result] = await Proposals.updateProposal(proposal_id, {
      title,
      description,
      year,
      type,
      category,
    });

    if (result.affectedRows === 1) {
      return res.json({
        message: 'success',
        data: result,
      });
    }

    return res.status(404).json({
      message: 'Proposal not found',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

module.exports = {
  getListProposals,
  getProposal,
  addProposal,
  deleteProposal,
  updateProposal,
  initProposal,
};
