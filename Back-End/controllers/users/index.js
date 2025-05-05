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
    if (!uuid) return res.status(400).json({ msg: 'Parameter UUID wajib diisi' });

    const user = await Users.findOne({
      attributes: ['uuid', 'id', 'name', 'email', 'role'],
      where: { uuid: uuid }
    });

    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


const addUsers = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (!password || !confPassword)
    return res.status(400).json({ msg: 'Password tidak boleh kosong'})
  if (password !== confPassword)
    return res.status(400).json({ msg: 'Password tidak sama' });

  try {
    const userExists = await Users.findOne({
      where: {
        [Op.or]: [{ email: email }]
      }
    });

    if (userExists)
      return res.status(409).json({ msg: 'Email sudah terdaftar' });

    const hashPassword = await bcrypt.hash(password, 12);

    await Users.create({
      name,
      email,
      password: hashPassword,
      role
    });

    return res.status(201).json({ msg: 'sukses' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const updateUsers = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { uuid: req.params.uuid } });

    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    const { name, email, password, confPassword, role } = req.body;
    
    // Fix: Correct null-check logic for password
    let hashPassword = user.password; 
    if (password) {
      if (password !== confPassword)
        return res.status(400).json({ msg: 'Password tidak sama' });

    }

    await Users.update(
      { name, email, password: hashPassword, role },
      { where: { id: user.id } }
    );

    return res.status(200).json({ msg: 'Berhasil perbaharui pengguna' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { uuid: req.params.uuid } });

    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    await Users.destroy({ where: { id: user.id }, force: true });

    return res.status(200).json({ msg: 'Berhasil menghapus pengguna' });
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
