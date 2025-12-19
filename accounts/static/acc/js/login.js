document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login-btn");
    const container = document.querySelector(".login-container");

    // When clicking the login button
    loginButton.addEventListener("click", function (e) {
        e.preventDefault(); // Stop auto submitting

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Basic validation
        if (username === "" || password === "") {
            showError("Please fill in all fields.");
            return;
        }

        // Fade out animation
        container.classList.add("fade-out");

        // Wait for animation then submit the form
        setTimeout(() => {
            loginForm.submit();
        }, 700); // matches animation duration in CSS
    });

    // Show/Hide password functionality
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    
    togglePassword.addEventListener("click", () => {
        if (password.type === "password") {
            password.type = "text";
            togglePassword.innerText = "hide";
        } else {
            password.type = "password";
            togglePassword.innerText = "show";
        }
    });

    // Function to display error messages
    function showError(msg) {
        const errorBox = document.getElementById("error-msg");
        errorBox.innerText = msg;
        errorBox.style.display = "block";
    }
});