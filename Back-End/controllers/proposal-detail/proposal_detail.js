const { ProposalDetails } = require("../../models/proposal-detail/proposal_detail");
const { Op } = require('sequelize');
const { formatCitations } = require("../daftar-pustaka");
const createProposalDetail = async (params) => {
  try {
    const proposalId = params.proposalId;
    if (!proposalId) {
      throw new Error("proposalId is required");
    }

    const jsonDataBAB1 = {
      latar_belakang: null,
      rumusan_masalah: null,
      tujuan: null,
      luaran: null,
      manfaat: null,
    };

    const jsonDataBAB6 = {
      identitas: null,
      anggaran: null,
      organisasi: null,
    };

    const data = [
      [proposalId, "BAB 1 PENDAHULUAN", null, null, JSON.stringify(jsonDataBAB1)],
      [proposalId, "BAB 2 TINJAUAN PUSTAKA", null, null, null],
      [proposalId, "BAB 3 TAHAP PELAKSANAAN", null, null, null],
      [proposalId, "BAB 4 BIAYA DAN JADWAL KEGIATAN", null, null, null],
      [proposalId, "BAB 5 DAFTAR PUSTAKA", null, null, null],
      [proposalId, "BAB 6 LAMPIRAN", null, null, JSON.stringify(jsonDataBAB6)],
    ];

    const proposalDetail = await ProposalDetails.bulkCreate(
      data.map(([proposal_id, bab_title, subbab_title, subbab_value, json_data]) => ({
        proposal_id,
        bab_title,
        subbab_title,
        subbab_value,
        json_data,
      }))
    );

    if (proposalDetail.length === 0) {
      throw new Error("Failed to create proposal detail");
    }

    return true;
  } catch (error) {
    return error.message;
  }
};

const updateProposalDetail = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const { bab_title, json_data } = req.body;

    if (!proposal_id) {
      return res.status(400).json({ msg: "Proposal ID is required" });
    }

    let updatedProposal;

    if (bab_title !== 'DAFTAR PUSTAKA') {

      updatedProposal = await ProposalDetails.update(
        { json_data: JSON.stringify(json_data) },
        {
          where: {
            proposal_id: proposal_id,
            bab_title: {
              [Op.like]: `%${bab_title}%`
            }
          }
        }
      );
    } else {
      const newData = json_data.map((data) => ({
        ...data,
        citation: formatCitations(data),
      }));

      updatedProposal = await ProposalDetails.update(
        { json_data: JSON.stringify(newData) },
        {
          where: {
            proposal_id: proposal_id,
            bab_title: {
              [Op.like]: `%${bab_title}%`
            }
          }
        }
      );
    }

    if (updatedProposal[0] === 0) {
      return res.status(404).json({ msg: "Failed to update proposal or proposal not found" });
    }

    return res.status(200).json({ msg: "Proposal updated successfully" });

  } catch (error) {
    console.error("Error updating proposal:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getBabProposalDetail = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const { bab_title } = req.body;
    if (!proposal_id || !bab_title) {
      return res.status(400).json({ msg: "params is empty" });
    }
    const proposals = await ProposalDetails.findAll({
      where: {
        proposal_id: proposal_id,
        bab_title: {
          [Op.like]: `%${bab_title}%`
        }
      }
    });
    if (proposals.length === 0) {
      return res.status(200).json({ msg: "data not found", data: [] });
    }
    return res.status(200).json(proposals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createProposalDetail,
  updateProposalDetail,
  getBabProposalDetail
};
