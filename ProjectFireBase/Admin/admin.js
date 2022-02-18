// const pushJobData = () => {
//     try {
//       firebase.firestore().collection("jobs").add({
//         status: "pending",
//         logo: "https://picsum.photos/200",
//         name: "User Dev 10",
//         overview:
//           "We believe that design (and you) will be critical to the company's success. You will work with our founders and our early customers to help define and build our product functionality, while maintaining the quality bar that customers have come to expect from modern SaaS applications. You have a strong background in product design with a quantitavely anf qualitatively analytical mindset. You will also have the opportunity to craft our overall product and visual identity and should be comfortable to flex into working.",
//         description: "",
//         type_tag: "Full Time",
//         salary_tag: "3600",
//         level_tag: "Junior Level",
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   pushJobData()
$(document).ready(function () {
  $(".nav-sidebar li a").click(function () {
    $(".nav-sidebar").find(".nav-active").removeClass("nav-active");
    $(this).parent().addClass("nav-active");
  });

  $(".user-click").click(function () {
    $(".user-page").fadeIn(300);
    $(".pending-page").hide(0);
    $(".active-page").hide(0);
    $(".reject-page").hide(0);
  });
  $(".active-page-show").click(function () {
    $(".active-page").fadeIn(300);
    $(".user-page").hide(0);
    $(".reject-page").hide(0);
    $(".pending-page").hide(0);
  });
  $(".pending-page-show").click(function () {
    $(".pending-page").fadeIn(300);
    $(".user-page").hide(0);
    $(".reject-page").hide(0);
    $(".active-page").hide(0);
  });
  $(".reject-page-show").click(function () {
    $(".reject-page").fadeIn(300);
    $(".user-page").hide(0);
    $(".pending-page").hide(0);
    $(".active-page").hide(0);
  });
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase().trim();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().trim().indexOf(value) > -1);
    });
  });
});
let confirmEdit = document.querySelectorAll(".confirmEdit");
let inputId = document.querySelectorAll(".inputId");
let inputEmail = document.querySelectorAll(".inputEmail");
let inputPassword = document.querySelectorAll(".inputPassword");
let confirmPassword = document.querySelectorAll(".confirmPassword");
let docData = "";
const HAVEJOB = (docData) => {
  return `
    <div class = 'd-flex justify-content-center pb-4 job'>
      <job-card-active id="${docData.id}" logo="${docData.logo}" name="${docData.name}" overview="${docData.overview}" description="${docData.description}" type_tag="${docData.type_tag}" salary_tag="${docData.salary_tag}" level_tag="${docData.level_tag}"></job-card-active>
    </div>
    `;
};
const Pending = (docData) => {
  return `
    <div class = 'd-flex justify-content-center pb-4 job'>
      <job-card-pending id="${docData.id}" logo="${docData.logo}" name="${docData.name}" overview="${docData.overview}" description="${docData.description}" type_tag="${docData.type_tag}" salary_tag="${docData.salary_tag}" level_tag="${docData.level_tag}"></job-card-pending>
    </div>
    `;
};
const Reject = (docData) => {
  return `
    <div class = 'd-flex justify-content-center pb-4 job'>
      <job-card-reject id="${docData.id}" logo="${docData.logo}" name="${docData.name}" overview="${docData.overview}" description="${docData.description}" type_tag="${docData.type_tag}" salary_tag="${docData.salary_tag}" level_tag="${docData.level_tag}"></job-card-reject>
    </div>
    `;
};
const USER = (docData) => {
  return `<tr>
  <td style='overflow:hidden;text-overflow: ellipsis;padding-left:20px !important'>${docData.id}</td>
  <td style='overflow:hidden;text-overflow: ellipsis;'>${docData.fullName}</td>
  <td style='overflow:hidden;text-overflow: ellipsis;'>${docData.phoneNumber}</td>
  <td style='overflow:hidden;text-overflow: ellipsis;'>${docData.email}</td>
  <td style='overflow:hidden;text-overflow: ellipsis;'>${docData.password}</td>
  <td><ul class="nav"><li class="nav-item"  data-toggle="modal" data-target="#edit"><a href="#" class="nav-link"><i class="fas fa-pencil-alt edit "></i></a></li><li class="nav-item"><a href="#" class="nav-link"><i class="fas fa-trash-alt delete"></i></a></li></ul></td></tr>`;
};
let jobDataActive = [];
let getJobDataActive = async () => {
  jobDataActive = [];
  try {
    const jobRawData = await firebase
      .firestore()
      .collection("jobs")
      .where("status", "==", "active")
      .get();
    jobRawData.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc._delegate._key.path.segments[6];
      jobDataActive.push(docData);
    });
  } catch (e) {
    console.log(e);
  }
};

let jobDataPending = [];
let getJobDataPending = async () => {
  jobDataPending = [];
  try {
    const jobRawData = await firebase
      .firestore()
      .collection("jobs")
      .where("status", "==", "pending")
      .get();
    jobRawData.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc._delegate._key.path.segments[6];
      jobDataPending.push(docData);
    });
  } catch (e) {
    console.log(e);
  }
};
let jobDataReject = [];
let getJobDataReject = async () => {
  jobDataReject = [];
  try {
    const jobRawData = await firebase
      .firestore()
      .collection("jobs")
      .where("status", "==", "reject")
      .get();
    jobRawData.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc._delegate._key.path.segments[6];
      jobDataReject.push(docData);
    });
  } catch (e) {
    console.log(e);
  }
};
// getJobDataActive()
// getJobDataPending()
// getJobDataReject()
let userdata = [];
let getUserData = async () => {
  userdata = [];
  try {
    const userRawdata = await firebase.firestore().collection("users").get();
    userRawdata.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc._delegate._key.path.segments[6];
      userdata.push(docData);
    });
    console.log(userdata);
  } catch (e) {
    console.log(e);
  }
};
firebase
  .firestore()
  .collection("users")
  .onSnapshot((snapShot) => {
    if (snapShot.docChanges()) {
      renderUserFromDB();
    }
  });

firebase
  .firestore()
  .collection("jobs")
  .where("status", "==", "active")
  .onSnapshot((snapShot) => {
    if (snapShot.docChanges()) {
      renderActiveFromDB();
    }
  });

firebase
  .firestore()
  .collection("jobs")
  .where("status", "==", "pending")
  .onSnapshot((snapShot) => {
    if (snapShot.docChanges()) {
      renderPendingFromDB();
    }
  });
firebase
  .firestore()
  .collection("jobs")
  .where("status", "==", "reject")
  .onSnapshot((snapShot) => {
    if (snapShot.docChanges()) {
      renderRejectFromDB();
    }
  });

const renderActiveFromDB = async () => {
  document.querySelector(".active-page").innerHTML = "";
  try {
    await getJobDataActive();
    jobDataActive.forEach((docData) => {
      document.querySelector(".active-page").innerHTML += HAVEJOB(docData);
    });
  } catch (e) {
    console.log(e);
  }
};

const renderPendingFromDB = async () => {
  document.querySelector(".pending-page").innerHTML = "";
  try {
    await getJobDataPending();
    jobDataPending.forEach((docData) => {
      document.querySelector(".pending-page").innerHTML += Pending(docData);
    });
  } catch (e) {
    console.log(e);
  }
};

const renderRejectFromDB = async () => {
  document.querySelector(".reject-page").innerHTML = "";
  try {
    await getJobDataReject();
    jobDataReject.forEach((docData) => {
      document.querySelector(".reject-page").innerHTML += Reject(docData);
    });
  } catch (e) {
    console.log(e);
  }
};

function validatePassword(input) {
  const re = /^[A-Za-z]\w{6,14}$/;
  return re.test(String(input));
}
const renderUserFromDB = async () => {
  let tbody = document.querySelectorAll("tbody");
  tbody[0].innerHTML = "";
  try {
    await getUserData();
    userdata.forEach((user) => {
      USER(user);
      tbody[0].innerHTML += USER(user);
    });
    let editbtn = document.querySelectorAll(".edit");
    let removeBtn = document.querySelectorAll(".delete");
    console.log(removeBtn);
    editbtn.forEach((edit) => {
      edit.addEventListener("click", (ea) => {
        inputId[0].value = ea.path[5].children[0].innerText;
        inputEmail[0].value = ea.path[5].children[3].innerText;
        confirmEdit[0].addEventListener("click", (e) => {
          userdata.forEach((user) => {
            console.log(user.id);
            if (inputId[0].value == user.id) {
              if (
                inputPassword[0].value == confirmPassword[0].value &&
                confirmPassword[0].value != ""
              ) {
                confirmEdit[0].dataset.dismiss = "modal";
                const update = async () => {
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(user.id)
                    .update({
                      password: `${CryptoJS.MD5(
                        inputPassword[0].value
                      ).toString()},`,
                      email: `${inputEmail[0].value}`,
                    });
                  swal({
                    title: " Your password has been changed",
                    icon: "success",
                  });
                };
                update();
              } else if (confirmPassword[0].value == "") {
                confirmEdit[0].dataset.dismiss = "none";
                swal({
                  title: "Your password must be fill",
                  text: "Try again",
                  icon: "error",
                });
              } else {
                confirmEdit[0].dataset.dismiss = "none";
                swal({
                  title: "Your password is incorrect!",
                  text: "Try again",
                  icon: "error",
                });
              }
            }
          });
        });
      });
    });
    removeBtn.forEach((remove) => {
      remove.addEventListener("click", (e) => {
        userdata.forEach((user) => {
          if (e.path[5].children[0].innerText == user.id) {
            Swal.fire({
              title: "Do you want to delete this account?",
              showDenyButton: true,
              confirmButtonText: `Yes`,
              denyButtonText: `No`,
              customClass: {
                confirmButton: "order-2",
                denyButton: "order-3",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(user.id)
                  .delete()
                  .then(() => {
                    Swal.fire("Saved!", "", "success");
                  });
              } else if (result.isDenied) {
                Swal.fire("Account is not deleted", "", "info");
              }
            });
          }
        });
      });
    });
  } catch (e) {
    console.log(e);
  }
};

// show job handle
$(document).mouseup((e) => {
  if (
    !$(".job_detail").is(e.target) &&
    $(".job_detail").has(e.target).length === 0 &&
    $(".job_detail").is(":visible")
  ) {
    $(".job_detail").hide(0);
    $(".wrap_body").hide(0);
    document.body.style.setProperty("overflow-y", "overlay", "important");
  }
});
