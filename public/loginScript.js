let email = document.querySelector(".emailBox");
let password = document.querySelector(".passwordBox");
let SignInButton = document.querySelector(".signInButton");
let user = [];
email.focus();
password.focus();
SignInButton.addEventListener('click', SignIn);
function SignIn() {
    let fetchEmail = email.value;
    let fetchPassword = password.value;
  
    fetch(`/login`, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ email: fetchEmail, password: fetchPassword })
    });
  }
