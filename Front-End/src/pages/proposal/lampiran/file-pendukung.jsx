import React, { useState } from 'react';
// import axios from 'axios';

const FilePendukung = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type));

    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were not JPEG, JPG, or PNG and were skipped.');
    } else {
      setError('');
    }

    // Add the valid files to the state
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('No files to upload.');
      return;
    }

    setError('');

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      // const response = await axios.post('https://your-api-endpoint/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      alert('Files uploaded successfully!');
      console.log(response.data);
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h2>Multi-File Upload with Preview</h2>
      <input type="file" accept="image/jpeg,image/png,image/jpg" multiple onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              margin: '10px',
              textAlign: 'center',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '10px',
              width: '150px'
            }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '10px' }}
            />
            <p style={{ fontSize: '12px' }}>{file.name}</p>
            <button onClick={() => handleRemoveFile(index)}>Remove</button>
          </div>
        ))}
      </div>

      <button onClick={handleUpload} style={{ marginTop: '20px', padding: '10px 20px', background: 'blue', color: 'white' }}>
        Upload Files
      </button>
    </div>
  );
};

export { FilePendukung };
