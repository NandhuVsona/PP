const excelJs = require("exceljs");

exports.generateReport = async (data, res) => {
  try {
    const workBook = new excelJs.Workbook();
    const workSheet = workBook.addWorksheet("Sheet");

    // Add column headers
    workSheet.columns = [
      { header: "TIME", key: "time", width: 20 },
      { header: "TYPE", key: "type", width: 10 },
      { header: "AMOUNT", key: "amount", width: 10 },
      { header: "ACCOUNT", key: "account", width: 15 },
      { header: "CATEGORY", key: "category", width: 15 },
      { header: "NOTES", key: "notes", width: 30 },
    ];

    data.forEach((doc) => {
      workSheet.addRow({
        time: doc.date,
        type:
          doc.type == "expense"
            ? "(-)" + doc.type
            : doc.type == "income"
            ? "(+)" + doc.type
            : doc.type,
        amount: doc.amount,
        category: doc.categoryInfo?.name || "transfer",
        account: doc.accountInfo.accountName,
        notes: doc.description,
      });
    });

    // Set response headers for download
    res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write the workbook to the response
    await workBook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error generating Excel file:", err);
    res.status(500).send("Error generating Excel file");
  }
};
