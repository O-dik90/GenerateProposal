const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { ProposalAttachs } = require('../../models/proposal-detail/proposal_attach');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const proposalId = req.params.proposal_id || req.body.proposal_id;

      if (!proposalId) {
        return cb(new Error('Proposal ID tidak ditemukan'));
      }

      const uploadPath = path.join(__dirname, "../../public/", proposalId);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const proposalId = req.params.proposal_id || req.body.proposal_id;

      if (!proposalId) {
        return cb(new Error('Proposal ID tidak ditemukan'));
      }

      const formattedDate = Date.now();
      cb(null, `file_${proposalId}_${formattedDate}${path.extname(file.originalname)}`);
    } catch (error) {
      cb(error, null);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
}).single('file');

const filesAdd = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ditemukan file terunggah' });
    }

    if (!req.body.data) {
      return res.status(400).json({ success: false, message: 'Data tidak tersedia' });
    }

    const body = JSON.parse(req.body.data);
    if (!body.proposal_id) {
      return res.status(400).json({ success: false, message: 'Proposal ID tidak ditemukan' });
    }

    const file = await ProposalAttachs.create({
      file_name: req.file.filename,
      file_path: `/${body.proposal_id}/${req.file.filename}`,
      file_type: body.type,
      file_size: req.file.size,
      mimetype: req.file.mimetype,
      proposal_id: body.proposal_id,
      title: req.file.originalname,
    });

    return res.status(201).json({ success: true, message: 'Berhasil mengunggah file', data:file });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return res.status(500).json({ success: false, message: 'Gagal mengunggah file', error: error.message });
  }
};

const filesGet = async (req, res) => {
  const proposals_id = req.params.proposal_id || req.body.proposal_id
  try {
    const files = await ProposalAttachs.findAll({
      where: {
        proposal_id: proposals_id,
        file_type: {
          [Op.like]: `%${req.body.type}%`
        }
      },
    });

    if (!files || files.length === 0) {
      return res.status(200).json({ success: false, message: 'File tidak ditemukan' });
    }

    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return res.status(500).json({ success: false, message: 'Kesalahan mengambil file', error: error.message });
  }
};

const filesDelete = async (req, res) => {
  try {
    const id = req.params.item_id;

    const fileToDelete = await ProposalAttachs.findByPk(id);
    if (!fileToDelete) {
      return res.status(404).json({ success: false, message: 'File tidak ditemukan' });
    }

    await ProposalAttachs.destroy({ where: { id } });

    if (fs.existsSync(fileToDelete.file_path)) {
      fs.unlinkSync(fileToDelete.file_path);
    }

    return res.status(200).json({ success: true, message: 'Berhasil menghapus dile' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus file', error: error.message });
  }
};

const filesUpdate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
    }
    if (!req.body.data) {
      return res.status(400).json({ success: false, message: 'Data tidak tersedia' });
    }

    const body = JSON.parse(req.body.data);
    if (!body.proposal_id) {
      return res.status(400).json({ success: false, message: 'Proposal ID dan File ID wajib diisi' });
    }

    const existingFile = await ProposalAttachs.findByPk(body.id);
    if (!existingFile) {
      return res.status(404).json({ success: false, message: 'File tidak ditemukan' });
    }

    const updatedFile = {
      file_name: req.file.filename,
      file_path: req.file.path,
      file_type: body.type,
      file_size: req.file.size,
      mimetype: req.file.mimetype,
      proposal_id: Number(body.proposal_id),
      title: req.file.originalname
    };

    await ProposalAttachs.update(updatedFile, { where: { id: body.id } });

    return res.status(200).json({ success: true, message: 'File berhasil diupdate', file: updatedFile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'File gagal diupdate', error: error.message });
  }
};

const fileDownloadAsBase64 = async (req, res) => {
  try {
    const id = req.params.item_id;
    const file = await ProposalAttachs.findByPk(id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File tidak ditemukan' });
    }

    const filePath = path.join(__dirname, "../../public", file.file_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File tidak ditemukan on server' });
    }

    const fileData = fs.readFileSync(filePath, { encoding: 'base64' });
    return res.status(200).json({
      success: true,
      file_name: file.file_name,
      base64: fileData,
      mimetype: file.mimetype
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengunduh file', error: error.message });
  }
};

module.exports = {
  upload,
  filesAdd,
  filesGet,
  filesDelete,
  filesUpdate,
  fileDownloadAsBase64
};
