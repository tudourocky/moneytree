import { useState, useEffect } from "react";

export default function FileUpload({
    file,
    setFile,
    isButtonClicked,
    setIsButtonClicked,
}) {
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
        <div className="z-50 flex flex-row w-full h-full">
            <div className="flex w-0.7 h-full">
                <label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                    <div className="w-full h-full">📄 Click or Drag to Upload PDF</div>
                </label>
            </div>

            {file && <p>Selected File: {file.name}</p>}

            <div className="flex w-0.3 h-full">
                <button onClick={handleUpload}>Upload</button>
            </div>
        </div>
    );
}
