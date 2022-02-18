class UserAppliedJob extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
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
    <style>${UserAppliedJobStyle}</style>
    <div class="row user-content-group">
      <div class="col-10 px-0">
        <div class="d-flex">
          <div class="applied-job-logo">
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
          <span>${this.overview}</span>
        </div>
        <div class="mt-3">
          <span class="job-tag px-2 py-1 rounded text-primary">${this.type_tag}</span>
          <span class="job-tag px-2 py-1 rounded text-primary">${this.level_tag}</span>
          <Span class="job-tag px-2 py-1 rounded text-primary">$${this.salary_tag}+</Span>
        </div>
      </div>
      <div class="col-2 px-0">
        <button type="submit" class="btn btn-primary float-end view-btn">View</button>
      </div>
    </div>
    `;
    this.shadowRoot.querySelector(".view-btn").addEventListener("click", () => {
      document.body.style.setProperty("overflow", "hidden", "important");
      $(".job_detail").fadeIn(300);
      $(".wrap_body").show(0);
      document
        .querySelector(".job_detail_image")
        .setAttribute("src", `${this.logo}`);
      document.querySelector(".job_detail_name").innerHTML = `${this.name}`;
      document.querySelector(".job_detail_overview").innerHTML = "";
      this.overview.split("\n").forEach((textOverview) => {
        document.querySelector(
          ".job_detail_overview"
        ).innerHTML += `${textOverview}<br/>`;
      });
      document.querySelector(".job_detail_description").innerHTML = "";
      this.description.split("\n").forEach((textDescription) => {
        document.querySelector(
          ".job_detail_description"
        ).innerHTML += `${textDescription}<br/>`;
      });
      document.querySelector(".type_tag").innerHTML = `${this.type_tag}`;
      document.querySelector(".level_tag").innerHTML = `${this.level_tag}`;
      document.querySelector(".salary_tag").innerHTML = `$${this.salary_tag}`;
    });
  }
}

const UserAppliedJobStyle = `
  .user-content-group {
  background-color: #fff;
  border-radius: 6px;
  padding: 20px;
  margin: 0 0 30px 0;
  }
  
  .applied-job-logo {
    width: 17%;
  }
  
  .job-heading {
    width: -webkit-fill-available;
  }
  .overview{
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
    .applied-job-logo {
      width: 19%;
    }
  }

  @media (min-width:992px) {
    .applied-job-logo {
      width: 15%;
    }
  }

  @media (min-width:1200px) {
    .applied-job-logo {
      width: 13%;
    }
  }
`;

customElements.define("applied-job", UserAppliedJob);
