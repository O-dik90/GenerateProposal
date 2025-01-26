require('date-fns/locale');

const ProposalBab = require('../models/proposal-bab');
const Proposals = require('../models/proposals');
const Lampiran = require('../models/lampiran');

const getListProposalBab = async (req, res) => {
  try {
    const { proposals_id } = req.params;
    const [data] = await ProposalBab.getListProposalBab(proposals_id);
    const [fileDoc] = await Lampiran.getListImage(proposals_id);

    if (data.length === 0) {
      return res.json({
        message: 'data not found',
        data: [],
      });
    }

    return res.json({
      message: 'success',
      proposals_id: proposals_id,
      pendahuluan: {
        latar_belakang: data[0].json_data ?? '',
        rumusan_masalah: JSON.parse(data[1].json_data ?? null),
        luaran: JSON.parse(data[2].json_data ?? null),
        tujuan: JSON.parse(data[3].json_data ?? null),
        manfaat: JSON.parse(data[4].json_data ?? null),
      },
      tinjauan: JSON.parse(data.slice(5, 6)[0]?.json_data || null),
      pelaksanaan: JSON.parse(data.slice(6, 7)[0]?.json_data || null),
      biaya: JSON.parse(data.slice(7, 8)[0]?.json_data || null),
      dapus: JSON.parse(data.slice(8, 9)[0]?.json_data || null),
      lampiran: JSON.parse(data.slice(-1)[0]?.json_data || null),
      document: fileDoc[0] || null,
      metadata: JSON.stringify(data),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
    });
  }
};

const getDetailBab = async (req, res) => {
  try {
    const { id, proposals_id } = req.body;
    const [data] = await ProposalBab.getDetailProposalBab(id, proposals_id);

    console.log(data);
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
    return res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
    });
  }
};

const updateBabPendahuluan = async (req, res) => {
  let array_bab = [];
  try {
    const { proposals_id } = req.body;
    const [data] = await ProposalBab.getListProposalBab(proposals_id);

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
          data:
            item.key_title === 'latar_belakang'
              ? req.body[item.key_title]
              : JSON.stringify(req.body[item.key_title]),
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
    const [lastUpdate] = await Proposals.updateLatestProposal(proposals_id);

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
    return res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
    });
  }
};

const updateBab = async (req, res) => {
  try {
    const params = req.body;
    console.log(params);

    if (params === undefined) {
      throw new Error('proposal id not found or data undefined');
    }
    const [updateData] = await ProposalBab.updateBab(
      params?.id,
      JSON.stringify(params?.json_data)
    );

    if (updateData.length === 0) {
      return res.json({
        message: 'error update data',
      });
    }
    const [detail] = await ProposalBab.getDetailProposalBab(
      params?.id,
      params?.proposals_id
    );
    if (updateData.affectedRows > 0) {
      await Proposals.updateLatestProposal(params?.proposals_id);

      if (detail.length === 0) {
        return res.json({
          message: 'data not found',
          data: [],
        });
      }
    }

    return res.status(200).json({
      message: 'success',
      data: detail,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
    });
  }
};

module.exports = {
  getListProposalBab,
  updateBabPendahuluan,
  updateBab,
  getDetailBab,
};
