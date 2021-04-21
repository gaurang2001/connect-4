
//Code to set cookies
function setCookie(kvname,kvvalue,validdays) {
  var currdate=new Date();
  currdate.setTime(currdate.getTime() + (validdays*24*60*60*1000));
  var expires= "expires=" + currdate.toGMTString();
  document.cookie=kvname + "=" + kvvalue + ";" + expires + ";path=/";
}

//Form Validation
function check(form){
	if (form.username.value==""){
		alert("Username cannot be empty!")
		return false;
	}
	else if (form.username.value.match(/^[_a-zA-Z][_a-zA-Z0-9]{5}([_a-zA-Z0-9]{6})?/)==null){
		alert("Username has to start with _ or alphabets, and be between 6 to 12 characters with alphanumerics!")
		return false;
	}
	if (form.password.value==""){
		alert("Password cannot be empty!")
		return false;
	}
	else if (form.password.value.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")==null){
		alert("The password must be eight characters or longer, and have at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character and at least 1 numeric character")
		return false;
	}

	if (form.rememberme.checked==true)
		setCookie("username",form.username.value,30);
 
   return true;

}
