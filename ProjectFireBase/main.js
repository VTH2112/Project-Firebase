// Initialize Varible
const NOJOB = `<p style="color:#b6b6c0;font-size:150%;text-align:center;">No Available Job</p>`;
const HAVEJOB = (docData) => {
  return `
  <div class = 'col-12 col-md-6  col-xl-4  d-flex justify-content-center pb-4 job'>
    <job-card id="${docData.id}" logo="${docData.logo}" name="${docData.name}" overview="${docData.overview}" description="${docData.description}" type_tag="${docData.type_tag}" salary_tag="${docData.salary_tag}" level_tag="${docData.level_tag}"></job-card>
  </div>
  `;
};
const resetShowingJob = () => {
  document.querySelector(".showing_job").innerHTML = "";
};
let start = 0;
let end = 6;
let pageNum = 1;
let jobData = [];
let getJobData = async () => {
  jobData = [];
  try {
    const jobRawData = await firebase
      .firestore()
      .collection("jobs")
      .where("status", "==", "active")
      .get();
    jobRawData.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc._delegate._key.path.segments[6];
      jobData.push(docData);
    });
  } catch (e) {
    console.log(e);
  }
};
// .........................
// Showing all job available
// .........................
const renderFromDB = async () => {
  try {
    await getJobData();
    resetPageNum();
    if (jobData.length) {
      resetShowingJob();
      jobData.forEach((docData) => {
        document.querySelector(".showing_job").innerHTML += HAVEJOB(docData);
      });
      paginate();
    } else {
      document.querySelector(".showing_job").innerHTML = NOJOB;
    }
  } catch (e) {
    console.log(e);
  }
};
const renderFromLC = () => {
  resetPageNum();
  if (jobData.length) {
    resetShowingJob();
    jobData.forEach((docData) => {
      document.querySelector(".showing_job").innerHTML += HAVEJOB(docData);
    });
    paginate();
  } else {
    document.querySelector(".showing_job").innerHTML = NOJOB;
  }
};
// .......................
// Search Job
// .......................
const checkboxArray = document.getElementsByName("checkbox");
let checkedBox = 0;
let filterArray = [];
checkboxArray.forEach((checkbox) => {
  checkbox.addEventListener("change", async () => {
    resetPageNum();
    filterArray = jobData;
    checkedBox = 0;
    for (let i = 0; i < 6; ++i) {
      if (checkboxArray[i].checked) {
        let checkboxVal = checkboxArray[i].parentElement.innerHTML
          .replace('<input type="checkbox" name="checkbox">', "")
          .trim()
          .toUpperCase();
        filterArray = filterArray.filter((doc) => {
          let docType = doc.type_tag.trim().toUpperCase();
          let docLevel = doc.level_tag.trim().toUpperCase();
          if (
            checkboxVal.indexOf(docType) != -1 ||
            docLevel.indexOf(checkboxVal) != -1
          ) {
            return doc;
          }
        });
        checkedBox++;
      }
    }
    for (let i = 6; i < 12; ++i) {
      if (checkboxArray[i].checked) {
        let checkboxVal = checkboxArray[i].parentElement.innerHTML
          .replace('<input type="checkbox" name="checkbox">', "")
          .trim();
        let min = Number(checkboxVal.split("-")[0].split("$")[1]);
        let max = Number(checkboxVal.split("-")[1].split("$")[1]);
        filterArray = filterArray.filter((doc) => {
          if (doc.salary_tag >= min && doc.salary_tag <= max) {
            return doc;
          }
        });
        checkedBox++;
      }
    }
    checkboxArray.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.parentElement.style.color = "#0162ff";
      } else {
        checkbox.parentElement.style.color = "#83838e";
      }
    });
    if (checkedBox == 0) {
      renderFromLC();
      filterArray = [];
    } else {
      resetShowingJob();
      if (filterArray.length) {
        filterArray.forEach((docData) => {
          document.querySelector(".showing_job").innerHTML += HAVEJOB(docData);
        });
        paginate();
      } else {
        document.querySelector(".showing_job").innerHTML = NOJOB;
      }
    }
  });
});
// .........................
// Render
// .........................
try {
  firebase
    .firestore()
    .collection("jobs")
    .where("status", "==", "active")
    .onSnapshot((snapShot) => {
      if (snapShot.docChanges() && checkedBox == 0) {
        renderFromDB();
      }
    });
} catch (error) {
  console.log(error);
}
// .......................
// Subcribe
// .......................
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const emailSub = document.querySelector("#email_sub");
const subBtn = document.querySelector("#sub_btn");
subBtn.addEventListener("click", async () => {
  if (emailSub.value.trim().length && validateEmail(emailSub.value.trim())) {
    const DATA = await firebase
      .firestore()
      .collection("subcribe_user")
      .where("email", "==", `${emailSub.value.trim()}`)
      .get();
    if (DATA.size == 0) {
      firebase
        .firestore()
        .collection("subcribe_user")
        .add({
          email: `${emailSub.value.trim()}`,
        });
      Swal.fire({
        title: "Subcribe Success !",
        text: `Your Email : ${emailSub.value.trim()}`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Your Email is already subcribed !",
        text: "Please try another email",
        icon: "warning",
      });
    }
  } else {
    Swal.fire({
      title: "Invalid Email !",
      text: "Please try again later",
      icon: "error",
    });
  }
  emailSub.value = "";
});
// .....................
// PAGINATE
// ......................
let paginate = () => {
  let jobCard = document.querySelectorAll(".job");
  for (let i = 0; i < start; ++i) {
    jobCard[i].style.setProperty("display", "none", "important");
  }
  for (let i = start; i < end; ++i) {
    jobCard[i].style.setProperty("display", "flex", "important");
  }
  for (let i = end; i < jobCard.length; ++i) {
    jobCard[i].style.setProperty("display", "none", "important");
  }
};
let prev = () => {
  if (start > 0) {
    document.querySelector(".product").scrollIntoView();
    start -= 6;
    end -= 6;
    document.querySelector(".page-num").innerHTML = --pageNum;
    paginate();
  }
};
let next = () => {
  if (end < document.querySelectorAll(".job").length) {
    document.querySelector(".product").scrollIntoView();
    start += 6;
    end += 6;
    document.querySelector(".page-num").innerHTML = ++pageNum;
    paginate();
  } else {
    Swal.fire({
      title: "No Job Anymore !",
      text: "Please try again later",
      icon: "error",
    });
  }
};
let prevStart = () => {
  while (start > 0) {
    document.querySelector(".product").scrollIntoView();
    start -= 6;
    end -= 6;
    document.querySelector(".page-num").innerHTML = --pageNum;
    paginate();
  }
};
let nextEnd = () => {
  while (end < document.querySelectorAll(".job").length) {
    document.querySelector(".product").scrollIntoView();
    start += 6;
    end += 6;
    document.querySelector(".page-num").innerHTML = ++pageNum;
    paginate();
  }
  if (end >= document.querySelectorAll(".job").length) {
    Swal.fire({
      title: "No Job Anymore !",
      text: "Please try again later",
      icon: "error",
    });
  }
};
let resetPageNum = () => {
  pageNum = 1;
  start = 0;
  end = 6;
  document.querySelector(".page-num").innerHTML = pageNum;
};
document.querySelector(".next").addEventListener("click", next);
document.querySelector(".prev").addEventListener("click", prev);
document.querySelector(".next-end").addEventListener("click", nextEnd);
document.querySelector(".prev-start").addEventListener("click", prevStart);
const pushJobData = () => {
  try {
    firebase.firestore().collection("jobs").add({
      status: "active",
      logo: "https://picsum.photos/200",
      name: "UI / UX Designer",
      overview:
        "We believe that design (and you) will be critical to the company's success. You will work with our founders and our early customers to help define and build our product functionality, while maintaining the quality bar that customers have come to expect from modern SaaS applications. You have a strong background in product design with a quantitavely anf qualitatively analytical mindset. You will also have the opportunity to craft our overall product and visual identity and should be comfortable to flex into working.",
      description:
        "3+ years working as a product designer. A portfolio that highlights your approach to problem solving, as well as you skills in UI. Experience conducting research and building out smooth flows. Excellent communication skills with a well-defined design process. Familiarity with design tools like Sketch and Figma Up-level our overall design and bring consistency to end-user facing properties",
      type_tag: "Part Time",
      salary_tag: "2500",
      level_tag: "Fresher Level",
    });
  } catch (error) {
    console.log(error);
  }
};
// pushJobData()
