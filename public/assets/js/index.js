$(document).ready(function () {
  // Materialize initialization
  $(".dropdown-trigger").dropdown();
  $("select").formSelect();
  getCategories();

  // Get current user information
  $.get("/api/currentuser", function (data) {
    // If user logged in, update navbar
    if (data.id) {
      let currentUser = data;
      $("#sign-in").hide();
      if (screen.width <= 400) {
        $("#mobile-menu").show();
      }
      else {
        $("#user-name").show();
        $("#user-name").text("Welcome " + currentUser.firstName + " " + currentUser.lastName);
      };
    };
  });
});

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
  let fraction = decimal - wholeNum;
  let fractionString = "";

  // 1/4, 1/3, 1/2, 2/3, and 3/4 are the only fractional values allowed in cooking
  if (fraction >= 0.85) {
    wholeNum++;  // Need to just round up to next whole number
  }
  else if (fraction >= 0.7) {
    fractionString = "3/4";
  }
  else if (fraction >= 0.6) {
    fractionString = "2/3";
  }
  else if (fraction >= 0.4) {
    fractionString = "1/2";
  }
  else if (fraction >= 0.3) {
    fractionString = "1/3";
  }
  else if (fraction >= 0.125) {
    fractionString = "1/4";
  }; // Default is to leave fractionString as empty string

  if (wholeNum > 0) {
    if (fractionString === "") {
      return wholeNum.toString()
    }
    else {
      return wholeNum.toString() + " " + fractionString
    };
  }
  else {
    return fractionString;
  };
};

function getCategories() {
  $("select").formSelect();
  $(".categoriesOptions").on("contentChanged", function () {
    $(this).formSelect();
  });

  $.get("/api/categories", function (data) {
    for (let i = 0; i < data.length; i++) {
      let newOption = $(`<option value="${data[i].id}">${data[i].name}</option>`)
      $(".categoriesOptions").append(newOption)
    }
    $(".categoriesOptions").trigger("contentChanged");
  });
};

let recipesArr = [];

$(document).on("click", "#searchBtn", function (event) {
  event.preventDefault();
  $("#recipeTitle").empty();
  $("#recipe-desc").empty();
  $("#submitted-by").empty();
  $("#source").empty();
  $("#prep-time").empty();
  $("#cook-time").empty();
  $("#oven-temp").empty();
  $("#num-servings").empty();
  $("#ingredient-table").empty();
  $("#instructions").empty();
  $("#calories").empty();
  $("#protein").empty();
  $("#carbohydrates").empty();
  $("#fat").empty();
  recipesArr = [];

  let category = $(".categoriesOptions").val();
  let title = $("#keyword").val().trim();

  if (title === "") {
    title = null;
  };

  let recipesByCategory;
  let recipesbyTitle;

  search(category, title, handleSearchResults);

  function handleSearchResults(categoryData, titleData) {
    if (categoryData !== "" && categoryData !== undefined && categoryData !== null) {
      recipesByCategory = categoryData;
    } else {
      recipesByCategory = null;
    }

    if (titleData !== "" && titleData !== undefined && titleData !== null) {
      recipesbyTitle = titleData;
    } else {
      recipesbyTitle = null;
    }

    let categoryIDArr = [];
    let titleIDArr = [];

    if (recipesByCategory !== null) {
      for (let i = 0; i < recipesByCategory.length; i++) {
        categoryIDArr.push(recipesByCategory[i].id)
      };
    } else {
      categoryIDArr = null;
    }

    if (recipesbyTitle) {
      for (let i = 0; i < recipesbyTitle.length; i++) {
        titleIDArr.push(recipesbyTitle[i].id)
      };
    } else {
      titleIDArr = null;
    }

    if (categoryIDArr !== null) {
      for (let i = 0; i < recipesByCategory.length; i++) {
        if (titleIDArr !== null && titleIDArr.includes(categoryIDArr[i])) {
          recipesArr.push(recipesByCategory[i])
        } else if (titleIDArr === null) {
          recipesArr.push(recipesByCategory[i])
        }
      }
    } else if (titleIDArr !== null) {
      for (let i = 0; i < recipesbyTitle.length; i++) {
        if (categoryIDArr === null) {
          recipesArr.push(recipesbyTitle[i])
        }
      }
    }

    let temperature;

    if ($("#imperial")[0].checked === true) {
      temperature = recipesArr[0].ovenTempF + "°F";
    } else {
      temperature = recipesArr[0].ovenTempC + "°C"
    }

    $("#recipeTitle").text(recipesArr[0].title);
    $("#recipe-desc").val(recipesArr[0].description);
    $("#desc-label").addClass("active");
    $("#submitted-by").val(recipesArr[0].User.firstName + " " + recipesArr[0].User.lastName);
    $("#submitted-label").addClass("active");
    $("#source").val(recipesArr[0].source);
    $("#source-label").addClass("active");
    $("#prep-time").val(recipesArr[0].prepTime + " mins");
    $("#prep-label").addClass("active");
    $("#cook-time").val(recipesArr[0].cookTime + " mins");
    $("#cook-label").addClass("active");
    $("#oven-temp").val(temperature);
    $("#temp-label").addClass("active");
    $("#num-servings").val(recipesArr[0].numServings);
    $("#servings-label").addClass("active");
    $("#instructions").val(recipesArr[0].instructions);
    $("#instructions-label").addClass("active");

    let ingredients = recipesArr[0].Ingredients
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const ingredientTable = $("#ingredient-table")
    $(ingredientTable).empty();

    for (let i = 0; i < ingredients.length; i++) {
      let qty;
      let unit;

      if ($("#imperial")[0].checked === true) {
        qty = getFraction(ingredients[i].imperialQty);
        unit = ingredients[i].imperialUnit;
      } else {
        qty = ingredients[i].metricQty;
        unit = ingredients[i].metricUnit;
      }

      let td1 = $("<td>").text(qty)
      let td2 = $("<td>").text(unit)
      let td3 = $("<td>").text(ingredients[i].name)
      let tr = $("<tr>")

      $(tr).append(td1)
      $(tr).append(td2)
      $(tr).append(td3)
      $(ingredientTable).append(tr)

      totalCalories += parseInt(ingredients[i].calories)
      totalProtein += parseInt(ingredients[i].protein)
      totalCarbs += parseInt(ingredients[i].carbs)
      totalFat += parseInt(ingredients[i].fat)

      let calories = totalCalories / recipesArr[0].numServings;
      let protein = totalProtein / recipesArr[0].numServings;
      let carbs = totalCarbs / recipesArr[0].numServings;
      let fat = totalFat / recipesArr[0].numServings;
      $("#calories").val(calories);
      $("#calories-label").addClass("active");
      $("#protein").val(protein);
      $("#protein-label").addClass("active");
      $("#carbohydrates").val(carbs);
      $("#carbs-label").addClass("active");
      $("#fat").val(fat);
      $("#fat-label").addClass("active");

      M.textareaAutoResize($('#recipe-desc'));
      M.textareaAutoResize($('#instructions'));
      M.updateTextFields();
    }

    return recipesArr
  };
});

let currentIndex = 0;

$(document).on("click", "#imperial", function (event) {
  updateSearchDom(currentIndex);
});

$(document).on("click", "#prevBtn", function (event) {
  event.stopPropagation();

  if (currentIndex === 0) {
    currentIndex = recipesArr.length - 1
  } else {
    currentIndex--
  }

  console.log("Index: " + currentIndex)
  updateSearchDom(currentIndex)

  return currentIndex;
});

$(document).on("click", "#nextBtn", function (event) {
  event.stopPropagation();

  if (currentIndex === recipesArr.length - 1) {
    currentIndex = 0
  } else {
    currentIndex++
  }

  updateSearchDom(currentIndex)

  return currentIndex;
});

function updateSearchDom(currentIndex) {
  let temperature;

  if ($("#imperial")[0].checked === true) {
    temperature = recipesArr[currentIndex].ovenTempF + "°F";
  } else {
    temperature = recipesArr[currentIndex].ovenTempC + "°C"
  }

  $("#recipeTitle").text(recipesArr[currentIndex].title);
  $("#recipe-desc").val(recipesArr[currentIndex].description);
  $("#desc-label").addClass("active");
  $("#submitted-by").val(recipesArr[currentIndex].User.firstName + " " + recipesArr[currentIndex].User.lastName);
  $("#submitted-label").addClass("active");
  $("#source").val(recipesArr[currentIndex].source);
  $("#source-label").addClass("active");
  $("#prep-time").val(recipesArr[currentIndex].prepTime + " mins");
  $("#prep-label").addClass("active");
  $("#cook-time").val(recipesArr[currentIndex].cookTime + " mins");
  $("#cook-label").addClass("active");
  $("#oven-temp").val(temperature);
  $("#temp-label").addClass("active");
  $("#num-servings").val(recipesArr[currentIndex].numServings);
  $("#servings-label").addClass("active");
  $("#instructions").val(recipesArr[currentIndex].instructions);
  $("#instructions-label").addClass("active");

  let ingredients = recipesArr[currentIndex].Ingredients
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  const ingredientTable = $("#ingredient-table")
  $(ingredientTable).empty();

  for (let i = 0; i < ingredients.length; i++) {
    let qty;
    let unit;

    if ($("#imperial")[0].checked === true) {
      qty = getFraction(ingredients[i].imperialQty);
      unit = ingredients[i].imperialUnit;
    } else {
      qty = ingredients[i].metricQty;
      unit = ingredients[i].metricUnit;
    }

    let td1 = $("<td>").text(qty)
    let td2 = $("<td>").text(unit)
    let td3 = $("<td>").text(ingredients[i].name)
    let tr = $("<tr>")

    $(tr).append(td1)
    $(tr).append(td2)
    $(tr).append(td3)
    $(ingredientTable).append(tr)

    totalCalories += parseInt(ingredients[i].calories)
    totalProtein += parseInt(ingredients[i].protein)
    totalCarbs += parseInt(ingredients[i].carbs)
    totalFat += parseInt(ingredients[i].fat)

    let calories = totalCalories / recipesArr[currentIndex].numServings;
    let protein = totalProtein / recipesArr[currentIndex].numServings;
    let carbs = totalCarbs / recipesArr[currentIndex].numServings;
    let fat = totalFat / recipesArr[currentIndex].numServings;
    $("#calories").val(calories);
    $("#calories-label").addClass("active");
    $("#protein").val(protein);
    $("#protein-label").addClass("active");
    $("#carbohydrates").val(carbs);
    $("#carbs-label").addClass("active");
    $("#fat").val(fat);
    $("#fat-label").addClass("active");

    M.textareaAutoResize($('#recipe-desc'));
    M.textareaAutoResize($('#instructions'));
    M.updateTextFields();
  }
}

function search(categoryID, title, cb) {
  let categoryData;
  let titleData;

  if (categoryID !== null && title !== null) {
    $.get(`/api/recipesByCategory/${categoryID}`)
      .done(function (data) {
        categoryData = data

        $.get(`/api/recipesbytitle/${title}`)
          .done(function (data) {
            titleData = data

            cb(categoryData, titleData)
          })
          .fail(function (err) {
            console.log(err)
          })
      })
      .fail(function (err) {
        console.log(err)
      });

  } else if (categoryID !== null && title === null) {
    $.get(`/api/recipesByCategory/${categoryID}`)
      .done(function (data) {
        categoryData = data
        titleData = null

        cb(categoryData, titleData)
      })
      .fail(function (err) {
        console.log(err)
      });

  } else if (categoryID === null && title !== null) {
    $.get(`/api/recipesbytitle/${title}`)
      .done(function (data) {
        titleData = data
        categoryData = null

        cb(categoryData, titleData)
      })
      .fail(function (err) {
        console.log(err)
      });
  };
};