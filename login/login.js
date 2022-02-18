$(document).ready(() => {
  // sign in hanlde
  let formSignIn = document.querySelector(".needs-validation");
  formSignIn.addEventListener("submit", async () => {
    event.preventDefault();
    event.stopPropagation();
    const username = $("#username")[0].value;
    const password = $("#password")[0].value;
    if (username == "admin" && password == "123456") {
      window.location.href = "../Admin/admin.html";
      return false;
    }
    if (formSignIn.checkValidity()) {
      const userRawData = await firebase
        .firestore()
        .collection("users")
        .where("username", "==", username)
        .get();
      if (!userRawData.size) {
        $("#username").addClass("is-invalid");
        return false;
      }
      const userData = userRawData.docs[0].data();
      const id = userRawData.docs[0]._delegate._key.path.segments[6];
      if (CryptoJS.MD5(password).toString() == userData.password) {
        localStorage.setItem("userId", id);
        localStorage.setItem("active", 1);
        localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = "/";
      } else {
        $("#password").addClass("is-invalid");
      }
    }
    formSignIn.classList.add("was-validated");
  });

  // sign up handle
  let formSignUp = document.querySelector(".sign-up-form");
  formSignUp.addEventListener("submit", async () => {
    event.preventDefault();
    event.stopPropagation();
    if (formSignUp.checkValidity()) {
      const userName = $("#username-signup")[0].value;
      let isUserNameExit = await firebase
        .firestore()
        .collection("users")
        .where("username", "==", userName)
        .get();
      if (isUserNameExit.size) {
        $("#username-signup").addClass("is-invalid");
        return false;
      }
      const passWord = $("#password-signup")[0].value;
      const rePassWord = $("#confirm-password-signup")[0].value;
      if (passWord != rePassWord) {
        $("#confirm-password-signup").addClass("is-invalid");
        return false;
      }
      $(".loader-wrapper").show(0);
      const firstName = $("#first-name")[0].value;
      const lastName = $("#last-name")[0].value;
      const userData = {
        username: userName,
        password: `${CryptoJS.MD5(passWord).toString()}`,
        fullName: `${lastName} ${firstName}`,
        email: "",
        phoneNumber: "",
        address: "",
        experience: "",
        pushJob: [],
        applyJob: [],
        type: "normal",
        avatar:
          "https://scontent-hkt1-1.xx.fbcdn.net/v/t1.30497-1/p100x100/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-3&_nc_sid=7206a8&_nc_ohc=nyKhkR6NhPQAX-CeCtc&_nc_ht=scontent-hkt1-1.xx&oh=175d3911ecc6cee195e7c7ca5a9efc13&oe=6122F2D1",
        background:
          "https://media.tarkett-image.com/large/TH_24567080_24594080_24596080_24601080_24563080_24565080_24588080_001.jpg",
      };
      await firebase.firestore().collection("users").add(userData);
      window.location.href = "./login.html";
    }
    formSignUp.classList.add("was-validated");
  });
  //Forgot password handle
  $("#forgot").click(forgotPassword);
  async function forgotPassword() {
    const { value: email } = await Swal.fire({
      title: "We will reset your password",
      input: "email",
      inputLabel: "Your email address : ",
      inputPlaceholder: "Enter your email address",
    });
    if (email) {
      Swal.fire(`Entered email: ${email}`);
    }
  }
  // hide and show handle
  $("#sign-up-btn").click(() => {
    $(".sign-in-div").slideUp("easing");
    $(".nav-bar-wrap").slideUp("easing");
    $(".sign-up-div").slideDown("easing");
    $(".back-div").slideDown("easing");
  });
  $(".back-btn").click(() => {
    $(".sign-in-div").slideDown("easing");
    $(".nav-bar-wrap").slideDown("easing");
    $(".sign-up-div").slideUp("easing");
    $(".back-div").slideUp("easing");
  });
});

// Regrex
function validateUsername(input) {
  const re = /^[a-zA-Z0-9]{6,30}$/;
  return re.test(String(input));
}
function validatePassword(input) {
  const re = /^[A-Za-z]\w{6,14}$/;
  return re.test(String(input));
}
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
