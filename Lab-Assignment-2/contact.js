$(function() {
  $("#saveBtn").click(handleFormSubmit)
})

function handleFormSubmit() {
 let name = $("#name").val();
 let email = $("#email").val();
 let subject = $("#subject").val();
 let message = $("#message").val();

 if(!name) {
  $("#name-error").text("Name is required");
 }
 if(!email || !email.includes("@")) {
  $("#email-error").text("Email is required and should have @");
 }
  if(!subject) {
     $("#subject-error").text("Subject is required");
  }
  if(!message) {
     $("#message-error").text("Message is required");
  }
  if(name && email && subject && message) {
    $("#name-error").text("");
    $("#email-error").text("");
    $("#subject-error").text("");
    $("#message-error").text("");
    $("#name").val("");
    $("#email").val("");
    $("#subject").val("");
    $("#message").val("");
    alert("Form is valid and submitted!");
  }
}