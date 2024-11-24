require('date-fns/locale');
const ProposalBab = require('../models/proposal-bab');
const Proposals = require('../models/proposals');

const getListProposalBab = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const [data] = await ProposalBab.getListProposalBab(proposal_id);

    if (data.length === 0) {
      return res.json({
        message: 'data not found',
        data: [],
      });
    }
    return res.json({
      message: 'success',
      proposal_id: proposal_id,
      pendahuluan: {
        latar_belakang: data[0].json_data,
        rumusan_masalah: data[1].json_data,
        luaran: data[2].json_data,
        tujuan: data[3].json_data,
        manfaat: data[4].json_data,
      },
      tinjauan: data.slice(5, 6),
      pelaksanaan: data.slice(6, 7),
      biaya: data.slice(-1),
      dapus: [],
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

const updateBabPendahuluan = async (req, res) => {
  let array_bab = [];
  try {
    const { proposal_id } = req.body;
    const [data] = await ProposalBab.getListProposalBab(proposal_id);

    //get data proposal
    data.map((item) => {
      if (item.subbab_title !== '') {
        array_bab.push({
          id: item.id,
          subbab_title: item.subbab_title,
          key_title: item.subbab_title.toLowerCase().replace(' ', '_'),
        });
      }
    });

    // update new params data and convert to Stringify
    array_bab = array_bab.map((item) => {
      if (req.body.hasOwnProperty(item.key_title)) {
        return {
          ...item,
          data: JSON.stringify(req.body[item.key_title]),
        };
      }
      return item;
    });

    console.log(array_bab);
    // update to db
    const updateDB = array_bab.map((item) =>
      ProposalBab.updateBabPendahuluan(item.id, item.data)
    );

    const result = await Promise.all(updateDB);
    const [lastUpdate] = await Proposals.updateLatestProposal(proposal_id);

    // check result all update
    result.map((item) => {
      if (item[0].affectedRows === 0) {
        throw new Error('failed update: ', item[0]);
      }
    });

    return res.status(200).json({
      message: 'success',
      data: result,
      update: lastUpdate.affectedRows,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

module.exports = {
  getListProposalBab,
  updateBabPendahuluan,
};
