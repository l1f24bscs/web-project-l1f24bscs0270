// A local DOM exercise: validate the enquiry and update text on the page.
// No fetch, storage or external submission is used.
"use strict";

const form = document.querySelector("#enquiry-form");
const nameField = document.querySelector("#contactt-email");
const serviceField = document.querySelector("#contact-service");
const messageField = document.querySelector("#contact-message");
const counter = document.querySelector("#message-cou-name");
const emailField = document.querySelector("#contacnt");
const statusMessage = document.querySelector("#form-status");
const fields = [nameField, emailField, serviceField, messageField];
const touchedFields = new Set();

function validateField(field) {
    const value = field.value.trim();
    let error = "";

    if (field === nameField && value.length < 2) {
        error = "Enter your name using at least 2 characters.";
    } else if (field === emailField && (!value || field.validity.typeMismatch)) {
        error = "Enter a valid email address, such as you@example.com.";
    } else if (field === serviceField && !value) {
        error = "Choose an experience to continue.";
    } else if (field === messageField && value.length < 20) {
        error = "Describe your travel idea in at least 20 characters (excluding outer spaces).";
    } else if (field.maxLength > 0 && value.length > field.maxLength) {
        error = "Please keep your entry within " + field.maxLength + " characters.";
    }

    const errorId = field.id.replace("contact-", "") + "-error";
    document.getElementById(errorId).textContent = error;
    field.setAttribute("aria-invalid", error ? "true" : "false");
    return error === "";
}

function clearStatus() {
    statusMessage.textContent = "";
    delete statusMessage.dataset.state;
}

fields.forEach(function (field) {
    field.addEventListener("blur", function () {
        touchedFields.add(field);
        validateField(field);
    });
    field.addEventListener("input", function () {
        clearStatus();
        counter.textContent = messageField.value.length + " / 1000";
        if (touchedFields.has(field)) validateField(field);
    });
    field.addEventListener("change", function () {
        clearStatus();
        touchedFields.add(field);
        validateField(field);
    });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    let firstInvalid = null;

    fields.forEach(function (field) {
        touchedFields.add(field);
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
        statusMessage.dataset.state = "error";
        statusMessage.textContent = "Please correct the highlighted fields, then check your enquiry again.";
        firstInvalid.focus();
        return;
    }

    statusMessage.dataset.state = "success";
    statusMessage.textContent = "Your enquiry passes the form checks. This is a demonstration: nothing has been sent or saved.";
});

form.addEventListener("reset", function () {
    touchedFields.clear();
    fields.forEach(function (field) {
        field.removeAttribute("aria-invalid");
        const errorId = field.id.replace("contact-", "") + "-error";
        document.getElementById(errorId).textContent = "";
    });
    counter.textContent = "0 / 1000";
    clearStatus();
});

// Use accessible inline errors once the script is ready. Without JavaScript,
// the disabled submit button prevents a misleading or accidental submission.
form.noValidate = true;
document.querySelector("#check-enquiry").disabled = false;


// Contact-only theme exercise: create the button and reuse Bootstrap utilities.
// No extra stylesheet, inline styles or saved preference is needed.
const themeButton = document.createElement("button");
themeButton.type = "button";
themeButton.className = "btn btn-outline-warning btn-sm rounded-pill px-3 text-nowrap";
themeButton.id = "theme-toggle";
themeButton.textContent = "Dark mode";
themeButton.setAttribute("aria-label", "Switch to dark mode");
document.querySelector("header > .container").append(themeButton);

// Keep room for the toggle while retaining the same header design.
const portalActions = document.querySelector(".header-actions");
portalActions.classList.replace("d-xl-block", "d-xxl-block");

// Remember original classes so returning to light mode restores the exact design.
const themeGroups = [
    ["body", "bg-dark text-light"],
    [".about-panel, .before-enquiry", "bg-body-tertiary bg-gradient text-body"],
    [".contact-intro > p, .about-copy > p, .planning-details p, .travel-values li", "text-body"],
    ["main .eyebrow, .planning-details span", "text-warning"],
    [".form-control, .form-select", "bg-body text-body"],
    [".field-error", "text-danger-emphasis"],
    [".text-secondary", "text-body-secondary"],
    [".form-status", "text-body"],
    ["#check-enquiry", "btn-warning"]
];
const themeElements = themeGroups.flatMap(function ([selector, classes]) {
    return Array.from(document.querySelectorAll(selector), function (element) {
        return { element, original: element.className, classes: classes.split(" ") };
    });
});
let darkMode = false;

themeButton.addEventListener("click", function () {
    darkMode = !darkMode;
    document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
    themeElements.forEach(function ({ element, original, classes }) {
        element.className = original;
        if (darkMode) {
            element.classList.remove("text-dark", "text-secondary", "btn-dark");
            element.classList.add(...classes);
        }
    });
    themeButton.textContent = darkMode ? "Light mode" : "Dark mode";
    themeButton.setAttribute("aria-label", darkMode ? "Switch to light mode" : "Switch to dark mode");
});
