import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // To navigate to the chart page

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      console.log("File uploaded:", file.name);
      navigate("/charts"); // Navigate to the chart page after upload
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload Your Bank Statement or Receipt</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf, .csv, .jpg, .png" />
      <br />
      <button onClick={handleUpload} style={{ marginTop: "10px", padding: "10px" }}>
        Upload & View Charts
      </button>
    </div>
  );
};

export default FileUpload;