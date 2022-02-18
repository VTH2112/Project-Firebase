$(document).ready(() => {
  $('.modal').on('hidden.bs.modal', function (e) {
    document.body.style.setProperty('overflow-y', 'overlay', 'important');
  })
  $('.modal').on('shown.bs.modal', function (e) {
    document.body.style.setProperty('overflow-y', 'hidden', 'important');
  })
  
  // Sidebar
  $(".sidebar-personal-info").addClass("active");
  $(".content-posted-jobs").hide();
  $(".content-applied-jobs").hide();
  $(".sidebar-personal-info").click(() => {
    $(".content-personal-info").show();
    $(".content-posted-jobs").hide();
    $(".content-applied-jobs").hide();
    $(".sidebar-personal-info").addClass("active");
    $(".sidebar-posted-jobs").removeClass("active");
    $(".sidebar-applied-jobs").removeClass("active");
  });
  $(".sidebar-posted-jobs").click(() => {
    $(".content-personal-info").hide();
    $(".content-posted-jobs").show();
    $(".content-applied-jobs").hide();
    $(".sidebar-personal-info").removeClass("active");
    $(".sidebar-posted-jobs").addClass("active");
    $(".sidebar-applied-jobs").removeClass("active");
  });
  $(".sidebar-applied-jobs").click(() => {
    $(".content-personal-info").hide();
    $(".content-posted-jobs").hide();
    $(".content-applied-jobs").show();
    $(".sidebar-personal-info").removeClass("active");
    $(".sidebar-posted-jobs").removeClass("active");
    $(".sidebar-applied-jobs").addClass("active");
  });
  // Header
  $(".full-name").html(`${userData.fullName}`);
  $(".user-name").html(`@${userData.username}`);
  $(".avatar").attr("src", `${userData.avatar}`);
  $(".cover-photo-div").css({
    backgroundImage: `url(${userData.background})`,
  });
  // Upload avatar handle
  $(".avatar-overlay").click(() => {
    $(".add-photo").toggle();
  });
  $(".add-photo-icon").click(() => {
    $(".add-photo").toggle();
  });
  let uploadWhich = "";
  $(".add-photo").click(() => {
    document.body.style.setProperty('overflow', 'hidden', 'important');
    uploadWhich = "avatar";
    $(".avatar-preview").attr("src", `${userData.avatar}`);
    $(".upload-photo-form").css({
      width: `min(500px, 90%)`,
    });
    $(".avatar-preview").css({
      width: `250px`,
      height: `250px`,
    });
    $(".upload-title").html(`Upload avatar`);
    $(".upload-photo-form").fadeIn(300);
    $(".wrap_body").show(0);
  });
  // Upload cover photo handle
  $(".add-cover-photo").click(() => {
    document.body.style.setProperty('overflow', 'hidden', 'important');
    uploadWhich = "background";
    $(".avatar-preview").attr("src", `${userData.background}`);
    $(".upload-photo-form").css({
      width: `min(700px, 90%)`,
    });
    $(".avatar-preview").css({
      width: `clamp(200px, 100%, 600px)`,
    });
    $(".upload-title").html(`Upload cover photo`);
    $(".upload-photo-form").fadeIn(300);
    $(".wrap_body").show(0);
  });
  // Upload file handle
  $("#avatar-file").change(() => {
    $("#upload-avatar-button").removeAttr("disabled");
    let file = document.querySelector("#avatar-file").files[0];
    $(".avatar-preview").attr("src", `${URL.createObjectURL(file)}`);
  });
  $("#upload-avatar-button").click(async () => {
    try {
      let file = document.querySelector("#avatar-file").files[0];
      var storage = firebase.storage();
      var storageRef = storage.ref();
      $(".loader-wrapper").show(0);
      await storageRef.child(userId + uploadWhich).put(file);
      storageRef
        .child(userId + uploadWhich)
        .getDownloadURL()
        .then(async (url) => {
          if (uploadWhich == "avatar") {
            await firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .update({
                avatar: `${url}`,
              });
            userData.avatar = `${url}`;
          } else {
            await firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .update({
                background: `${url}`,
              });
            userData.background = `${url}`;
          }
          localStorage.setItem("userData", JSON.stringify(userData));
          window.location.href = "../User/user.html";
        });
    } catch (e) {
      alert(e);
    }
  });
  // Hide when mouse click outside div
  $(document).mouseup((e) => {
    if (
      !$(".avatar-overlay").is(e.target) &&
      $(".avatar-overlay").has(e.target).length === 0 &&
      !$(".add-photo-icon").is(e.target)
    ) {
      $(".add-photo").hide(0);
    }
    if (
      !$(".upload-photo-form").is(e.target) &&
      $(".upload-photo-form").has(e.target).length === 0 &&
      $(".upload-photo-form").is(":visible")
    ) {
      $(".upload-photo-form").hide(0);
      $(".wrap_body").hide(0);
      document.body.style.setProperty('overflow-y', 'overlay', 'important');
      $("#upload-avatar-button").attr("disabled", true);
      $("#avatar-file").val("");
    }
    if (
      !$(".job_detail").is(e.target) &&
      $(".job_detail").has(e.target).length === 0 &&
      $(".job_detail").is(":visible")
    ) {
      $(".job_detail").hide(0);
      $(".wrap_body").hide(0);
      document.body.style.setProperty('overflow-y', 'overlay', 'important');
    }
  });
  // user's info in job candidates's modal
  $(".modal-view-email").html(`${userData.email}`);
});

// Data from Firebase and LocalStorage
const userDataFromLocalStorage = JSON.parse(localStorage.getItem("userData"));
const userDataFromFirebase = firebase.firestore().collection("users");
const jobDataFromFirebase = firebase.firestore().collection("jobs");

// Show Applied Jobs
const showApplydJob = () => {
  document.querySelector(".content-applied-jobs").innerHTML = "";
  for (let i = 0; i < userDataFromLocalStorage.applyJob.length; i++) {
    jobDataFromFirebase
      .doc(userDataFromLocalStorage.applyJob[i])
      .get()
      .then((doc) => {
        let docData = doc.data();
        document.querySelector(".content-applied-jobs").innerHTML += `
        <applied-job
        logo="${docData.logo}"
        name="${docData.name}"
        status="${docData.status.replace(/^\w/, (c) => c.toUpperCase())}"
        description="${docData.description}"
        overview="${docData.overview}"
        type_tag="${docData.type_tag}"
        level_tag="${docData.level_tag}"
        salary_tag="${docData.salary_tag}"
        ></applied-job>
      `;
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
// Show posted Jobs
const showPostedJobs = () => {
  try {
    document.querySelector(".content-posted-jobs").innerHTML = "";
    for (let i = 0; i < userDataFromLocalStorage.pushJob.length; i++) {
      jobDataFromFirebase
        .doc(userDataFromLocalStorage.pushJob[i])
        .get()
        .then((doc) => {
          let docData = doc.data();
          document.querySelector(".content-posted-jobs").innerHTML += `
          <posted-job
            id="${doc._delegate._key.path.segments[1]}"
            logo="${docData.logo}"
            name="${docData.name}"
            status="${docData.status.replace(/^\w/, (c) => c.toUpperCase())}"
            description="${docData.description}"
            overview="${docData.overview}"
            type_tag="${docData.type_tag}"
            level_tag="${docData.level_tag}"
            salary_tag="${docData.salary_tag}"
          ></posted-job>
        `;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  } catch (e) {
    console.log(e);
  }
};
showPostedJobs();
showApplydJob();

// Post a job
document
  .getElementById("modal-posted-job-submit")
  .addEventListener("click", () => {
    try {
      const employmentType = document.getElementsByName("employment-type");
      for (let i = 0; i < employmentType.length; i++) {
        if (employmentType[i].checked) {
          var employmentTypeResult = employmentType[i].value;
        }
      }
      const seniortyLevel = document.getElementsByName("seniorty-level");
      for (let i = 0; i < seniortyLevel.length; i++) {
        if (seniortyLevel[i].checked) {
          var seniortyLevelResult = seniortyLevel[i].value;
        }
      }
      $(".loader-wrapper").show(0);
      jobDataFromFirebase
        .add({
          status: "pending",
          logo: "https://picsum.photos/200",
          name: document.getElementById("posted-job-name").value,
          overview: document.getElementById("modal-posted-job-overview").value,
          description: document.getElementById("posted-job-description").value,
          type_tag: employmentTypeResult,
          salary_tag: document.getElementById("posted-job-salary").value,
          level_tag: seniortyLevelResult + " Level",
        })
        .then((docRef) => {
          userDataFromLocalStorage.pushJob.push(docRef.id);
          localStorage.setItem(
            "userData",
            JSON.stringify(userDataFromLocalStorage)
          );
        })
        .then(() => {
          userDataFromFirebase
            .doc(localStorage.getItem("userId"))
            .update(userDataFromLocalStorage);
        })
        .then(() => {
          window.location.href='./user.html'
        });

      // userDataFromFirebase.doc("ynDhredYb4T8yH3WhZQh").get().then((doc) => { console.log(doc.data()) });
      // jobDataFromFirebase.doc(docRef.id).get().then((doc) => {console.log(doc.data());})
    } catch (e) {
      console.log(e);
      $(".loader-wrapper").hide(0);
      Swal.fire({
        title: "Something Went Wrong!",
        text: `Please try again later`,
        icon: "error",
      });
    }
  });

// View Job candidates
// jobDataFromFirebase.doc("r38ZLzfBRsPHE7N6KEnI").get().then((doc) => {console.log(doc.data());})
// userDataFromFirebase.where("applyJob", "array-contains-any", ["r38ZLzfBRsPHE7N6KEnI"]).get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//       console.log(doc.id, " => ", doc.data());
//   })});
// console.log(whereExample);

// Delete posted Jobs
// const deleteAllPostedJob = () => {
//   try {
//     for (let i = 0; i < userDataFromLocalStorage.pushJob.length; i++) {
//       jobDataFromFirebase.doc(userDataFromLocalStorage.pushJob[0]).delete()
//       userDataFromLocalStorage.pushJob.splice(userDataFromLocalStorage.pushJob.indexOf("userDataFromLocalStorage.pushJob[i]"), 1);
//       localStorage.setItem("userData", JSON.stringify(userDataFromLocalStorage));
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
// deleteAllPostedJob();
//       userDataFromFirebase.doc(localStorage.getItem("userId")).update(userDataFromLocalStorage);
