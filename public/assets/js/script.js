$(document).ready(function(){
  $("#main-content").load("add.html", function(){
    $(".dropdown-trigger").dropdown();
    $("select").formSelect();
  }) 
});