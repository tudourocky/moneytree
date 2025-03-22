import { useState } from 'react'
import './App.css'
import Chart from "./Chart";
import Chatbox from "./Chatbox";


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
    

    <div className="container">
      <div className="vertical-line"></div> {/* Vertical Line */}
      
    

    <div className="chart-container">
      <h3 className="chart-title">Expense Breakdown</h3> {/* Title */}
      <Chart /> {/* The Pie Chart Component */}



    <div className="file-upload-box">
      <label className="file-input-label">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <div className="upload-box">📄 Click or Drag to Upload PDF</div>
      </label>
      
      {file && <p>Selected File: {file.name}</p>}

      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
    </div></div>

    <div className="app">
      <Chatbox />
      </div>

    </div>
  );
};



export default FileUpload;
