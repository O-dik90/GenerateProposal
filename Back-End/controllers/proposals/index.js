const { ProposalAttachs } = require("../../models/proposal-detail/proposal_attach");
const { ProposalDetails } = require("../../models/proposal-detail/proposal_detail");
const { Proposals } = require("../../models/proposals");

const { createProposalDetail } = require("../proposal-detail/proposal_detail");
const db = require("../../config/db");

const getProposals = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ msg: "params is empty" });
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
      return res.status(200).json({ msg: "data not found", data: [] });
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
      return res.status(400).json({ msg: "params is empty" });
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
      return res.status(200).json({ msg: "data not found", data: [] });
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
      return res.status(400).json({ msg: "Please fill in all fields" });
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
      return res.status(500).json({ msg: "Failed to create proposal" });
    }

    const detailResult = await createProposalDetail({ proposalId: proposal.id });

    if (detailResult !== true) {
      return res.status(500).json({ msg: "Proposal created, but failed to create details: " + detailResult });
    }

    return res.status(201).json({ msg: "Proposal and details created successfully", proposal });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProposal = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ msg: "params is empty" });
    }

    const proposal = await Proposals.update(req.body, {
      where: {
        id: req.body.id,
        user_id: user_id
      }
    });
    if (proposal.length === 0) {
      return res.status(404).json({ msg: "Failed to update proposal or proposal not found" });
    }

    return res.status(200).json({ msg: "success update" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteProposal = async (req, res) => {
  const transaction = await db.transaction(); // Ensure Sequelize is correctly instantiated
  try {
    const { item_id } = req.params;

    if (!item_id || item_id === undefined) {
      return res.status(400).json({ msg: "Invalid or missing proposal ID" });
    }

    const proposal = await Proposals.findByPk(item_id, { transaction });
    console.log(proposal)
    if (!proposal) {
      await transaction.rollback();
      return res.status(404).json({ msg: "Proposal not found" });
    }

    await Promise.all([
      ProposalDetails.destroy({ where: { proposal_id: item_id }, transaction }),
      ProposalAttachs.destroy({ where: { proposal_id: item_id }, transaction }),
    ]);

    await Proposals.destroy({ where: { id: item_id }, force: true, transaction });

    await transaction.commit();

    return res.status(200).json({ msg: "Proposal successfully deleted" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ msg: `Error deleting proposal: ${error.message}` });
  }
};


module.exports = {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal
};