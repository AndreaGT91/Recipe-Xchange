let currentUser = {};

$(document).ready(function () {
  $("#loginBtn").click(loginUser);
  $("#forgotBtn").click(forgotPassword);
  $("#cancelBtn").click(cancelLogin);
  $("#emailLogin").change(emailChange);
  $("#passwordLogin").focus(passwordGetFocus);
  $("#passwordLogin").blur(loginPasswordLoseFocus);
}); 

function loginUser(event) {
  event.preventDefault();
  
  // Whether new user or existing user, we need to get these values
  currentUser.email = $("#emailLogin").val();
  currentUser.password = $("#passwordLogin").val();

  // If new user, create profile
  if (!currentUser.id) {
    currentUser.firstName = "New user";
    currentUser.lastName = "";
    currentUser.location = "";
    currentUser.aboutMe = "";
    currentUser.imperial = $("#imperial")[0].checked;

    $.post("/api/signup", currentUser)
      .done(function (data) {
        currentUser = data;
        window.location.replace("/profile");
      })
      .fail(function (error) {
        // TODO: Use something other than alert
        alert("Error creating login: ", error);
      });
  }
  // Existing user, verify password
  else {
    $.post("/api/login", {
      email: currentUser.email,
      password: currentUser.password
    })
    .done(function (data) {
      currentUser = data;
      window.location.replace("/profile");
    })
    .fail(function (error) {
      // TODO: Use something other than alert
      alert("Invalid password for " + currentUser.email);
      $("#passwordLogin").focus();
    });
  };
};

function forgotPassword(event) {
  // TODO: Need to actually do verification. Added this just for testing purposes
  if (currentUser === {}) {
    alert("Enter email address first.");
    $("#emailLogin").focus();
  }
  else {
    let newPassword = prompt("Please enter new password:");
    if (newPassword == null || newPassword == "") {
      cancelLogin(event);
    } 
    else if (newPassword.trim() === "") {
      alert("Password cannot be blank.");
    }
    else {
      currentUser.password = newPassword;

      $.ajax({
        method: "PUT",
        url: "/api/user/" + true,
        data: currentUser
      })
      .done(function () {
        // TODO: Use something other than alert
        $("#passwordLogin").val(newPassword);
        M.updateTextFields();
        alert("Password updated.");
      })
      .fail(function () {
        // TODO: Use something other than alert
        alert("Unable to update password.");
      });
    };
  };
};

function cancelLogin(event) {
  // Go to search page if user cancels login
  window.location.replace("/");
};

// On change for Email/Username
function emailChange(event) {
  let email = event.target.value.trim();
  let posAt = email.indexOf("@");

  // Validate email address. Materialize only checks for "@"
  if ((posAt === -1) || (email.lastIndexOf(".") < posAt)) {
    // TODO: Use something other than alert
    alert("Email is not valid format. Must be <name>@<server>.<domain>");
    event.target.focus();
  }
  else {
    // Load data for that email address, if found
    $.get("/api/userByEmail/" + email, function (data) {
      if (data) {
        currentUser = data;
      }
      else {
        currentUser = {};
      };
    });
  };
};

// When a password field gets focus, allow user to see characters, but clear current text
function passwordGetFocus(event) {
  event.target.value = "";
  event.target.type = "text";
};

// Return to masked characters
function loginPasswordLoseFocus(event) {
  event.target.type = "password"; // Change back to being masked
};