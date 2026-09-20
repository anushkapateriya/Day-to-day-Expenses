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
                headers:{
                    Authorization: token                
                }
            }
        );

        console.log(response.data);

        expenseForm.reset();

    } catch (error) {

        console.log(error.response.data.message);

    }
});

async function getExpenses() {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:3000/expenses",
            {
                headers: {
                    Authorization: token
        }
    }
);

        const expenses = response.data.expenses;

        expenseTableBody.innerHTML = "";

        expenses.forEach(function(expense) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.amount}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>
                    <button onclick="deleteExpense(${expense.id})">Delete</button>
                </td>
            `;

            expenseTableBody.appendChild(row);
        });

    } catch (error) {

        console.log(error.response.data.message);

    }
}


getExpenses();


async function deleteExpense(id) {

    try {

        const token = localStorage.getItem("token");

        await axios.delete(`http://localhost:3000/expenses/${id}`,
            {
                headers:{
                    Authorization: token
                }
            }
        );

        getExpenses();

    } catch (error) {

        console.log(error.response.data.message);

    }
}

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

        const leaderboardDiv = document.getElementById("leaderboard");

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