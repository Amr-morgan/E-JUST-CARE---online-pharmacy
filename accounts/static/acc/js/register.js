
// 1. Show / Hide Password , confirm password
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const confirm = document.getElementById("confirmPassword");
const toggleConfirm = document.getElementById("toggleConfirm");

// Show/Hide password functionality
togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.innerText = "Hide";
    } else {
        password.type = "password";
        togglePassword.innerText = "Show";
    }
});
// Show/Hide confirm password functionality
toggleConfirm.addEventListener("click", () => {
    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        toggleConfirm.innerText = "Hide";
    } else {
        confirmPassword.type = "password";
        toggleConfirm.innerText = "Show";
    }
});

// 2. Password Strength Checker
const passwordStrength = document.getElementById("passwordStrength");

password.addEventListener("input", () => {
    const value = password.value;

    if (value.length === 0) {
        passwordStrength.textContent = "";
        return;
    }

    let strength = "";
    if (value.length < 6) {
        strength = "Weak (minimum 6 characters)";
        passwordStrength.style.color = "red";
    } 
    else if (
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[\W_]/.test(value)
    ) {
        strength = "Strong password ✔";
        passwordStrength.style.color = "green";
    }
    else {
        strength = "Medium strength";
        passwordStrength.style.color = "orange";
    }

    passwordStrength.textContent = strength;
});

// 3. Password Match Checker
const confirmPassword = document.getElementById("confirmPassword");
const passwordMatch = document.getElementById("passwordMatch");

confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value.length === 0) {
        passwordMatch.textContent = "";
        return;
    }

    if (confirm.value === password.value) {
        passwordMatch.textContent = "Passwords match ✔";
        passwordMatch.style.color = "green";
    } else {
        passwordMatch.textContent = "Passwords do not match ✘";
        passwordMatch.style.color = "red";
    }
});

// 4. Email Format Validation
const email = document.getElementById("email");
const emailInfo = document.getElementById("emailInfo");

if (email && emailInfo){
    email.addEventListener("input", () => {
    const value = email.value;

    if (value.length === 0) {
        emailInfo.textContent = "";
        return;
    }
    // Simple email regex pattern
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(value)) {
        emailInfo.textContent = "Valid email ✔";
        emailInfo.style.color = "green";
    } else {
        emailInfo.textContent = "Invalid email format ✘";
        emailInfo.style.color = "red";
    }
    });
}
// 5. Fade-out animation when clicking Login
const loginLink = document.querySelector(".login-link a");

loginLink.addEventListener("click", function(event) {
    event.preventDefault(); // stop immediate redirect
    document.body.classList.add("fade-out"); // add fade-out class

    // Wait for animation to finish then redirect
    setTimeout(() => {
        window.location.href = loginLink.href;
    }, 500); // 500ms matches the CSS transition
});
