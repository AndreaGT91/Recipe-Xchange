// Global array for stashing ingredient list for selected recipe
let ingredientArray = [];
let currentRecipe = {};
let currentIngredient = {};

// TODO: for testing only
currentRecipe = {
  id: 0,
  title: "Chocolate Chip Cookies",
  source: "ORIGINAL NESTLÉ® TOLL HOUSE® CHOCOLATE CHIP COOKIES",
  public: true,
  category1: null,
  category2: null,
  category3: null,
  description: "The original. The best.",
  prepTime: 15,
  cookTime: 9,
  numServings: 30,
  instructions: `COMBINE flour, baking soda and salt in small bowl. Beat butter, granulated sugar, brown sugar and 
    vanilla extract in large mixer bowl until creamy. Add eggs, one at a time, beating well after each addition. 
    Gradually beat in flour mixture. Stir in morsels and nuts. Drop by rounded tablespoon onto ungreased baking sheets.
    \n\n BAKE for 9 to 11 minutes or until golden brown. Cool on baking sheets for 2 minutes; 
    remove to wire racks to cool completely.`,
  ovenTempF: 375,
  ovenTempC: 190,
  userID: 0};

ingredientArray = [
  {id: 0,
    name: "All-purpose flour",
    imperialQty: 2.5,
    imperialUnit: "Cup",
    metricQty: 250,
    metricUnit: "g",
    calories: 910,
    protein: 26,
    carbs: 190,
    fat: 2.4,
    recipeID: 0},
  {id: 1,
    name: "Baking soda",
    imperialQty: 1,
    imperialUnit: "Tsp",
    metricQty: 150,
    metricUnit: "g",
    calories: 576,
    protein: 0,
    carbs: 150,
    fat: 0,
    recipeID: 0},
  {id: 2,
    name: "Salt",
    imperialQty: 1,
    imperialUnit: "Tsp",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0},
  {id: 3,
    name: "Butter, softened",
    imperialQty: 1,
    imperialUnit: "Cup",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0},
  {id: 4,
    name: "Granulated sugar",
    imperialQty: 0.75,
    imperialUnit: "Cup",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0},
  {id: 5,
    name: "Packed brown sugar",
    imperialQty: 0.75,
    imperialUnit: "Cup",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0},
  {id: 6,
    name: "Vanilla extract",
    imperialQty: 1,
    imperialUnit: "Tsp",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0},
  {id: 7,
    name: "Large eggs",
    imperialQty: 2,
    imperialUnit: "N/A",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0},
  {id: 8,
    name: "NESTLÉ® TOLL HOUSE® Semi-Sweet Chocolate Morsels",
    imperialQty: 2,
    imperialUnit: "Cup",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0},
  {id: 9,
    name: "Chopped nuts",
    imperialQty: 1,
    imperialUnit: "Cup",
    metricQty: 112,
    metricUnit: "g",
    calories: 816,
    protein: 1,
    carbs: 0.1,
    fat: 96,
    recipeID: 0}];

// Once DOM is full loaded, add in the appropriate page definition
// Use its callback to load the rest of the event handlers.
$(document).ready(function() {
  // TODO: Need some way to know which sub-page to load
  $("#main-content").load("add.html", function(){
    // These are needed for every page
    $(".dropdown-trigger").dropdown();
    $("select").formSelect();
    // These are just for the Add/Update page
    $("#saveBtn").click(saveRecipe);
    $("#resetBtn").click(resetForm);
    $("#ingredBtn").click(saveIngredient);

    loadRecipeData(currentRecipe); // TODO: for testing only

    // TODO: Need some way to know if we are adding new recipe, or updating existing recipe (and its id),
    // or know which recipe id to display on search page
// TODO: Comment out just for testing      $.get("/api/recipe_data").then(function(data) {
// TODO: Comment out just for testing        if (data.id) {
// TODO: Comment out just for testing        loadRecipeData(data);
// TODO: Comment out just for testing        }
// TODO: Comment out just for testing        else {
// TODO: Comment out just for testing          clearRecipeData(true);
// TODO: Comment out just for testing        };
// TODO: Comment out just for testing      })
    // .catch(function(error) {
    //   clearRecipeData(true);
    // });
  }) 
});

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
  if ($("#imperial").val()) {
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
            loadRecipeData(currentRecipe);
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
            loadRecipeData(currentRecipe);
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

    if ($("#imperial").val()) {
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
function loadRecipeData(recipeData) {
  // Set value of recipe global
// TODO: commented out just for testing  currentRecipe = recipeData;

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
  if ($("#imperial").val()) {
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
      if ($("#imperial").val()) {
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