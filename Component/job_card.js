const jobCardCss = `
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-size:95%;
    font-family: 'Poppins', sans-serif;
  }
  .job_card{
    width:260px;
    background:white;
    display:flex;
    flex-direction:column;
    padding:20px 16px;
  }
  /* dark mode component */
  .dm-job-card{
    background: #1c1c24 !important;
  }
  .dm-job-card li{
    background: #292932 !important;
    color:#83838e;
  }
  .dm-job-card #view_btn{
    background: #292932 !important;
    color:#83838e;
  }
  img{
    border-radius:5px;
    width:60px;
    height:60px;
  }
  h1{
    font-size:150%;
    font-weight:500;
    margin-top:15px;
    height:45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
  span{
    color:#83838e;
    display: -webkit-box;
    -webkit-line-clamp: 4; /* number of lines to show */
    -webkit-box-orient: vertical;
    overflow: hidden; 
  }
  p{
    margin-bottom:10px;
    height:100px;
  }
  ul{
    display:flex;
    list-style:none;
    margin:10px 0 20px 0;
  }
  li {
    border-radius:5px;
    margin-right:2%;
    padding:4px 8px;
    background:#e1ebfb;
    color:#0162ff;
    font-size:70%;
    font-weight:500;
  }
  .button_section{
    display:flex;
    justify-content:space-between;
  }
  input{
    width:48%;
    outline:none;
    border:none;
    border-radius:10px;
    padding:10px;
    cursor:pointer;
    font-size:90%;
  }
  #apply_btn{
    background:#0162ff;
    color:white;
  }
  #view_btn{
    background:#f0f0f0;
    color:#83838e;
  }
  @media(min-width:1300px){
    .job_card{
      width:300px;
   }
   .dm-job-card{
    background: #1c1c24 !important;
  }
  @media(min-width:1600px){
    .job_card{
      width:350px;
    }
    img{
      width:70px;
      height:70px;
    }
    p{
      height:120px;
    }
    input{
      padding : 12px 10px ;
    }
   }
   @media(min-width:1800px){
    .job_card{
      width:400px;
      padding:20px 20px;
    }
    h1{
      height:60px;
    }
    img{
      width:75px;
      height:75px;
    }
    p{
      height:150px;
    }
    span{
      -webkit-line-clamp: 5; /* number of lines to show */
    }
    input{
      padding : 15px 10px ;
    }
   }
</style>
`;
class job_card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.props = {
      id: "",
      logo: "",
      name: "",
      overview: "",
      description: "",
      type_tag: "",
      salary_tag: "",
      level_tag: "",
    };
  }
  connectedCallback() {
    this.shadowRoot.innerHTML += `
    ${jobCardCss}
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
    integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
    <div class="job_card">
        <img src="${this.props.logo}">
        <h1>${this.props.name}</h1>
        <p>
          <span>${this.props.overview}</span>
        </p>
        <ul>
            <li>${this.props.type_tag}</li>
            <li>$ ${this.props.salary_tag}+</li>
            <li>${this.props.level_tag}</li>
        </ul>
        <div class='button_section'>
          <input id='apply_btn' type="button" value="Apply Now">
          <input id='view_btn' type="button" value="View Detail">
        </div>
    </div>
    `;
    this.shadowRoot
      .querySelector("#apply_btn")
      .addEventListener("click", () => {
        if (active) {
          if (userData.applyJob.indexOf(this.props.id) == -1) {
            Swal.fire({
              title: "Apply Success !",
              text: "Wait us to contact you",
              icon: "success",
            });
            userData.applyJob.push(this.props.id);
            localStorage.setItem("userData", JSON.stringify(userData));
            firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .update(userData);
          } else {
            Swal.fire({
              title: "Can't Apply !",
              text: "You have already applied",
              icon: "warning",
            });
          }
        } else {
          Swal.fire({
            title: "Can't Apply !",
            text: "You are not signed in",
            icon: "error",
          });
        }
      });

    this.shadowRoot.querySelector("#view_btn").addEventListener("click", () => {
      $(".job_detail").fadeIn(300);
      $(".wrap_body").show(0);
      document.body.style.setProperty("overflow", "hidden", "important");
      document
        .querySelector(".job_detail")
        .setAttribute("id", `${this.props.id}`);
      document
        .querySelector(".job_detail_image")
        .setAttribute("src", `${this.props.logo}`);
      document.querySelector(
        ".job_detail_name"
      ).innerHTML = `${this.props.name}`;
      document.querySelector(".job_detail_overview").innerHTML = "";
      this.props.overview.split("\n").forEach((textOverview) => {
        document.querySelector(
          ".job_detail_overview"
        ).innerHTML += `${textOverview}<br/>`;
      });
      document.querySelector(".job_detail_description").innerHTML = "";
      this.props.description.split("\n").forEach((textDescription) => {
        document.querySelector(
          ".job_detail_description"
        ).innerHTML += `${textDescription}<br/>`;
      });
      document.querySelector(".type_tag").innerHTML = `${this.props.type_tag}`;
      document.querySelector(
        ".level_tag"
      ).innerHTML = `${this.props.level_tag}`;
      document.querySelector(
        ".salary_tag"
      ).innerHTML = `$${this.props.salary_tag}`;
    });
    $("#dark-mode").click(() => {
      this.shadowRoot
        .querySelector(".job_card")
        .classList.toggle("dm-job-card");
    });
  }
  disconnectedCallback() {}
  static get observedAttributes() {
    return [
      "id",
      "logo",
      "name",
      "overview",
      "description",
      "type_tag",
      "salary_tag",
      "level_tag",
    ];
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (newVal) {
      this.props[name] = newVal;
    }
  }
}
customElements.define("job-card", job_card);
