const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await axios.post("http://localhost:3000/login", {
            email: email,
            password: password
        });

        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "expense.html";

    } catch (error) {

        document.getElementById("message").innerText = error.response.data.message;

    }
});