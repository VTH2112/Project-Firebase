let active = localStorage.getItem("active");
let userData = JSON.parse(localStorage.getItem("userData"));
let userId = localStorage.getItem("userId");
$(document).ready(() => {
  if (active) {
    // Nav Bar Hanlde
    $("#sign_in").remove();
    $(".nav_bar").append(`
      <a href="#" id='menu'><i class="fas fa-caret-down menu"></i></a>`);
    $(".nav_bar").append(`
    <div id='menu-toggle' style='display: none;'> 
        <ul style='margin:0'>
            <li>
              <a id='user' href='../User/user.html'>
                <img id = 'avatar' src="${userData.avatar}"/>
                <div>
                  <span>${userData.fullName}</span>
                  <span style="color:rgb(138, 139, 141);font-size:90%;font-weight:400;">See your profile</span>
                </div>
              </a>
            </li>
            <hr/>
            <li id='give-feedback' style="margin-top:10px">
              <a href='/' class ='menu-toggle-selection'>
                <div class ='menu-toggle-selection'>
                  <span>
                    <i class="fas fa-exclamation icon-selection" style='font-size:18px;-webkit-text-stroke: 1px white;' ></i> 
                  </span>
                  Give Feedback
                </div> 
              </a>
            </li>
            <hr/>
            <li id='setting' style="margin-top:10px">
            <a href='#' class ='menu-toggle-selection'>
              <div class ='menu-toggle-selection'>
                <span>
                  <i class="fas fa-cog icon-selection"></i>
                </span>
                Setting & Privacy
              </div> 
              <i class="fas fa-chevron-right" style="-webkit-text-stroke: 1px white;"></i>
            </a>
          </li>
          <li id='help-and-support'>
            <a href='#' class ='menu-toggle-selection'>
              <div class ='menu-toggle-selection'>
                <span>
                  <i class="fas fa-question-circle icon-selection"></i>
                </span>
                Help & Support
              </div> 
              <i class="fas fa-chevron-right" style="-webkit-text-stroke: 1px white;"></i>
            </a>
          </li>
          <li id='dark-mode'>
            <a href='#' class ='menu-toggle-selection'>
              <div class ='menu-toggle-selection'>
                <span>
                  <i class="fas fa-moon icon-selection"></i>
                </span>
                Dark Mode
              </div> 
              <i class="fas fa-chevron-right" style="-webkit-text-stroke: 1px white;"></i>
            </a>
          </li>
          <li id='sign_out' style='margin-bottom:0'>
          <a href='/' class ='menu-toggle-selection'>
            <div class ='menu-toggle-selection'>
              <span>
                <i class="fas fa-sign-out-alt icon-selection"></i> 
              </span>
              Log out
            </div> 
          </a>
        </li>
        </ul>
    </div>
    `);
    // MENU TOGGLE HANDLE
    $("#menu").click(() => {
      event.preventDefault();
      if ($("#menu-toggle").is(":visible")) {
        $("#menu").css("background", "#efefef");
        $(".menu").css("color", "#000000");
      } else {
        $("#menu").css("background", "#e1ebfb");
        $(".menu").css("color", "#0162ff");
      }
      $("#menu-toggle").fadeToggle("fast");
    });
    $(document).mouseup((e) => {
      if (
        !$("#menu-toggle").is(e.target) &&
        $("#menu-toggle").has(e.target).length === 0 &&
        !$("#menu").is(e.target) &&
        !$(".menu").is(e.target)
      ) {
        $("#menu-toggle").hide(0);
        $("#menu").css("background", "#efefef");
        $(".menu").css("color", "#000000");
      }
    });
    // MENU TOGGLE SELLECTION
    $("#give-feedback").click(async () => {
      event.preventDefault();
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Message",
        inputPlaceholder: "Type your message here...",
        inputAttributes: {
          "aria-label": "Type your message here",
        },
        showCancelButton: true,
      });

      if (text) {
        Swal.fire(text);
      }
    });
    $("#setting").click(() => {
      event.preventDefault();
    });
    $("#help-and-support").click(() => {
      event.preventDefault();
    });
    $("#dark-mode").click((e) => {
      event.preventDefault();
      $("body").toggleClass("dm-body");
      $(".header").toggleClass("dm-header");
      $(".nav_bar").toggleClass("dm-nav-bar");
      $(".product").toggleClass("dm-product");
      $(".pagination").toggleClass("dm-pagination");
      $(".footer").toggleClass("dm-footer");
      $("#dark-mode").children()[0].classList.toggle("dm-moon");
      $(".icon-selection").toggleClass("dm-icon-selection");
    });
    $("#sign_out").click(() => {
      localStorage.clear();
    });
  }
  // Apply Job Hanlde
  $(".job_detail_apply").click((e) => {
    if (active) {
      let jobId = e.target.parentElement.attributes.id.value;
      if (userData.applyJob.indexOf(jobId) == -1) {
        Swal.fire({
          title: "Apply Success !",
          text: "Wait us to contact you",
          icon: "success",
        });
        userData.applyJob.push(jobId);
        localStorage.setItem("userData", JSON.stringify(userData));
        firebase.firestore().collection("users").doc(userId).update(userData);
      } else {
        Swal.fire({
          title: "Can't Apply !",
          text: "You have already applied",
          icon: "warning",
        });
      }
    } else {
      console.log(active);
      Swal.fire({
        title: "Can't Apply !",
        text: "You are not signed in",
        icon: "error",
      });
    }
    $(".job_detail").hide(0);
    $(".wrap_body").hide(0);
    document.body.style.setProperty('overflow-y', 'overlay', 'important');
  });
});

// localStorage.setItem('userData',JSON.stringify({
//   username:'hieubeo123',
//   password:'c4ca4238a0b923820dcc509a6f75849b', // MD5 CryptoJS.MD5('password').toString() link cdn : đã được thêm sẵn
//   fullName:'ABC XYZ JQK',
//   email : 'abcxyz@gmail.com',
//   phoneNumber:'0123456789',
//   address:'ABCXYZJQK',
//   avatar:'https://petacy.com/wp-content/uploads/2019/10/chuan-bi-nuoi-meo-con.jpg',
//   experience:'',
//   applyJob:['0cdhaMoG4zrzsxZ4Gq8k','13ZKtRMuLyxSsnXxDVNy'],  // id doc
//   pushJob :['0cdhaMoG4zrzsxZ4Gq8k','13ZKtRMuLyxSsnXxDVNy'],
//   type : 'normal',
// }))
