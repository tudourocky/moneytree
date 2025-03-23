import { useState, useEffect } from "react";

export default function FileUpload({file, setFile, isButtonClicked, setIsButtonClicked}) {

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
            setIsButtonClicked(1);
            console.log("File uploaded:", file);
            alert(`Uploaded: ${file.name}`);
        } else {
            alert("No file selected!");
        }
    };

    return (
        <div className="">
            <label className="">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                <div className="upload-box">📄 Click or Drag to Upload PDF</div>
            </label>

            {file && <p>Selected File: {file.name}</p>}

            <button onClick={handleUpload} className="upload-button">
                Upload
            </button>
        </div>
    );
}
