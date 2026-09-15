if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.getElementById("expenseTableBody");

expenseForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const expense = {
        amount: amount,
        description: description,
        category: category
    };

    try {

        const response = await axios.post(
            "http://localhost:3000/expenses",
            expense
        );

        console.log(response.data);

        expenseForm.reset();

    } catch (error) {

        console.log(error.response.data.message);

    }
});

async function getExpenses() {

    try {

        const response = await axios.get(
            "http://localhost:3000/expenses"
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

        await axios.delete(`http://localhost:3000/expenses/${id}`);

        getExpenses();

    } catch (error) {

        console.log(error.response.data.message);

    }
}