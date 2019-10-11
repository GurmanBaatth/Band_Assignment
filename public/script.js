let email = document.querySelector(".emailBox");
let password = document.querySelector(".passwordBox");
let button = document.querySelector(".registerButton");
let user = [];
email.focus();
password.focus();

button.addEventListener('click', register);


function register() {
  let fetchEmail = email.value;
  let fetchPassword = password.value;

  fetch(`/register`, {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    body: JSON.stringify({ email: fetchEmail, password: fetchPassword })
  }).then(function(data) {
    if (data.status != 200) {
      console.error("Internal Server Error");
      return;
    }
    return data.json().then(function(fetchedData) {
      localStorage.setItem("user", JSON.stringify(user));
    });
  });
}
