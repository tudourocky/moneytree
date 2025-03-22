import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const FileUpload = () => {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
      setFile(null);
    }
  };

  // Handle file upload (example: console logging)
  const handleUpload = () => {
    if (file) {
      console.log("File uploaded:", file);
      alert(`Uploaded: ${file.name}`);
    } else {
      alert("No file selected!");
    }
  };

  return (
    <div className="file-upload-box">
      <label className="file-input-label">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <div className="upload-box">📄 Click or Drag to Upload PDF</div>
      </label>
      
      {file && <p>Selected File: {file.name}</p>}

      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
