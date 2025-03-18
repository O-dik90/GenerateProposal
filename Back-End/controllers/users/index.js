const { Users } = require("../../models/users");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['uuid', 'id', 'name', 'email', 'role']
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const {uuid} = req.params;
    console.log(uuid)
    if (!uuid) return res.status(400).json({ msg: 'Params UUID is required' });

    const user = await Users.findOne({
      attributes: ['uuid', 'id', 'name', 'email', 'role'],
      where: { uuid: uuid }
    });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


const addUsers = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (!password || !confPassword)
    return res.status(400).json({ msg: 'Passwords cant empty'})
  if (password !== confPassword)
    return res.status(400).json({ msg: 'Passwords do not match' });

  try {
    const userExists = await Users.findOne({
      where: {
        [Op.or]: [{ email: email }]
      }
    });

    if (userExists)
      return res.status(409).json({ msg: 'Email already exists' });

    const hashPassword = await bcrypt.hash(password, 12);

    await Users.create({
      name,
      email,
      password: hashPassword,
      role
    });

    return res.status(201).json({ msg: 'success' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const updateUsers = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { uuid: req.params.uuid } });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const { name, email, password, confPassword, role } = req.body;
    
    // Fix: Correct null-check logic for password
    let hashPassword = user.password; 
    if (password) {
      if (password !== confPassword)
        return res.status(400).json({ msg: 'Passwords do not match' });

    }

    await Users.update(
      { name, email, password: hashPassword, role },
      { where: { id: user.id } }
    );

    return res.status(200).json({ msg: 'User updated successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { uuid: req.params.uuid } });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    await Users.destroy({ where: { id: user.id }, force: true });

    return res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  addUsers,
  updateUsers,
  deleteUsers
};
