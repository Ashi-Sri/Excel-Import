import React from "react";

const FileUpload = ({ onFileUpload }) => {
  return (
    <div className="bg-secondary p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-medium mb-4 text-primary">Upload Your Excel File</h2>
      <input
        type="file"
        onChange={(e) => onFileUpload(e.target.files[0])}
        className="w-full p-4 bg-white border-2 border-gray-300 rounded-lg text-gray-700"
      />
    </div>
  );
};

export default FileUpload;
