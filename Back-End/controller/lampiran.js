const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const validateFile = (file) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  const fileExtension = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`;
  }

  if (file.size > maxSize) {
    return 'File size exceeds the 5MB limit.';
  }

  return null; // No errors
};

const addFiles = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const { proposals_id: id } = req.params;
  const { data } = req.body;
  const baseUploadPath = path.join(__dirname, '../uploads');
  const uploadFolder = path.join(baseUploadPath, id);

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  const files = req.files.images;
  const filesArray = Array.isArray(files) ? files : [files];

  const uploadPromises = filesArray.map((file) => {
    console.log(data);
    console.log(file);
    const fileName = file.md5.toString() + `_${id}_${file.name}`;
    const url = `/uploads/${id}/${fileName}`;
    const validationError = validateFile(file);
    if (validationError) {
      return res.status(400).send(validationError);
    }
    const uploadPath = path.join(uploadFolder, fileName);

    return file.mv(uploadPath, (err) => {
      if (err) return Promise.reject(err);

      return new Promise((resolve, reject) => {
        const query = `INSERT INTO images (proposals_id, type,filename, url, upload_date) VALUES (?,?, ?,?, NOW())`;
        db.query(query, [id, 'tes', fileName, url], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
  });

  Promise.all(uploadPromises)
    .then(() => {
      res.status(200).json({ message: 'Files uploaded successfully.' });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'Error uploading files: ' + err.message });
    });
};

module.exports = {
  addFiles,
};
