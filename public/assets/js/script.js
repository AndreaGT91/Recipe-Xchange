// *********************
// GLOBALS FOR ALL PAGES
// *********************
// Need URL to determine which page to load, and which data
const url = window.location.search;
// Need to know if using Imperial or Metric Units; default to Imperial because we are AMERICANS!
let isImperial = true;
let currentPage = "";

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
// Html for ingredient delete button
const buttonHtml = `<button class="btn waves-effect waves-light teal darken-4 deleteBtn"><i
  class="material-icons left">clear</i><span class="hide-on-small-only">Delete</span></button>`;

// ***********************
// FUNCTIONS FOR ALL PAGES
// ***********************
// Once DOM is full loaded, add in the appropriate page definition
// Use its callback to load the rest of the event handlers.
$(document).ready(function() {

  // These are needed for every page
  function globalSetup() {
    $(".dropdown-trigger").dropdown(); // Makes Materialize dropdowns function
    $("select").formSelect(); // Makes Materialize select fields function
    $("#imperial").click(toggleUnits); // Event handler for Imperial/Metric unit selector
  };

  let recipeID = -1; // If -1, then no recipe loaded
  let userID = -1; // If -1, then no user loaded
  let urlArray = url.split("="); // Could have user_id and recipe_id, just user_id, or neither

  // If ?user_id in URL, then we need either Profile page or Add/Update
  if (url.indexOf("?user_id=") !== -1) {
    userID = parseInt(urlArray[1]);

    // Get user data
// TODO: Testing    $.get("/api/user_data/" + userID, function(data) {
// TODO: Testing      currentUser = data;
      $("#user-name").text("Welcome " + currentUser.firstName + " " + currentUser.lastName);

      // If ?recipe_id in URL, then we need Add/Update page
      if (url.indexOf("?recipe_id=") !== -1) {
        recipeID = parseInt(urlArray[2]);

        $("#main-content").load("add.html", function() {
          currentPage = "add";
          globalSetup();

          // These are just for the Add/Update page
          $("#saveBtn").click(saveRecipe);
          $("#resetBtn").click(resetForm);
          $("#ingredBtn").click(saveIngredient);

          // If recipeID is -1, then we just need blank page; otherwise, get recipe data
          if (recipeID !== -1) {
            $.get("/api/recipe_data/" + recipeID, function(data) {
              currentRecipe = data;
              toggleUnits();
            });
          };
        });
      }
      // Else, load Profile page
      else {
        $("#main-content").load("profile.html", function(){
          currentPage = "profile";
          globalSetup();
// TODO:           loadUserData();
        });
      };
// TODO: Testing    });
  }
  // Otherwise, we need Search page
  else {
    $("#main-content").load("search.html", function() {
      currentPage = "search";
      globalSetup();
      toggleUnits();
    });
  };
});

// Imperial/Metric toggle on click event
function toggleUnits() {
  isImperial = $("#imperial")[0].checked; // Don't use "this" because sometimes called directly

  // If on Add/Update or Search pages, need to update display and data
  if ((currentPage === "add") || (currentPage === "search")) {
    if (isImperial) {
      $("#temp-label").text("Oven Temp (°F)");
      $("#imperialUnit").removeAttr("hidden");
      $("#metricUnit").attr("hidden", true);
    }
    else {
      $("#temp-label").text("Oven Temp (°C)");
      $("#metricUnit").removeAttr("hidden");
      $("#imperialUnit").attr("hidden", true);
    };

    loadRecipeData(); // Refresh recipe info to use correct units
  };
};

// Load the currentRecipe object and ingredients array into the data fields
function loadRecipeData() {
  if (currentRecipe !== {}) {
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

    // Set oven temp based on if Imperial or Metric
    if (isImperial) {
      $("#oven-temp").val(currentRecipe.ovenTempF);
    }
    else {
      $("#oven-temp").val(currentRecipe.ovenTempC);
    };

    // Create a table row for each ingredient
    const ingredTable = $("#ingredient-body")[0];
    let newRow;
    let qty;
    let unit;

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
      // Add Delete button if on Add/Update page only
      if (currentPage === "add") {
        newRow.append($("<td>").html(buttonHtml));
      }
      ingredTable.append(newRow);
    })

    // Add event handlers after elements have been created, if on Add/Update page only
    if (currentPage === "add") {
      $(".deleteBtn").click(deleteIngredient);
      $("tr").click(editIngredient);
    };

    calculateNutrition();
  };
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

// *****************************
// FUNCTIONS FOR ADD/UPDATE PAGE
// *****************************
// Save button click event - adds/updates recipe
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
  currentRecipe.userID = currentUser;

  // Set oven temp based on if Imperial or Metric, convert for other setting
  if (isImperial) {
    currentRecipe.ovenTempF = $("#oven-temp").val();
    currentRecipe.ovenTempC = Math.round((currentRecipe.ovenTempF - 32) * 5 / 9);
  }
  else {
    currentRecipe.ovenTempC = $("#oven-temp").val();
    currentRecipe.ovenTempF = Math.round((currentRecipe.ovenTempC / 5 * 9) + 32);
  };

  // Update existing recipe
  if (currentRecipe.id) {
    $.ajax({
      method: "PUT",
      url: "/api/recipe_data",
      data: currentRecipe
    })
    .then(function() {
      // TODO: Use something other than alert
      alert("Recipe updated.");
    })
    .catch(function() {
      // TODO: Use something other than alert
      alert("Unable to update recipe.");
    });
  }
  // Add new recipe
  else {
    $.post("/api/recipe_data", currentRecipe, function(data) {
      currentRecipe.id = data;

      // TODO: can't add new ingredients when creating new recipe, until recipe is saved
      // Set recipeID for each ingredient
      ingredientArray.forEach(item => {
        item.recipeID = currentRecipe.id;
      });

      $.post("/api/ingredient_data", ingredientArray, function() {
        loadRecipeData();
        // TODO: Use something other than alert
        alert("Recipe added!");
      });
    });
  };
};

// Ingredient Save click event - adds/updates ingredient
function saveIngredient(event) {
  const spoonacularApiKey = "6572c1d2e7734a0385d6e5765993d8ca"; // TODO: Move to server side to protect key
  const apiGetIngredInfo = `https://api.spoonacular.com/recipes/parseIngredients
    ?apiKey=${spoonacularApiKey}&includeNutrition=true&ingredientList=`;
 
  // Get pointer to ingredient table body
  const ingredTable = $("#ingredient-body")[0];

  // Retrieve the name from the input form and set recipeID
  let ingredList = currentIngredient.name = $("#ingredient").val();
  currentIngredient.recipeID = currentRecipe.id;

  // Instantiate variables for API call
  let sourceAmount;
  let sourceUnit;
  let targetUnit;

  // Retrieve the quantity and amount, set appropriate values
  if (isImperial) {
    sourceAmount = currentIngredient.imperialQty = getDecimal($("#quantity").val());
    sourceUnit = currentIngredient.imperialUnit = $("#imperialUnit").val();
    ingredList = currentIngredient.imperialQty + " " + currentIngredient.imperialUnit + " " + ingredList;
    targetUnit = "grams";
  }
  else {
    sourceAmount = currentIngredient.metricQty = $("#quantity").val();
    sourceUnit = currentIngredient.metricUnit = $("#metricUnit").val();
    ingredList = currentIngredient.metricQty + " " + currentIngredient.metricUnit + " " + ingredList;
    // TODO: Would be nice to determine target unit more precisely, i.e. tsp, tbl, cup, etc.
    targetUnit = "cups";
  };

  const apiGetConversion = `https://api.spoonacular.com/recipes/convert?apiKey=${spoonacularApiKey}
    &ingredientName=${currentIngredient.name}&sourceAmount=${sourceAmount}&sourceUnit=${sourceUnit}
    &targetUnit=${targetUnit}`;

  // First, do call to get ingredient information
  $.ajax({
    url: apiGetIngredInfo + ingredList,
    method: "POST"
  })
  .then(function (response) {
    // Then, retrieve all the nutrition info
    const nutrients = response[0].nutrition.nutrients; // array of nutrient info
    // "title": "Calories"
    // "title": "Fat"
    // "title": "Carbohydrates"
    // "title": "Protein"
    // currentIngredient.calories = 
    // currentIngredient.protein =
    // currentIngredient.carbs =
    // currentIngredient.fat =

    // Finally, do call to get imperial/metric conversion
    $.ajax({
      url: apiGetConversion,
      method: "GET"
    })
    .then(function (res) {
      // Set quantity/unit fields with converted data
      if (isImperial) {
        currentIngredient.metricQty = res.targetAmount;
        currentIngredient.metricUnit = res.targetUnit;
      }
      else {
        currentIngredient.imperialQty = res.targetAmount;
        currentIngredient.imperialUnit = res.targetUnit;
      };

      // TODO: Actual save
    })
    .catch(function (err) {
      // TODO: Use something other than alert
      alert("Could not retrieve conversion information. Error code ", err);
    });
  
  })
  .catch(function (error) {
    // TODO: Use something other than alert
    alert("Could not retrieve nutrition information. Error code ", error);
  });


  // Determine if we are adding new ingredient or updating existing
  if (currentIngredient.id) {
    $.ajax({
      method: "PUT",
      url: "/api/ingredient_data",
      data: currentIngredient
    })
    .then(function() {
      // Get index of currentIngredient in ingredientArray to update table row
      let arrayIndex = ingredientArray.findIndex(ingred => ingred.id === currentIngredient.id);
      ingredientArray.splice(arrayIndex, 1, currentIngredient); // replace item in array
      let tableRow = ingredTable.rows[arrayIndex + 1]; // add one because of header

      if (isImperial) {
        tableRow.cells[0].innerText = getFraction(currentIngredient.imperialQty);
        tableRow.cells[1].innerText = currentIngredient.imperialUnit;
      }
      else {
        tableRow.cells[0].innerText = currentIngredient.metricQty;
        tableRow.cells[1].innerText = currentIngredient.metricUnit;
      };
      tableRow.cells[2].innerText = currentIngredient.name;
    
      calculateNutrition();
    })
    .catch(function(error) {
      // TODO: use something other than alert
      alert("Could not update ingredient. Error code " + error);
    });
  }
  // Adding new ingredient
  else {
    $.post("/api/ingredient_data", currentIngredient, function(data) {
      currentIngredient.id = data;
      ingredientArray.push(currentIngredient); // Add new ingredient to array
      
      // Add new ingredient to table
      let qty;
      let unit;

      if (isImperial) {
        qty = getFraction(currentIngredient.imperialQty);
        unit = currentIngredient.imperialUnit;
      }
      else {
        qty = currentIngredient.metricQty;
        unit = currentIngredient.metricUnit;
      };

      let newRow = $("<tr>");
      newRow.append($("<td>").html(qty));
      newRow.append($("<td>").html(unit))
      newRow.append($("<td>").html(currentIngredient.name));
      newRow.append($("<td>").html(buttonHtml));
      ingredTable.append(newRow);

      // Attach event handlers and recalcuate nutrition info
      $(".deleteBtn").click(deleteIngredient);
      $("tr").click(editIngredient);
      calculateNutrition();
    });
  };
};

// Ingredient Delete click event - deletes selected ingredient
function deleteIngredient(event) {  
  const ingredIndex = this.parentNode.parentNode.rowIndex - 1; // subtract one because of header

  // TODO: Use something other than confirm
  if (confirm("Delete " + ingredientArray[ingredIndex].name + "?")) {
    // Delete ingredient from database
    $.ajax({
      method: "DELETE",
      url: "/api/ingredient/" + ingredIndex
    })
    .then(function() {
      // Delete row from table
      this.parentNode.parentNode.remove();
      // Clear ingredient add/update form if it holds deleted ingredient
      if (currentIngredient.id === ingredientArray[ingredIndex].id) {
        $(".ingredient-form")[0].reset();
        currentIngredient = {};
      };
      // Delete from ingredient array
      ingredientArray.splice(ingredIndex, 1);
      // Recalculate nutrition info
      calculateNutrition();
    })
    .catch(function(error) {
      // TODO: use something other than alert
      alert("Could not delete ingredient. Error code " + error);
    });
  };
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

// Reset button click event - clears all fields, including ingredients and nutrition info
function resetForm(event) {
  // Clear globals
  currentRecipe = {};
  currentIngredient = {};
  ingredientArray = [];

  // Clear ingredient add/update form
  $(".ingredient-form")[0].reset();

  // Clear ingredient table
  $("#ingredient-body").children().remove();

  // Clear nutrition fields
  calculateNutrition();
};

// **************************
// FUNCTIONS FOR PROFILE PAGE
// **************************

// *************************
// FUNCTIONS FOR SEARCH PAGE
// *************************
