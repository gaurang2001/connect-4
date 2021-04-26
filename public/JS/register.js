//Code for data validation
function usernamevalidation(field) {
  var usern = field.value;
  var pass_msg = document.getElementById("unamevalidation");
  if (usern === "") {
    pass_msg.innerText = "Username is required.";
    return false;
  }
  else if (usern.match(/^[_a-zA-Z][_a-zA-Z0-9]{3,11}$/) === null) {
    pass_msg.innerText = "Username has to start with _ or alphabets, and be between 4 to 12 characters with alphanumerics!";
    return false;
  }
  else {
    pass_msg.innerText = "";
    return true;
  }

}

function passwordvalidation(field) {
  var pass = field.value;
  var pass_msg = document.getElementById("pwdcheck");
  if (pass === "") {
    pass_msg.innerText = "Password is required.";
    return false;
  }
  else if (pass.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})") === null) {
    pass_msg.innerText = "The password must be eight characters or longer, and have at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character and at least 1 numeric character";
    return false;
  }
  else {
    pass_msg.innerText = "";
    return true;
  }

}

function passwordsmatching(field) {
  var pwd = field.value;
  var pass_msg = document.getElementById("pwdsmatch");
  if (pwd === "") {
    pass_msg.innerText = "Password confirmation is required.";
    return false;
  }
  else if (pwd.localeCompare(field.form.pass.value) != 0) {
    pass_msg.innerText = "Passwords don't match!";
    return false;
  }
  else {
    pass_msg.innerText = "";
    return true;
  }

}

//Form validation
function check(form) {

  return usernamevalidation(form.uname) && passwordvalidation(form.pass) && passwordsmatching(form.re_pass);

}


//Code for data validation
function updateusernamevalidation(field) {
  var usern = field.value;
  var pass_msg = document.getElementById("unamevalidation");

  if (usern.match(/^[_a-zA-Z][_a-zA-Z0-9]{3,11}$/) === null && usern != "") {
    pass_msg.innerText = "Username has to start with _ or alphabets, and be between 4 to 12 characters with alphanumerics!";
    return false;
  }
  else {
    pass_msg.innerText = "";
    return true;
  }

}

function updatepasswordvalidation(field) {
  var pass = field.value;
  var pass_msg = document.getElementById("pwdcheck");
  if (pass.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})") === null && pass != "") {
    pass_msg.innerText = "The password must be eight characters or longer, and have at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character and at least 1 numeric character";
    return false;
  }
  else {
    pass_msg.innerText = "";
    return true;
  }

}

function checkupdate(form) {



  return updateusernamevalidation(form.username) && updatepasswordvalidation(form.password);

}