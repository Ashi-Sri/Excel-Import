import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ErrorModal from "./components/ErrorModal";
import DataTable from "./components/DataTable";
import TabbedErrors from "./components/TabbedErrors"; // Added TabbedErrors import
import ImportSummary from "./components/ImportSummary"; // Added ImportSummary import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { formatDate, formatNumber } from "./helpers"; // Import formatting helpers

function App() {
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [importSummary, setImportSummary] = useState({ success: 0, skipped: 0 });

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.sheets) {
        setSheets(response.data.sheets);
        toast.success("File uploaded successfully! Select a sheet to proceed.");
      } else {
        setErrors(response.data.errors || ["File validation failed."]);
        setShowModal(true);
        toast.error("File validation failed.");
      }
    } catch (error) {
      setErrors(["Error uploading file."]);
      setShowModal(true);
      toast.error("Error uploading file.");
    }
  };

  const handleSheetSelect = (sheetName) => {
    setSelectedSheet(sheetName);
    const selectedData = sheets.find((sheet) => sheet.sheetName === sheetName)?.data || [];
    setData(selectedData);
  };

  const handleImportData = async () => {
    if (!selectedSheet) {
      toast.error("Please select a sheet first.");
      return;
    }

    let successCount = 0;
    let skippedCount = 0;

    try {
      const filteredData = data.filter((row) => !row.error); // Skip rows with errors

      // Simulate import and count success/skipped rows
      filteredData.forEach((row) => {
        if (row.name && row.amount > 0 && new Date(row.date).getMonth() === new Date().getMonth()) {
          successCount++;
        } else {
          skippedCount++;
        }
      });

      setImportSummary({ success: successCount, skipped: skippedCount });

      toast.success(`Imported: ${successCount}, Skipped: ${skippedCount}`);
    } catch (error) {
      setErrors(["Failed to import data."]);
      setShowModal(true);
      toast.error("Failed to import data.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Excel Data Importer</h1>
      
      <FileUpload onFileUpload={handleFileUpload} />

      {sheets.length > 0 && (
        <select
          className="border-2 border-gray-300 p-3 rounded-md mb-6 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedSheet}
          onChange={(e) => handleSheetSelect(e.target.value)}
        >
          <option value="">Select a Sheet</option>
          {sheets.map((sheet, index) => (
            <option key={index} value={sheet.sheetName}>
              {sheet.sheetName}
            </option>
          ))}
        </select>
      )}

      {selectedSheet && <DataTable data={data} setData={setData} />}

      {selectedSheet && (
        <button
          onClick={handleImportData}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg w-full mt-4 hover:bg-purple-600 transition duration-300"
        >
          Import Data
        </button>
      )}

      {showModal && <ErrorModal errors={errors} onClose={() => setShowModal(false)} />}
      
      {selectedSheet && <ImportSummary success={importSummary.success} skipped={importSummary.skipped} />}

      {errors.length > 0 && (
        <TabbedErrors tabs={sheets.map(sheet => sheet.sheetName)} errors={errors} />
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
