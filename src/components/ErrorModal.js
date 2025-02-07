import React from "react";

const ErrorModal = ({ errors, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4 text-red-600">File Upload Errors</h2>
        <div className="max-h-60 overflow-y-auto">
          {errors.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-red-500">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No errors found.</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
