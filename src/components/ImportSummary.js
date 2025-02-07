import React from "react";

function ImportSummary({ success, skipped }) {
  return (
    <div className="bg-gray-100 p-4 rounded mt-4">
      <h2 className="text-xl font-semibold mb-2">Import Summary</h2>
      <div className="flex justify-between mb-2">
        <span className="font-medium">Successfully Imported:</span>
        <span>{success}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Skipped Rows:</span>
        <span>{skipped}</span>
      </div>
    </div>
  );
}

export default ImportSummary;
