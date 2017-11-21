$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
  	if (data.username){
  		$("#login-side").html("<li class='navbar-brand'><span class='glyphicon glyphicon-user'></span> Welcome, " + data.username + "</li> <li><a href='/logout'><span class='glyphicon glyphicon-log-in'></span> Log out</a></li>");
  	   $("#list").css("display", "block");
       $("#profiles").css("display", "block");
       $("#profiles").show();
       $("#list").show();
    }
  	else{
    $("#login-side").html("<li><a href='/signin'><span class='glyphicon glyphicon-user'></span> Sign Up</a></li> <li><a href='/login'><span class='glyphicon glyphicon-log-in'></span> Login</a></li>");
       }
  });
});
