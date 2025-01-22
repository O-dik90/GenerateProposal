require('dotenv').config();

const express = require('express');
const cors = require('cors');
const proposalRoutes = require('./routes/proposal-route');
const masterData = require('./routes/master-data');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    useTempFiles: true, // Use temp files to handle large uploads efficiently
    tempFileDir: '/tmp/',
  })
);

// Serve static files (uploaded images)
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/api-genpro', (req, res) => {
  res.status(200).json({ message: 'Welcome to REST API Genpro' });
});

app.use('/api-genpro', proposalRoutes);
app.use('/api-genpro', masterData);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
