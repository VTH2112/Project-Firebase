class UserPostedJob extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.id = this.getAttribute("id");
    this.logo = this.getAttribute("logo");
    this.name = this.getAttribute("name");
    this.status = this.getAttribute("status");
    this.description = this.getAttribute("description");
    this.overview = this.getAttribute("overview");
    this.type_tag = this.getAttribute("type_tag");
    this.level_tag = this.getAttribute("level_tag");
    this.salary_tag = this.getAttribute("salary_tag");
  }
  connectedCallback() {
    this.shadow.innerHTML = `
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <style>${PostedJobStyle}</style>
    <div class="row user-content-group">
      <div class="col-10 px-0">
        <div class="d-flex">
          <div class="posted-job-logo">
            <img class="w-100 rounded"
              src="${this.logo}">
          </div>
          <div class="ms-3 job-heading">
            <span class="fs-5">${this.name}</span>
            <div>
              <i class="fas fa-info-circle"></i>
              <span class="ms-1">${this.status}</span>
            </div>
          </div>
        </div>
        <div class="mt-3 overview">
          <p>
          <span>${this.overview}</span>
          </p>
        </div>
        <div class="mt-3">
          <span class="job-tag px-2 py-1 rounded text-primary">${this.type_tag}</span>
          <span class="job-tag px-2 py-1 rounded text-primary">${this.level_tag}</span>
          <Span class="job-tag px-2 py-1 rounded text-primary">$${this.salary_tag}+</Span>
        </div>
      </div>
      <div class="d-flex col-2 px-0 justify-content-between flex-column">
        <button type="submit" class="btn btn-primary float-end" id="btn-view-job-candidates">View</button>
        <button type="submit" class="btn btn-outline-danger float-end" id="btn-delete-job">Delete</button>
      </div>
    </div>
    
    `;
    this.shadow
      .querySelector("#btn-delete-job")
      .addEventListener("click", () => {
        $(".loader-wrapper").show(0);
        firebase
          .firestore()
          .collection("jobs")
          .doc(this.id)
          .delete()
          .then(() => {
            userData.pushJob.splice(userData.pushJob.indexOf(this.id), 1);
            localStorage.setItem("userData", JSON.stringify(userData));
          })
          .then(() => {
            firebase.firestore().collection("users").doc(userId).update({
              pushJob: userData.pushJob,
            });
          })
          .then(() => {
            window.location.href = "./user.html";
          })
          .catch((e) => {
            $(".loader-wrapper").hide(0);
            Swal.fire({
              title: "Something Went Wrong!",
              text: `Please try again later`,
              icon: "error",
            });
          });
      });
    this.shadow
      .querySelector("#btn-view-job-candidates")
      .addEventListener("click", async () => {
        $("#modal-view-job-candidates").modal("show");
        $(".candidate-body").html("");
        let userArray = await firebase
          .firestore()
          .collection("users")
          .where("applyJob", "array-contains-any", [this.id])
          .get();
        userArray.forEach((doc) => {
          let docData = doc.data();
          $(".candidate-body").append(`
          <style>  
          .view-${docData.username}{
            cursor:pointer;
            padding:10px;
            border-radius:6px;
          }
          .view-${docData.username}:hover{
            background: #efefef;
          }
          .candidate-icon{
            position:absolute;
            top:50%;
            transform:translateY(-50%);
            border:1px solid #83838e;
            border-radius:5px;
            padding:5px;
            cursor:pointer;
            font-size:18px;
            color:#83838e;
          }
          .candidate-icon:hover{
            color:red;
            border:1px solid red;
          }
          #${docData.username}{
            width:400px;
            height:500px;
            position:absolute;
            top:0;
            left:0;
            transform:translateY(-40%);
            border-radius:5px;
            padding:30px 0 10px 0;
            text-align:center;
            z-index:10;
            background:white;
            cursor: move;
            overflow-y:hidden;
            display:none;
          }
          #${docData.username} p{
            line-height:1.3;
            margin-bottom:0;
            text-align:left;
          }
          #line-${docData.username}{
              background:black;
              width:50%;
              height:2px;
              position:absolute;
              top:38px;
              left:0;
              transition:.2s;
          }
          </style>`);
          $(".candidate-body").append(`
            <div style='margin-bottom:20px;position:relative'>
              <div class=' view-${docData.username} d-flex flex-row align-items-center'>
                <img class=" rounded-circle avatar-candidates" width=60 height=60 src="${docData.avatar}">
                <div class=" ms-3 d-flex flex-column justify-content-center">
                  <span class="fs-4 full-name-candidate">${docData.fullName}</span>
                  <span class="text-muted modal-view-email">${docData.email}</span>
                </div>
                <i title="Email: ${docData.email}" id='send-${docData.username}' class="far fa-envelope candidate-icon" style='right:60px;'></i>
                <i title="Phone: ${docData.phoneNumber}" class="far fa-phone candidate-icon" style='right:20px;'></i>
              </div>
              <div id='${docData.username}' style="box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);" >
              <i class="fas fa-times" id='close-${docData.username}' style='position:absolute;right:20px;top:20px;color:grey;padding:5px 10px;border:1px solid grey;cursor:pointer;'></i>
                <img class=" rounded-circle avatar-candidates mb-2" width=80 height=80 src="${docData.avatar}" style="cursor: default;">
                <h4 style="cursor: default;">${docData.fullName}</h4>
                <div class='d-flex justify-content-around mb-2 px-4 ' style="cursor: default;">
                  <div class='py-2 px-2' style='background:#efefef;width:46%'>
                    <span style='font-size:14px;'>${docData.phoneNumber}</span>
                  </div>
                  <div class='py-2 px-2' style='background:#efefef;width:52%'>
                    <span style='font-size:14px;display: -webkit-box;
                    -webkit-line-clamp: 1; /* number of lines to show */
                    -webkit-box-orient: vertical;
                    overflow: hidden;' title="Email: ${docData.email}">${docData.email}</span>
                  </div>
                </div>
                <div class='d-flex justify-content-around' style='position:relative'>
                  <div class='w-50 py-2 ' id='view-${docData.username}-experience'style='cursor:pointer' >
                    <span>Experience</span>
                  </div>
                  <div class='w-50 py-2' id='view-${docData.username}-contact' style='cursor:pointer'>
                    <span>Contact Details</span>
                  </div>
                  <div id='line-${docData.username}'></div>
                </div>
                <div class='py-3 px-2' style="overflow-y:scroll;background:#efefef8c;height:260px;cursor: default;" >
                  <p id='${docData.username}-experience'></p>
                  <p id='${docData.username}-contact' style='display:none'></p>
                </div>
              </div>
            </div>
            `);
          $(`#send-${docData.username}`).click(() => {
            window.location.href = `mailto:${docData.email}?subject=Interview Availability&body=Hi ${docData.fullName},
%0AThank you for applying to the ${this.name} position at [COMPANY NAME]. We’ve reviewed your application materials carefully, and we’re excited to invite you to interview for the role! 
%0AYour interview will be conducted [FORMAT] and last roughly [LENGTH OF INTERVIEW]. You’ll be speaking with [INTERVIEWER], our [INTERVIEWER JOB TITLE] here at [COMPANY NAME].
%0APlease let us know when you are available during the following times:
%0A[DAY, DATE – TIME, TIME ZONE]
%0A[DAY, DATE – TIME, TIME ZONE]
%0A[DAY, DATE – TIME, TIME ZONE]
%0AThanks again for your interest in joining the [COMPANY NAME] team! We’re looking forward to speaking with you.
%0ABest,
%0A[YOUR NAME]
%0A[YOUR EMAIL SIGNATURE]
`;
          });
          $(`#${docData.username}-experience`).html(``);
          $(`#${docData.username}-contact`).html(``);
          docData.experience.split("\n").forEach((text) => {
            $(`#${docData.username}-experience`).append(`${text}<br/>`);
          });
          docData.address.split("\n").forEach((text) => {
            $(`#${docData.username}-contact`).append(`${text}<br/>`);
          });
          $(`.view-${docData.username}`).click(() => {
            $(`#${docData.username}`).fadeToggle(0);
          });
          $(`#close-${docData.username}`).click(() => {
            $(`#${docData.username}`).fadeToggle(0);
          });
          $(`#view-${docData.username}-experience`).click(() => {
            if (!$(`#${docData.username}-experience`).is(":visible")) {
              $(`#${docData.username}-experience`).fadeIn(300);
              $(`#${docData.username}-contact`).hide();
              $(`#line-${docData.username}`).css({
                left:'0',
              })
            }
          });
          $(`#view-${docData.username}-contact`).click(() => {
            if (!$(`#${docData.username}-contact`).is(":visible")) {
              $(`#${docData.username}-contact`).fadeIn(300);
              $(`#${docData.username}-experience`).hide();
              $(`#line-${docData.username}`).css({
                left:'50%',
              })
            }
          });
          dragElement(document.getElementById(`${docData.username}`));

          function dragElement(elmnt) {
            var pos1 = 0,
              pos2 = 0,
              pos3 = 0,
              pos4 = 0;
            if (document.getElementById(elmnt.id)) {
              /* if present, the header is where you move the DIV from:*/
              document.getElementById(elmnt.id).onmousedown = dragMouseDown;
            } else {
              /* otherwise, move the DIV from anywhere inside the DIV:*/
              elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
              e = e || window.event;
              e.preventDefault();
              // get the mouse cursor position at startup:
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              // call a function whenever the cursor moves:
              document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
              e = e || window.event;
              e.preventDefault();
              // calculate the new cursor position:
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              // set the element's new position:
              elmnt.style.top = elmnt.offsetTop - pos2 + "px";
              elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
            }

            function closeDragElement() {
              /* stop moving when mouse button is released:*/
              document.onmouseup = null;
              document.onmousemove = null;
            }
          }
        });
      });
  }
}

const PostedJobStyle = `
  .user-content-group {
  background-color: #fff;
  border-radius: 6px;
  padding: 20px;
  margin: 0 0 30px 0;
  }
  .posted-job-logo {
    width: 17%;
  }
  
  .job-heading {
    width: -webkit-fill-available;
  }
  .overview p {
    height:80px;
  }
  .overview span{
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
    overflow: hidden; 
  }
  .job-tag {
    background-color: #e1ebfb;
  }

  @media (min-width:768px) {
    .posted-job-logo {
      width: 19%;
    }
  }

  @media (min-width:992px) {
    .posted-job-logo {
      width: 15%;
    }
  }

  @media (min-width:1200px) {
    .posted-job-logo {
      width: 13%;
    }
  }
`;

customElements.define("posted-job", UserPostedJob);
