const printDataTable = () => {
  // Custom print logic when Ctrl+P is pressed
  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey && event.key === "p") || (event.ctrlKey && event.key === "P")) {
      console.log("Custom Ctrl+P Print Triggered");
      event.preventDefault(); // Prevent the default print dialog
      customPrintLogic(); // Call the custom print logic
    }
  });

  // Handle browser's default print action
  window.addEventListener("beforeprint", function () {
    console.log("Browser Print Triggered");
    customPrintLogic(); // Call the custom print logic
  });

  // Custom print logic
  function customPrintLogic() {
    // Get the data from the DataTable
    const table = document.querySelector(".tss-1cdcmys-MUIDataTable-responsiveBase");
    if (!table) {
      console.error("DataTable not found!");
      return;
    }

    // Create a printable version of the table
    const printableContent = `
      <html>
      <head>
        <title>Print DataTable</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        ${table.outerHTML}
      </body>
      </html>
    `;

    // Open a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printableContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }
};

export default printDataTable;
