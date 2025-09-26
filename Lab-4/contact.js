let name = document.getElementById("name");
let email = document.getElementById("email");
let subject = document.getElementById("subject");
let message = document.getElementById("message");

let nameError = document.getElementById("name-error");
let emailError = document.getElementById("email-error");
let subjectError = document.getElementById("subject-error");
let messageError = document.getElementById("message-error");


document.getElementById("saveBtn").onclick = function () {
    let isValid = true;

    if(name.value === "") {
        nameError.innerText = "Name is required";
        isValid = false;
    }

    if(email.value === "" || !email.value.includes("@")) {
        emailError.innerText = "Email is required and should have @";
        isValid = false;
    }

    if(subject.value === "") {
        subjectError.innerText = "Subject is required";
        isValid = false;
    }

    if(message.value === "") {
        messageError.innerText = "Message is required";
        isValid = false;
    }

    if(isValid) {
        alert("Form is valid and submitted!");
    }
}

name.addEventListener("input", function () {
  if (name.value.trim() !== "") {
    nameError.innerText = "";
  }
});

email.addEventListener("input", function () {
  if (email.value.includes("@")) {
    emailError.innerText = "";
  }
});

subject.addEventListener("input", function () {
  if (subject.value.trim() !== "") {
    subjectError.innerText = "";
  }
});

message.addEventListener("input", function () {
  if (message.value.trim() !== "") {
    messageError.innerText = "";
  }
});
