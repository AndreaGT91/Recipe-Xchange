// Global array for stashing ingredient list for selected recipe
let ingredientArray = [];

// TODO: for testing only
ingredientArray = [
  {id: 0,
    name: "All-purpose flour",
    imperialQty: 2,
    imperialUnit: "Cup",
    metricQty: 250,
    metricUnit: "g",
    calories: 910,
    protein: 26,
    carbs: 190,
    fat: 2.4,
    recipeID: 0},
  {id: 1,
    name: "Sugar",
    imperialQty: 0.75,
    imperialUnit: "Cup",
    metricQty: 150,
    metricUnit: "g",
    calories: 576,
    protein: 0,
    carbs: 150,
    fat: 0,
    recipeID: 0},
  {id: 2,
    name: "Butter, softened",
    imperialQty: 0.5,
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
    $("#deleteBtn").click(deleteIngredient);
    $(".tr").click(editIngredient);

    // TODO: Need some way to know if we are adding new recipe, or updating existing recipe (and its id),
    // or know which recipe id to display on search page
  }) 
});

// Save button click event - adds/updates recipe and all ingredients
function saveRecipe(event) {

};

// Reset button click event - clears all fields, including ingredients and nutrition info
function resetForm(event) {

};

// Ingredient Save click event - adds/updates ingredient
function saveIngredient(event) {
  calculateNutrition();
};

// Ingredient Delete click event - deletes selected ingredient
function deleteIngredient(event) {
  calculateNutrition();
};

// Ingredient table row click event - edit ingredient
function editIngredient(event) {
  // Do nothing if they click on header row
  if ($(this).rowIndex > 0) {
    ingredientArray[$(this).rowIndex]
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

    let nums = number.split("/",2);
    let leftSide = nums[0].split(" ",2);

    if (nums.length === 2) {
      denominator = parseInt(nums[1]);
    };

    if (leftSide.length === 1) {
      numerator = parseInt(leftSide[0]);
    }
    else {
      wholeNum = parseInit(leftSide[0]);
      numerator = parseInt(leftSide[1]);
    };

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

  // Only fractional values allowed in cooking
  switch (fraction) {
    case 0.25: 
      fractionString = "1/4";
      break;
    case 0.33:
      fractionString = "1/3";
      break;
    case 0.5:
      fractionString = "1/2";
      break;
    case 0.67:
      fractionString = "2/3";
      break;
    case 0.75:
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