const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    try {

        const response = await axios.post(
            "http://localhost:3000/password/forgotpassword",
            {
                email: email
            }
        );

        document.getElementById("message").innerText =
            response.data.message;

    } catch (error) {

        document.getElementById("message").innerText =
            error.response.data.message;
    }
});