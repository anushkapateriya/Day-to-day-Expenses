const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await axios.post("http://localhost:3000/signup", {
            name: name,
            email: email,
            password: password
        });

        console.log(response.data);

    } catch (error) {
        console.log("Error:", error);
    }
});

