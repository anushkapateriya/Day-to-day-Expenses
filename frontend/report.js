const reportTableBody =
    document.getElementById("reportTableBody");

const reportType =
    document.getElementById("reportType");

const downloadButton =
    document.getElementById("downloadButton");


// Sample report data

const reportData = [];


// Show current date

document.getElementById("currentDate").innerText =
    new Date().toLocaleDateString();


// Display report

function displayReport(data) {

    reportTableBody.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach(function(item) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td>₹${item.income}</td>
            <td>₹${item.expense}</td>
        `;

        reportTableBody.appendChild(row);

        totalIncome += item.income;
        totalExpense += item.expense;

    });


    document.getElementById("totalIncome").innerText =
        "₹" + totalIncome;

    document.getElementById("totalExpense").innerText =
        "₹" + totalExpense;

    document.getElementById("savings").innerText =
        "₹" + (totalIncome - totalExpense);
}


// Daily / Weekly / Monthly

reportType.addEventListener("change", function() {

    const selectedType = reportType.value;

    if (selectedType === "daily") {

        displayReport(reportData);

    }

    else if (selectedType === "weekly") {

        displayReport(reportData);

    }

    else if (selectedType === "monthly") {

        displayReport(reportData);

    }

});


// Initial report

displayReport(reportData);


// Premium check

const isPremium =
    localStorage.getItem("isPremium");

if (isPremium !== "true") {

    downloadButton.disabled = true;

    document.getElementById("message").innerText =
        "Download report is available only for premium users.";

}


// Download report

downloadButton.addEventListener("click", function() {

    if (localStorage.getItem("isPremium") !== "true") {
        return;
    }

    let csv = "Date,Description,Category,Income,Expense\n";

    reportData.forEach(function(item) {

        csv += `${item.date},${item.description},${item.category},${item.income},${item.expense}\n`;

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "expense-report.csv";

    link.click();

    URL.revokeObjectURL(url);

});