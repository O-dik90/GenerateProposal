const { MasterDapus } = require("../../models/master-dapus");
const { MasterData } = require("../../models/master-data");
const { Op } = require('sequelize');

const ListData = async (req, res) => {
  const { name } = req.body;
  try { 
    if (!name) {
      return res.status(400).json({ msg: "params is empty" });
    }
    const result = await MasterData.findAll({
      attributes: ['id', 'name', 'init', 'description'],
      where: {
        name: {
          [Op.like]: `${name}%`
        }
      }
    })
    
    if (result.length === 0) {
      return res.status(200).json({ msg: "data not found", data: [] });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const ListDapus = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ msg: "params is empty" });
    }
    const result = await MasterDapus.findAll({
      attributes: ['id', 'category','name', 'init', 'description'],
      where: {
        category: {
          [Op.like]: `${category}%`
        }
      }
    })
    
    if (result.length === 0) {
      return res.status(200).json({ msg: "data not found", data: [] });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ListData,
  ListDapus
};