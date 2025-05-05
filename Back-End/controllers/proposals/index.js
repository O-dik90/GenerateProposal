const { ProposalAttachs } = require("../../models/proposal-detail/proposal_attach");
const { ProposalDetails } = require("../../models/proposal-detail/proposal_detail");
const { Proposals } = require("../../models/proposals");

const { createProposalDetail } = require("../proposal-detail/proposal_detail");
const db = require("../../config/db");

const getProposals = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ msg: "Parameter kosong" });
    }
    const proposals = await Proposals.findAll({
      include: [{
        model: ProposalDetails,
        as: 'proposalDetails',
      },],
      where: {
        user_id: user_id
      }
    });
    if (proposals.length === 0) {
      return res.status(200).json({ msg: "Data tidak ditemukan", data: [] });
    }
    res.json(proposals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProposal = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { id: proposal_id } = req.body;
    if (!user_id || !proposal_id) {
      return res.status(400).json({ msg: "Parameter kosong" });
    }
    const proposals = await Proposals.findAll({
      include: [{
        model: ProposalDetails,
        as: 'proposalDetails',
        where: {
          proposal_id: proposal_id
        }
      }, {
        model: ProposalAttachs,
        as: 'proposalAttachs',
        required: false,
        where: {
          proposal_id: proposal_id
        }
      }
    ],
      where: {
        user_id: user_id,
        id: proposal_id
      }
    });
    if (proposals.length === 0) {
      return res.status(200).json({ msg: "Data tidak ditemukan", data: [] });
    }

    const proposalsWithStatus = proposals.map(proposal => {
      const allJsonDataNotNull = proposal.proposalDetails.every(detail => detail.json_data !== null);
      return {
        ...proposal.toJSON(),
        generate_status: allJsonDataNotNull
      };
    });
    
    res.json(proposalsWithStatus);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createProposal = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { title, description, year, pkm_type, pkm_category, pkm_desc, pkm_belmawa, pkm_perguruan } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Mohon diisi semua bagian" });
    }

    // ✅ Step 1: Create the Proposal
    const proposal = await Proposals.create({
      user_id,
      title,
      description,
      year,
      pkm_type,
      pkm_category,
      pkm_desc,
      pkm_belmawa,
      pkm_perguruan,
    });

    if (!proposal) {
      return res.status(500).json({ msg: "Gagal membuat proposal" });
    }

    const detailResult = await createProposalDetail({ proposalId: proposal.id });

    if (detailResult !== true) {
      return res.status(500).json({ msg: "Gagal membuat detail proposal: " + detailResult });
    }

    return res.status(201).json({ msg: "Proposal dan detail berhasil dibuat", proposal });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProposal = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ msg: "Parameter kosong" });
    }

    const proposal = await Proposals.update(req.body, {
      where: {
        id: req.body.id,
        user_id: user_id
      }
    });
    if (proposal.length === 0) {
      return res.status(404).json({ msg: "Gagal perbaharui proposal atau proposal tidak ditemukan " });
    }

    return res.status(200).json({ msg: "Berhasil perbaharui" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteProposal = async (req, res) => {
  const transaction = await db.transaction(); // Ensure Sequelize is correctly instantiated
  try {
    const { item_id } = req.params;

    if (!item_id || item_id === undefined) {
      return res.status(400).json({ msg: "Kesalahan atau tidak ditemukan ID proposal" });
    }

    const proposal = await Proposals.findByPk(item_id, { transaction });
    console.log(proposal)
    if (!proposal) {
      await transaction.rollback();
      return res.status(404).json({ msg: "Proposal tidak ditemukan " });
    }

    await Promise.all([
      ProposalDetails.destroy({ where: { proposal_id: item_id }, transaction }),
      ProposalAttachs.destroy({ where: { proposal_id: item_id }, transaction }),
    ]);

    await Proposals.destroy({ where: { id: item_id }, force: true, transaction });

    await transaction.commit();

    return res.status(200).json({ msg: "Berhasil menghapus proposal" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ msg: `Gagal menghapus proposal: ${error.message}` });
  }
};


module.exports = {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal
};