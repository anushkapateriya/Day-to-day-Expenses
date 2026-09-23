if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

const isPremium = localStorage.getItem("isPremium");

if (isPremium === "true") {
    document.getElementById("premiumMessage").innerText =
        "You are a premium user now";
}

const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.getElementById("expenseTableBody");

let currentPage = 1;

const limitSelect = document.getElementById("limitSelect");

let limit = Number(localStorage.getItem("expenseLimit")) || 10;

limitSelect.value = limit;

limitSelect.addEventListener("change", function() {
    limit = Number(this.value);

    localStorage.setItem("expenseLimit", limit);

    currentPage = 1;

    getExpenses();
});

expenseForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;

    const expense = {
        amount: amount,
        description: description
    };

    try {

        const token = localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:3000/expenses",
            expense,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        console.log(response.data);

        expenseForm.reset();

        currentPage = 1;

        getExpenses();

    } catch (error) {

        console.log(error.response.data.message);

    }
});

// GET EXPENSES WITH PAGINATION

async function getExpenses() {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://localhost:3000/expenses?page=${currentPage}&limit=${limit}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const expenses = response.data.expenses;
        let totalPages = response.data.totalPages;

        if (totalPages === 0) {
            totalPages = 1;
        }

        if (currentPage > totalPages) {
            currentPage = totalPages;
            await getExpenses();
            return;
        }

        expenseTableBody.innerHTML = "";

        expenses.forEach(function(expense) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.amount}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>
                    <button onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>
                </td>
            `;

            expenseTableBody.appendChild(row);
        });

        document.getElementById("pageNumber").innerText =
            `Page ${currentPage} of ${totalPages}`;

        document.getElementById("previousButton").disabled =
            currentPage === 1;

        document.getElementById("nextButton").disabled =
            currentPage === totalPages;

    } catch (error) {

        console.log(error.response.data.message);

    }
}

// NEXT PAGE

document.getElementById("nextButton")
    .addEventListener("click", function() {

        currentPage++;

        getExpenses();

    });

// PREVIOUS PAGE

document.getElementById("previousButton")
    .addEventListener("click", function() {

        currentPage--;

        getExpenses();

    });


getExpenses();


// DELETE EXPENSE

async function deleteExpense(id) {

    try {

        const token = localStorage.getItem("token");

        await axios.delete(
            `http://localhost:3000/expenses/${id}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        getExpenses();

    } catch (error) {

        console.log(error.response.data.message);

    }
}


// PREMIUM MEMBERSHIP

const premiumButton = document.getElementById("premiumButton");

const cashfree = Cashfree({
    mode: "sandbox"
});

premiumButton.addEventListener("click", async function() {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:3000/create-order",
            {},
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const paymentSessionId = response.data.paymentSessionId;

        const result = await cashfree.checkout({
            paymentSessionId: paymentSessionId,
            redirectTarget: "_self"
        });

        console.log(result);

    } catch (error) {

        console.log(error);

    }
});


// VERIFY PAYMENT

const urlParams = new URLSearchParams(window.location.search);

const orderId = urlParams.get("order_id");

if (orderId) {

    verifyPayment(orderId);

}

async function verifyPayment(orderId) {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://localhost:3000/verify-payment?order_id=${orderId}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        if (response.data.message === "Transaction successful") {

            localStorage.setItem("isPremium", "true");

        }

        alert(response.data.message);
        alert(response.data.message);

    } catch (error) {

        console.log(error);

    }
}


// =========================
// LEADERBOARD
// =========================

const leaderboardButton = document.getElementById("leaderboardButton");

leaderboardButton.addEventListener("click", async function() {

    const isPremium = localStorage.getItem("isPremium");

    if (isPremium !== "true") {

        alert("Only premium users can access the leaderboard");

        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:3000/premium/showleaderboard",
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const leaderboard = response.data.leaderboard;

        const leaderboardDiv =
            document.getElementById("leaderboard");

        leaderboardDiv.innerHTML = "";

        leaderboard.forEach(function(user) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.name}</td>
                <td>₹${user.totalExpense}</td>
            `;

            leaderboardDiv.appendChild(row);

        });

    } catch (error) {

        console.log(error.response.data.message);

    }
});


// =========================
// REPORT
// =========================

document.getElementById("reportButton")
    .addEventListener("click", function() {

        window.location.href = "report.html";

    });
