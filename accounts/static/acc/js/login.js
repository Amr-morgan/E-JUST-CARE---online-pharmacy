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
        
        // Add fade-out class for animation
       const loginForm = document.querySelector("#login-form");
        if (loginForm) {
            setTimeout(() => {
                loginForm.submit();
            }, 700);
        }
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