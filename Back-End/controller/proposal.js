require('date-fns/locale');
const Proposals = require('../models/proposals');
const ProposalBab = require('../models/proposal-bab');
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
    const { proposals_id } = req.params;

    if (proposals_id === undefined || proposals_id === 0) {
      throw new Error('proposal id not found');
    }

    const [result] = await Proposals.getProposalId(proposals_id);
    const [resDetail] = await ProposalBab.getListProposalBab(proposals_id);
    const [resGen] = await Proposals.genStatusProposal(proposals_id);

    const generateStatus = resGen.length > 0 ? false : true;

    if (result.length === 0 || resDetail.length === 0) {
      throw new Error('data or detail not found');
    }

    return res.json({
      message: 'success',
      generate_status: generateStatus,
      data: {
        ...result[0],
        detail: {
          pendahuluan: {
            latar_belakang: resDetail[0].json_data,
            rumusan_masalah: JSON.parse(resDetail[1]?.json_data),
            luaran: JSON.parse(resDetail[2]?.json_data),
            tujuan: JSON.parse(resDetail[3]?.json_data),
            manfaat: JSON.parse(resDetail[4]?.json_data),
          },
          tinjauan: JSON.parse(resDetail.slice(5, 6)[0]?.json_data || null),
          pelaksanaan: JSON.parse(resDetail.slice(6, 7)[0]?.json_data || null),
          biaya: JSON.parse(resDetail.slice(7, 8)[0]?.json_data || null),
          dapus: JSON.parse(resDetail.slice(8, 9)[0]?.json_data || null),
          lampiran: JSON.parse(resDetail.slice(-1)[0]?.json_data || null),
        },
        metadata: JSON.stringify(resDetail),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
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
    const { proposals_id } = req.params;
    const [data] = await Proposals.initProposal(proposals_id);

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
    const { proposals_id } = req.params;

    if (!proposals_id) {
      throw new Error('Proposal ID is required');
    }

    const [result] = await Proposals.deleteProposal(proposals_id);

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
    const { proposals_id } = req.params;
    const { title, description, year, type, category } = req.body;

    if (!proposals_id) {
      throw new Error('Proposal ID is required');
    }

    const [data] = await Proposals.getProposalId(proposals_id);

    if (!data) {
      throw new Error('data not found');
    }

    const [result] = await Proposals.updateProposal(proposals_id, {
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
