require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const xlsx = require("xlsx");
const moment = require("moment");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload & Parse Excel
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheetsData = workbook.SheetNames.map((sheet) => ({
    sheetName: sheet,
    data: xlsx.utils.sheet_to_json(workbook.Sheets[sheet]),
  }));

  res.json({ sheets: sheetsData });
});

// Import Data with Validation
app.post("/import", (req, res) => {
  const { sheetName, data } = req.body;
  if (!sheetName || !data.length) {
    return res.status(400).json({ success: false, errors: ["Invalid data"] });
  }

  let importedRows = 0;
  let skippedRows = [];
  const currentMonth = moment().format("MM-YYYY");

  const validatedData = data.map((row, index) => {
    const errors = [];

    if (!row.Name) errors.push("Missing Name");
    if (!row.Amount || isNaN(row.Amount) || Number(row.Amount) <= 0) errors.push("Invalid Amount");
    if (!row.Date || !moment(row.Date, "DD-MM-YYYY", true).isValid()) {
      errors.push("Invalid Date format (Expected: DD-MM-YYYY)");
    } else {
      const rowMonth = moment(row.Date, "DD-MM-YYYY").format("MM-YYYY");
      if (rowMonth !== currentMonth) errors.push("Date is not in the current month");
    }

    if (errors.length > 0) {
      skippedRows.push({ rowNumber: index + 1, errors });
      return null;
    } else {
      importedRows++;
      return row;
    }
  });

  if (importedRows === 0) {
    return res.status(400).json({ success: false, errors: ["All rows have errors and were skipped."] });
  }

  res.json({
    success: true,
    summary: { imported: importedRows, skipped: skippedRows.length },
    skippedRows,
  });
});

app.listen(5000, () => console.log(`Server running on port 5000`));
