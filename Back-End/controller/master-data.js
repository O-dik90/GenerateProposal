const MasterData = require('../models/master-data');

const getMaster = async (req, res) => {
  try {
    const [data] = await MasterData.getMaster();
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: 'Data not found',
        data: [],
      });
    }
    return res.status(200).json({
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

const masterDropdown = async (req, res) => {
  const { source_name: sourceName } = req.body;
  if (!sourceName) {
    return res.status(400).json({
      message: 'Bad Request: source_name is required',
      data: [],
    });
  }
  try {
    const [data] = await MasterData.getMasterSourceName(sourceName);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: 'Data not found',
        data: [],
      });
    }

    return res.status(200).json({
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

const masterDapus = async (req, res) => {
  const { category } = req.body;
  if (!category) {
    return res.status(400).json({
      message: 'Bad Request: source_name is required',
      data: [],
    });
  }
  try {
    const [data] = await MasterData.getMasterDapus(category);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: 'Data not found',
        data: [],
      });
    }
    return res.status(200).json({
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

module.exports = {
  getMaster,
  masterDropdown,
  masterDapus,
};
