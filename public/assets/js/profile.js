// Need to know if using Imperial or Metric Units; default to Imperial because we are AMERICANS!
let isImperial = true;
let currentUser = {};
let currentRecipe = {};
let recipeArray = [];
let changedPassword = false;

// Html for buttons
const delButtonHtml = `<button class="btn waves-effect waves-light teal darken-4 deleteBtn"><i
  class="material-icons left">clear</i><span class="hide-on-small-only">Delete</span></button>`;
const editButtonHtml = `<button class="btn waves-effect waves-light teal darken-4 editBtn"><i
  class="material-icons left">edit</i><span class="hide-on-small-only">Edit</span></button>&nbsp;`;
const publicCheckedHtml = `<i class="material-icons">check</i>`;
const publicUncheckedHtml = `<i class="material-icons">not_interested</i>`;

$(document).ready(function () {
  // Materialize initialization
  $(".dropdown-trigger").dropdown();
  $("select").formSelect();
  
  $("#saveUserBtn").click(saveUser);
  $("#cancelBtn").click(cancelChanges);
  $(".addBtn").click(addRecipe);
  $("#username").change(usernameChange);
  $("#current-password").change(passwordChange);
  $("#new-password").change(passwordChange);
  $("#current-password").focus(passwordGetFocus);
  $("#new-password").focus(passwordGetFocus);
  $("#current-password").blur(passwordLoseFocus);
  $("#new-password").blur(passwordLoseFocus);

  // Get current user information
  $.get("/api/currentuser", function(data) {
    // Must be logged in to be on this page
    if (!data.id) {
        window.location.replace("/login");
    }
    else {
      currentUser = data;
      $("#sign-in").hide();
      if (screen.width <= 400) {
        $("#mobile-menu").show();
      }
      else {
        $("#user-name").show();
      };
      loadUserData(true);
    };
  });
});

// On click for Save button on Profile page
function saveUser(event) {
  event.preventDefault();

  // Email and password are validated and set on change; don't need to update here; ID set on load
  currentUser.firstName = $("#first-name").val();
  currentUser.lastName = $("#last-name").val();
  currentUser.location = $("#location").val();
  currentUser.aboutMe = $("#about-me").val();
  currentUser.imperial = $("#imperial")[0].checked;

  $.ajax({
    method: "PUT",
    url: "/api/user/" + changedPassword,
    data: currentUser
  })
  .done(function () {
    changedPassword = false;
    loadUserData(false);
    // TODO: Use something other than alert
    alert("Profile updated.");
  })
  .fail(function () {
    // TODO: Use something other than alert
    alert("Unable to update profile.");
  });
};

// On click for Cancel button on Profile page
function cancelChanges(event) {
  event.preventDefault();
  loadUserData(false);
};

// On change for Email/Username
function usernameChange(event) {
  let newEmail = $("#username").val().trim();
  let posAt = newEmail.indexOf("@");
  // Validate email address. Materialize only checks for "@"
  if ((posAt === -1) || (newEmail.lastIndexOf(".") < posAt)) {
    // TODO: Use something other than alert
    alert("Email is not valid format. Must be <name>@<server>.<domain>");
    $("#username").focus();
  }
  // Verify that there was actually a change
  else if (newEmail.toLowerCase() == currentUser.email.toLowerCase()) {
    currentUser.email = newEmail; // May have just changed casing - no validation needed
  }
  // Confirm change
  else if (confirm("Are you sure you want to change your email address?")) {
    currentUser.email = newEmail;
  }
  // Changed in error, set back to original value
  else {
    $("#username").val(currentUser.email);
  }
};

// When a password field gets focus, allow user to see characters, but clear current text
function passwordGetFocus(event) {
  event.target.value = "";
  event.target.type = "text";
};

// When a password field loses focus, hide characters again; validated in onChange
function passwordLoseFocus(event) {
  event.target.type = "password"; // Change back to being masked

  // If changedPassword still false, no change was made
  if (!changedPassword) {
    event.target.value = currentUser.password;
    M.updateTextFields();
  }
  // Make sure password is not blank
  else if (event.target.value.trim() === "") {
    changedPassword = false;

    // Set helper text for correct field, stop event propagation, then reset focus
    if (event.target.id === "current-password") {
      $("#current-password-msg").text("Password cannot be blank.");
      $("#new-password-msg").text("");
    }
    else {
      $("#new-password-msg").text("Password cannot be blank.");
      $("#current-password-msg").text("");
    };
    event.stopPropagation();
    event.target.focus();
  }
  // Otherwise, if fields are equal, need to update user password
  else if ($("#current-password").val() === $("#new-password").val()) {
    changedPassword = true; // redundant, but just for good measure
    currentUser.password = event.target.value.trim();
    // Clear these out, just in case still set
    $("#current-password-msg").text("");
    $("#new-password-msg").text("");
  }
  // Otherwise, need to make user enter same password in other field
  else if (event.target.id === "current-password") {
    changedPassword = false;
    $("#current-password-msg").text("");
    $("#new-password-msg").text("Passwords must match.");
    $("#new-password").focus();
  }
  else {
    changedPassword = false;
    $("#new-password-msg").text("");
    $("#current-password-msg").text("Passwords must match.");
    $("#current-password").focus();
  };
};

// On change for Password fields
function passwordChange(event) {
  changedPassword = true;
};

// On click for Add Recipe button on Profile page
function addRecipe(event) {
  event.preventDefault();
  window.location.href = "/add";
};

// On click for Edit a specific recipe in table on Profile page
function editRecipe(event) {
  event.preventDefault();

  const recipeIndex = this.parentNode.parentNode.rowIndex - 1; // subtract one because of header

  // Just need to do this to set currentRecipe for Add/Update page
  $.get("/api/recipes/" + recipeArray[recipeIndex].id);

  window.location.href = "/add";
};

// On click for Delete a specific recipe in table on Profile page
function deleteRecipe(event) {
  event.preventDefault();

  const recipeRow = this.parentNode.parentNode;
  const recipeIndex = recipeRow.rowIndex - 1; // subtract one because of header

  // TODO: Use something other than confirm
  if (confirm("Delete " + recipeArray[recipeIndex].title + "?")) {
    // Delete recipe from database
    $.ajax({
      method: "DELETE",
      url: "/api/recipes/" + recipeArray[recipeIndex].id
    })
      .done(function () {
        // Delete row from table
        recipeRow.remove();
        // Delete from recipe array
        recipeArray.splice(recipeIndex, 1);
      })
      .fail(function (error) {
        // TODO: use something other than alert
        alert("Could not delete recipe. Error code " + error);
      });
  };
};

// Function that loads user's information on Profile page
function loadUserData(loadRecipes) {
  $("#user-name").text("Welcome " + currentUser.firstName + " " + currentUser.lastName);
  $("#username").val(currentUser.email);
  $("#current-password").val(currentUser.password);
  $("#new-password").val(currentUser.password);

  $("#first-name").val(currentUser.firstName);
  $("#last-name").val(currentUser.lastName);
  $("#location").val(currentUser.location);
  $("#about-me").val(currentUser.aboutMe);
  isImperial = $("#imperial")[0].checked = currentUser.imperial;

  M.updateTextFields(); // Labels won't move out of the way if you don't do this
  M.textareaAutoResize($("#about-me")); // Won't resize to fit data without this

  if (loadRecipes) {
    $.get("/api/recipesByUser/" + currentUser.id, function (data) {
      recipeArray = data;
      // Create a table row for each recipe
      const recipeTable = $("#recipe-body");
      let newRow;

      recipeArray.forEach(item => {
        newRow = $("<tr>");
        // Display recipe title
        newRow.append($("<td>").html(item.title));
        // Convert MySQL datetime to # milliseconds midnight of January 1, 1970, then to date string
        newRow.append($("<td>").html((new Date(Date.parse(item.createdAt))).toLocaleDateString()));
        // Set public to check if true, not sign if false
        if (item.public) {
          newRow.append($("<td>").html(publicCheckedHtml));
        }
        else {
          newRow.append($("<td>").html(publicUncheckedHtml));
        };
        // Add buttons to edit or delete recipe
        newRow.append($("<td>").html(editButtonHtml + delButtonHtml));
        recipeTable.append(newRow);
      });

      // Add event handlers after elements have been created
      $(".editBtn").click(editRecipe);
      $(".deleteBtn").click(deleteRecipe);
    });
  };
};