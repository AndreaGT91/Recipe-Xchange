// *********************
// GLOBALS FOR ALL PAGES
// *********************
// Need URL to determine which page to load, and which data
const url = window.location.search;
// Need to know if using Imperial or Metric Units; default to Imperial because we are AMERICANS!
let isImperial = true;

// ********************
// USER PROFILE GLOBALS
// ********************
// Current user being added/updated
let currentUser = {};

// ******************
// ADD/UPDATE GLOBALS
// ******************
// Current recipe/ingredient being added/updated
let currentRecipe = {};
let currentIngredient = {};
// Global array for stashing ingredient list for selected recipe
let ingredientArray = [];

// *****************
// ON READY FUNCTION
// *****************
// Once DOM is full loaded, add in the appropriate page definition
// Use its callback to load the rest of the event handlers.
$(document).ready(function() {

  function globalSetup() {
    // These are needed for every page
    $(".dropdown-trigger").dropdown(); // Makes Materialize dropdowns function
    $("select").formSelect(); // Makes Materialize select fields function
    $("#imperial").click(toggleUnits); // Event handler for Imperial/Metric unit selector
  };

  let recipeID = -1; // If -1, then no recipe loaded
  let userID = -1; // If -1, then no user loaded

  // If ?recipe_id in URL, then we need Add/Update page
  if (url.indexOf("?recipe_id=") !== -1) {
    recipeID = url.split("=")[1];

    $("#main-content").load("add.html", function(){
      globalSetup();

      // These are just for the Add/Update page
      $("#saveBtn").click(saveRecipe);
      $("#resetBtn").click(resetForm);
      $("#ingredBtn").click(saveIngredient);

      // If recipeID is -1, then we just need blank page; otherwise, get recipe data
      if (recipeID !== -1) {
        $.get("/api/recipe_data/:id" + recipeID).then(function(data) {
          currentRecipe = data;
          loadRecipeData();
        })
        .catch(function(error) {
          // TODO: Use something other than alert
          alert("Could not load recipe.");
        });
      };
    });
  }
  // If ?user_id in URL, then we need Profile page
  else if (url.indexOf("?user_id=") !== -1) {
    userID = url.split("=")[1];

    $("#main-content").load("profile.html", function(){
      globalSetup();

      // If userID is -1, then we just need blank page; otherwise, get user data
      if (userID !== -1) {
        $.get("/api/user_data/:id" + userID).then(function(data) {
          currentUser = data;
// TODO:           loadUserData();
        })
        .catch(function(error) {
          // TODO: Use something other than alert
          alert("Could not load user information.");
        });
      };
    });
  }
  // Otherwise, we need Search page
  else {
    $("#main-content").load("search.html", function(){
      globalSetup();
    });
  };
});

// Imperial/Metric toggle on click event
function toggleUnits() {
  console.log("toggle: ", this);
  isImperial = this.checked;
};

// Save button click event - adds/updates recipe and all ingredients
function saveRecipe(event) {
  // Get data from main recipe fields
  currentRecipe.title = $("#title").val();
  currentRecipe.source = $("#source").val();
  currentRecipe.public = $("#public").val();
  currentRecipe.category1 = $("#category1").val();
  currentRecipe.category2 = $("#category2").val();
  currentRecipe.category3 = $("#category3").val();
  currentRecipe.description = $("#recipe-desc").val();
  currentRecipe.prepTime = $("#prep-time").val();
  currentRecipe.cookTime = $("#cook-time").val();
  currentRecipe.numServings = $("#num-servings").val();
  currentRecipe.instructions = $("#instructions").val();
  // TODO: currentRecipe.userID = ???

  // Set oven temp based on if Imperial or Metric, convert for other setting
  if (isImperial) {
    currentRecipe.ovenTempF = $("#oven-temp").val();
    currentRecipe.ovenTempC = Math.round((currentRecipe.ovenTempF - 32) * 5 / 9);
  }
  else {
    currentRecipe.ovenTempC = $("#oven-temp").val();
    currentRecipe.ovenTempF = Math.round((currentRecipe.ovenTempC / 5 * 9) + 32);
  };

  // TODO: What's the best way to determine if updating or adding???

  // Update
  if (currentRecipe.id) {
    $.post("/api/recipe_data/:" + currentRecipe.id, currentRecipe)
      .then(function() {
        // TODO: Not going to work as is. Need some mechanism for adding/deleting/updating ingredients
        $.post("/api/ingredient_data", ingredientArray)
          .then(function() {
            loadRecipeData();
            // TODO: Use something other than alert
            alert("Recipe updated!");
          })
          .catch(function() {
            // TODO: Use something other than alert
            alert("Unable to update ingredients.");
          });
      })
      .catch(function() {
        // TODO: Use something other than alert
        alert("Unable to update recipe.");
      });
  }
  // Add
  else {
    $.post("/api/recipe_data", currentRecipe)
      .then(function(data) {
        currentRecipe.id = data;
        // Set recipeID for each ingredient
        ingredientArray.forEach(item => {
          item.recipeID = currentRecipe.id;
        });

        $.post("/api/ingredient_data", ingredientArray)
          .then(function() {
            loadRecipeData();
            // TODO: Use something other than alert
            alert("Recipe added!");
          })
          .catch(function() {
            // TODO: Use something other than alert
            alert("Unable to add ingredients.");
          });
      })
      .catch(function() {
        // TODO: Use something other than alert
        alert("Unable to add recipe.");
      });
  };
};

// Reset button click event - clears all fields, including ingredients and nutrition info
function resetForm(event) {
  clearRecipeData(false);
};

// Ingredient Save click event - adds/updates ingredient
function saveIngredient(event) {
  const ingredTable = $("#ingredient-body");

  ingredTable[0].rows.forEach(item => {
    item.cells[0].innerText // quantity
    item.cells[1].innerText // unit
    item.cells[2].innerText // name
  });  

  calculateNutrition();
};

// Ingredient Delete click event - deletes selected ingredient
function deleteIngredient(event) {
  calculateNutrition();
};

// Ingredient table row click event - edit ingredient
function editIngredient(event) {
  // Do nothing if they click on header row
  if (this.rowIndex > 0) {
    currentIngredient = ingredientArray[(this.rowIndex)-1]; // subtract one because of header

    if (isImperial) {
      $("#quantity").val(getFraction(currentIngredient.imperialQty));
      $("#imperialUnit").val(currentIngredient.imperialUnit);
      $("#imperialUnit").formSelect(); // Dropdown refresh
    }
    else {
      $("#quantity").val(currentIngredient.metricQty);
      $("#metricUnit").val(currentIngredient.metricUnit);
      $("#metricUnit").formSelect(); // Dropdown refresh
    };

    $("#ingredient").val(currentIngredient.name);
    M.updateTextFields(); // Labels won't move out of the way if you don't do this
  };
};

// Load the passed recipe object into the data fields; retrieve ingredients, too
function loadRecipeData() {
  // Set values of all the main recipe fields
  $("#title").val(currentRecipe.title);
  $("#source").val(currentRecipe.source);
  $("#public").val(currentRecipe.public);
  $("#category1").val(currentRecipe.category1);
  $("#category2").val(currentRecipe.category2);
  $("#category3").val(currentRecipe.category3);
  $("#recipe-desc").val(currentRecipe.description);
  M.textareaAutoResize($("#recipe-desc")); // Won't resize to fit data without this
  $("#prep-time").val(currentRecipe.prepTime);
  $("#cook-time").val(currentRecipe.cookTime);
  $("#num-servings").val(currentRecipe.numServings);
  $("#instructions").val(currentRecipe.instructions);
  M.textareaAutoResize($("#instructions")); // Won't resize to fit data without this

  // Set oven temp based on if Imperial or Metric, set label, too
  if (isImperial) {
    $("#oven-temp").val(currentRecipe.ovenTempF);
    $("#temp-label").text("Oven Temp (°F)");
  }
  else {
    $("#oven-temp").val(currentRecipe.ovenTempC);
    $("#temp-label").text("Oven Temp (°C)");
  };

  // Retrieve ingredients for this recipe
// TODO: Comment out just for testing  $.get("/api/ingredient_data:" + currentRecipe.id).then(function(data) {
// TODO: Comment out just for testing    ingredientArray = data;

    const buttonHtml = `<button class="btn waves-effect waves-light teal darken-4 deleteBtn"><i
      class="material-icons left">clear</i><span class="hide-on-small-only">Delete</span></button>`;
    const ingredTable = $("#ingredient-body");
    let newRow;
    let qty;
    let unit;

    // Create a table row for each ingredient
    ingredientArray.forEach(item => {
      // Get correct quantity and unit based on Imperial/Metric
      if (isImperial) {
        qty = getFraction(item.imperialQty);
        unit = item.imperialUnit;
      }
      else {
        qty = item.metricQty;
        unit = item.metricUnit;
      };

      newRow = $("<tr>");
      newRow.append($("<td>").html(qty));
      newRow.append($("<td>").html(unit))
      newRow.append($("<td>").html(item.name));
      newRow.append($("<td>").html(buttonHtml));
      ingredTable.append(newRow);
    })
// TODO: Comment out just for testing  })
// TODO: Comment out just for testing  .finally(function() {
    // Add event handlers after elements have been created
    $(".deleteBtn").click(deleteIngredient);
    $("tr").click(editIngredient);
    calculateNutrition();
// TODO: Comment out just for testing  });
};

// Clear all fields
function clearRecipeData(resetForm) {
  // If not called from the Reset button on click handler, then need to reset form
  if (resetForm) {
    $(".recipe-form")[0].reset();
  };

  // Clear globals
// TODO: Comment out just for testing  currentRecipe = {};
// TODO: Comment out just for testing  ingredientArray = [];

  // Clear ingredient add/update form
  $(".ingredient-form")[0].reset();

  // Clear ingredient table
  $("#ingredient-body").children().remove();

  // Clear nutrition fields
  calculateNutrition();
};

// Loop through all ingredients to calculate total nutrition info
function calculateNutrition() {
  // Initialize counters
  let calories = 0;
  let protein = 0;
  let carbohydrates = 0;
  let fat = 0;

  // Loop through and sum nutrition info
  ingredientArray.forEach(item => {
    calories += item.calories;
    protein += item.protein;
    carbohydrates += item.carbs;
    fat += item.fat;
  });

  // Update display fields
  $("#calories").val(calories); 
  $("#protein").val(protein); 
  $("#carbohydrates").val(carbohydrates); 
  $("#fat").val(fat); 
  M.updateTextFields(); // Labels won't move out of the way if you don't do this
};

function getDecimal(number) {
  // If already a number, then no conversion needed
  if (!isNaN(number)) {
    return number
  }
  else {
    let wholeNum = 0;
    let numerator = 0;
    let denominator = 1;

    let nums = number.split("/");
    let leftSide = nums[0].split(" ",2);

    // If nums length is 1, then there was no slash. 
    // If, for some reason, there is more than one slash, just ignore anything beyond the first
    if (nums.length > 1) {
      denominator = parseInt(nums[1]);
    };

    // If leftSide length is 1, then there was only one number to the left of the slash, or no slash at all
    if (leftSide.length === 1) {
      numerator = parseInt(leftSide[0]);
    }
    // The whole number is the first number that is followed by a space, numerator is next number
    // If, for some reason, there is more than two numbers separated by a space, just ignore anything after the first two
    else {
      wholeNum = parseInit(leftSide[0]);
      numerator = parseInt(leftSide[1]);
    };

    // Double check that everything is a number; if not, reset to defaults
    if (isNaN(wholeNum)) {
      wholeNum = 0;
    };

    if (isNaN(numerator)) {
      numerator = 0;
    };

    if (isNaN(denominator)) {
      denominator = 1;
    };

    return wholeNum + (numerator / denominator);
  };
};

function getFraction(decimal) {
  // Make sure input is a number
  if (isNaN(decimal)) {
    return decimal
  }
  // If integer then no calculation needed
  else if (Number.isInteger(decimal)) {
    return decimal.toString()
  };

  let wholeNum = Math.trunc(decimal);
  let fraction = (decimal - wholeNum).toFixed(2);
  let fractionString = "";

  // These are the only fractional values allowed in cooking
  switch (fraction) {
    case "0.25": 
      fractionString = "1/4";
      break;
    case "0.33":
      fractionString = "1/3";
      break;
    case "0.50":
      fractionString = "1/2";
      break;
    case "0.67":
      fractionString = "2/3";
      break;
    case "0.75":
      fractionString = "3/4";
    // Default action is to remain blank string
  };

  if (wholeNum > 0) {
    return wholeNum.toString() + " " + fractionString;
  }
  else {
    return fractionString;
  };
};