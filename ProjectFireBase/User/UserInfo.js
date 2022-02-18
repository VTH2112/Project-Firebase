class UserInfo extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const userDataFromLocalStorage = JSON.parse(
      localStorage.getItem("userData")
    );
    this.shadow.innerHTML = `
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <style>${UserInfoStyle}</style>
    <!-- Profile Info -->
    <div class="user-content-group">
      <form class = 'user-infor'>
        <div class="mb-3">
          <label for="user-fullname" class="form-label">Name</label>
          <input type="text" class="form-control" id="user-fullname" value="${userDataFromLocalStorage.fullName}">
        </div>
        <div class="mb-3">
          <label for="user-email" class="form-label">Email</label>
          <div class="input-group">
            <input type="email" class="form-control " pattern = '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$' id="user-email" value="${userDataFromLocalStorage.email}">
          </div>
        </div>
        <div class="mb-3">
          <label for="user-phone-number" class="form-label">Phone number</label>
          <div class="input-group">
            <input type="text" class="form-control " name='phone' id="user-phone-number" value="${userDataFromLocalStorage.phoneNumber}">
          </div>
        </div>
        <div class="mb-3">
          <label for="user-address" class="form-label">Address</label>
          <input type="text" class="form-control " id="user-address" value="${userDataFromLocalStorage.address}">
        </div>
        <div class="mb-3">
          <label for="user-work-experience" class="form-label">Experience</label>
          <textarea placeholder="Tell us your past experience." class="form-control"
            id="user-work-experience">${userDataFromLocalStorage.experience}</textarea>
        </div>
        <div>
          <button type="submit" class="btn btn-primary update-profile-btn" disabled>Update Profile</button>
        </div>
      </form>
    </div>
    <!-- Change Username/Password -->
    <div class="user-content-group">
      <p>Your username is <strong>@${userDataFromLocalStorage.username}</strong>.</p>
      <button type="submit" class="btn btn-primary change-password">Change Password</button>
    </div>
    <!-- Delete Account -->
    <div class="user-content-group">
      <button type="submit" class="btn btn-outline-danger">Delete Account</button>
      <p id="font-size14" class="mt-2 mb-0">Do something you shouldn't do? This button will help you.
      </p>
    </div>
    `;
    let fullName = this.shadowRoot.querySelector("#user-fullname");
    let email = this.shadowRoot.querySelector("#user-email");
    let phoneNumber = this.shadowRoot.querySelector("#user-phone-number");
    let address = this.shadowRoot.querySelector("#user-address");
    let experience = this.shadowRoot.querySelector("#user-work-experience");
    let unlock = [fullName, email, phoneNumber, address, experience];
    let isUnlock = 0;
    unlock.forEach((doc) => {
      doc.addEventListener("keyup", () => {
        isUnlock = 0;
        if (fullName.value.trim()!= userData.fullName) {
          ++isUnlock;
        }
        if (email.value.trim() != userData.email) {
          ++isUnlock;
        }
        if (phoneNumber.value.trim() != userData.phoneNumber) {
          ++isUnlock;
        }
        if (address.value.trim() != userData.address) {
          ++isUnlock;
        }
        if (experience.value.trim() != userData.experience) {
          ++isUnlock;
        }
        if (isUnlock) {
          this.shadowRoot.querySelector(".update-profile-btn").disabled = false;
        } else {
          this.shadowRoot.querySelector(".update-profile-btn").disabled = true;
        }
      });
    });
    let userInfor = this.shadowRoot.querySelector(".user-infor");
    userInfor.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      let isVnPhone =
        /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
      if (!isVnPhone.test(phoneNumber.value) && phoneNumber.value != "") {
        Swal.fire({
          title: "Your phone number is invalid !",
          text: "Please try again",
          icon: "error",
        });
        return false;
      }
      $(".loader-wrapper").show(0);
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          fullName: `${fullName.value}`,
          email: `${email.value}`,
          phoneNumber: `${phoneNumber.value}`,
          address: `${address.value}`,
          experience: `${experience.value}`,
        })
        .then(() => {
          userData.fullName = fullName.value;
          userData.email = email.value;
          userData.phoneNumber = phoneNumber.value;
          userData.address = address.value;
          userData.experience = experience.value;
          localStorage.setItem("userData", JSON.stringify(userData));
          window.location.href = "./user.html";
        })
        .catch((e) => {
          Swal.fire({
            title: "Some thing get wrong !",
            text: "Please try again later",
            icon: "error",
          });
        });
    });
    this.shadowRoot
      .querySelector(".change-password")
      .addEventListener("click", async () => {
        let password = await Swal.fire({
          title: "Enter your password",
          html:
            '<input id="swal-input1" type="password" class="swal2-input" placeholder="Old password">' +
            '<input id="swal-input2" type="password" class="swal2-input" placeholder="New password">' +
            '<input id="swal-input3" type="password" class="swal2-input" placeholder="Confirm password">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById("swal-input1").value,
              document.getElementById("swal-input2").value,
              document.getElementById("swal-input3").value,
            ];
          },
        });
        if (CryptoJS.MD5(password.value[0]).toString() != userData.password) {
          Swal.fire(`Old password is not correct`);
          return false;
        }
        if (password.value[1] != password.value[2]) {
          Swal.fire(`Confirm password is not correct`);
          return false;
        }
        firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .update({
            password: `${CryptoJS.MD5(password.value[1]).toString()}`,
          })
          .then(() => {
            userData.password = CryptoJS.MD5(password.value[1]).toString();
            localStorage.setItem("userData", JSON.stringify(userData));
            Swal.fire({
              title: "Done !",
              icon: "success",
            });
          })
          .catch((e) => {
            Swal.fire({
              title: "Some thing get wrong !",
              text: "Please try again later",
              icon: "error",
            });
          });
      });
  }
}

const UserInfoStyle = `
  .user-content-group {
    background-color: #fff;
    border-radius: 6px;
    padding: 20px;
    margin: 0 0 30px 0;
  }
  
  #font-size14 {
    font-size: 14px;
  }

  .user-content-group #user-work-experience {
    height: 125px;
    resize: none;
  }
`;

customElements.define("user-info", UserInfo);
