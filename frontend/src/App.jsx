import { useState } from 'react'
import './App.css'
import FileUpload from "./FileUpload.jsx"

function App() {
    return (
        <FileUpload/>
    );
}


export default App;

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
      <div className="vertical-line"></div>
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