$(function () {
  setupEnterLoginEvent();
  setDefaultRememberme();
});

function setupEnterLoginEvent() {
  $("#username").on("keyup", function (event) {
    // enter key code = 13
    if (event.keyCode === 13) {
      login();
    }
  });

  $("#password").on("keyup", function (event) {
    // enter key code = 13
    if (event.keyCode === 13) {
      login();
    }
  });
}

function setDefaultRememberme() {
  var isRememberMe = storage.getRememberMe();
  document.getElementById("rememberMe").checked = isRememberMe;
}

function ShowPassword() {
  const ipnElement = document.getElementById("password");
  const btnElement = document.getElementById("eye");
  btnElement.addEventListener("click", function () {
    const currentType = ipnElement.getAttribute("type");
    ipnElement.setAttribute(
      "type",
      currentType === "password" ? "text" : "password"
    );
  });
}

function login() {
  console.log(123);
  // Get username & password
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // validate
  var validUsername = isValidUsername(username);
  var validPassword = isValidPassword(password);

  // format
  if (!validUsername || !validPassword) {
    return;
  }

  // validate username 6 -> 30 characters
  if (
    username.length < 6 ||
    username.length > 50 ||
    password.length < 6 ||
    password.length > 50
  ) {
    // show error message
    showLoginFailMessage();
    return;
  }

  callLoginAPI(username, password);
}

async function callLoginAPI(username, password) {
  var body = {
    username: username,
    password: password,
  };
  await $.ajax({
    url: "http://localhost:8080/api/v1/auth/login",
    type: "POST",
    data: JSON.stringify(body), // body
    contentType: "application/json",
    // beforeSend: function (xhr) {
    //     xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    // },
    success: function (data, textStatus, xhr) {
      console.log(data);
      // save remember me
      var isRememberMe = document.getElementById("rememberMe").checked;
      storage.saveRememberMe(isRememberMe);

      // save data to storage
      // https://www.w3schools.com/html/html5_webstorage.asp
      storage.setItem("TOKEN", data.token);
      storage.setItem("ID", data.user.id);
      storage.setItem("FULL_NAME", data.user.fullName);
      storage.setItem("ROLE", data.user.role);

      if (data.user.role === "CLIENT")
        window.location.replace("http://127.0.0.1:5500/index.html");
    },
    error(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == 401) {
        showLoginFailMessage();
      } else {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    },
  });
}

var error_message_username = "Vui l??ng nh???p username c???a b???n ????? ????ng nh???p!";
var error_message_password = "Vui l??ng nh???p m???t kh???u c???a b???n ????? ????ng nh???p!";

function isValidUsername(username) {
  if (!username) {
    // show error message
    showFieldErrorMessage("incorrect-mess", "username", error_message_username);
    return false;
  }

  hideFieldErrorMessage("incorrect-mess", "username");
  return true;
}

function isValidPassword(password) {
  if (!password) {
    // show error message
    showFieldErrorMessage("incorrect-mess", "password", error_message_password);
    return false;
  }

  hideFieldErrorMessage("incorrect-mess", "password");
  return true;
}

function showLoginFailMessage() {
  showFieldErrorMessage(
    "incorrect-mess",
    "username",
    "????ng nh???p th???t b???i , vui l??ng th??? l???i!"
  );
  showFieldErrorMessage(
    "incorrect-mess",
    "password",
    "????ng nh???p th???t b???i , vui l??ng th??? l???i!"
  );
}

function showFieldErrorMessage(messageId, inputId, message) {
  document.getElementById(messageId).innerHTML = message;
  document.getElementById(messageId).style.display = "block";
  document.getElementById(inputId).style.border = "1px solid red";
}

function hideFieldErrorMessage(messageId, inputId) {
  document.getElementById(messageId).style.display = "none";
  document.getElementById(inputId).style.border = "1px solid #ccc";
}
