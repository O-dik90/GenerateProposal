const fs = require('fs');
const path = require('path');
const {
  addImage,
  getListImage,
  updateImage,
  deleteImage,
} = require('../models/lampiran');

const validateFile = (file) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  const fileExtension = path.extname(file.name).toLowerCase();

  // Validate file type
  if (!allowedExtensions.includes(fileExtension)) {
    return `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`;
  }

  // Validate file size
  if (file.size > maxSize) {
    return 'File size exceeds the 5MB limit.';
  }

  return null; // No validation errors
};

const moveFile = (file, uploadPath) => {
  return new Promise((resolve, reject) => {
    file.mv(`./public/${uploadPath}`, (err) => {
      if (err) {
        return reject('Failed to move the file: ' + err.message);
      }
      resolve();
    });
  });
};

// Add Files
const addFiles = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    if (!req.body.data) {
      return res.status(400).json({ message: 'Data is required' });
    }

    const { data } = req.body;
    const proposals_id = JSON.parse(data)?.proposals_id;
    const title = JSON.parse(data)?.title;

    if (!proposals_id) {
      return res.status(400).json({ message: 'Proposal ID is required' });
    }

    const baseUploadPath = path.join(__dirname, './public');
    const uploadFolder = path.join(baseUploadPath, proposals_id.toString());

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Loop through all files
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const fileName = `${file.md5}_${proposals_id}_${file.name}`;
      const uploadPath = `${proposals_id}/${fileName}`;
      const url = `${req.protocol}://${req.get('host')}/public/${uploadPath}`;

      try {
        // Move file to the designated folder
        await moveFile(file, uploadPath);

        // Save file information to the database
        await addImage([proposals_id, title, fileName, url]);
      } catch (err) {
        return res.status(500).json({ message: 'Error saving file: ' + err });
      }
    }

    res.status(200).json({ message: 'Files uploaded successfully.' });
  } catch (err) {
    console.error('Error uploading files:', err);
    res.status(500).json({ message: 'Error uploading files: ' + err.message });
  }
};

// Get Files
const getFiles = async (req, res) => {
  try {
    const { proposals_id: id } = req.params;
    const { title } = req.body;
    const [data] = await getListImage(id, title ?? null);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: 'Data not found',
        data: [],
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error retrieving images: ' + err.message });
  }
};

// Update File
const updateFile = async (req, res) => {
  try {
    const { data } = req.body;
    const file = req.files?.images;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const proposals_id = JSON.parse(data)?.proposals_id;
    const image_id = JSON.parse(data)?.image_id;
    const fileName = `${file.md5}_${proposals_id}_${file.name}`;
    const baseUploadPath = path.join(__dirname, '../public');
    const uploadFolder = path.join(baseUploadPath, proposals_id.toString());
    const uploadPath = `public/${proposals_id}/${fileName}`;

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    // Move the new file
    await moveFile(file, uploadPath);

    // Update file in the database
    const result = await updateImage([fileName, uploadPath, image_id]);

    if (!result) {
      return res.status(404).json({ message: 'File not found for update.' });
    }

    res.status(200).json({ message: 'File updated successfully.' });
  } catch (err) {
    console.error('Error updating file:', err);
    res.status(500).json({ message: 'Error updating file: ' + err.message });
  }
};

// Delete File
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    const [data] = await deleteImage(id);
    if (data.affectedRows === 0) {
      throw new Error('Proposal not found');
    }
    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ message: 'Error deleting file: ' + err.message });
  }
};

module.exports = {
  addFiles,
  getFiles,
  updateFile,
  deleteFile,
};
