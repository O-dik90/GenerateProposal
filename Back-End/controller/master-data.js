const MasterData = require('../models/masters-data');

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
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
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
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

module.exports = {
  masterDropdown,
  masterDapus,
};
