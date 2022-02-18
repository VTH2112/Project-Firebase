const jobCardCssReject = `
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
    integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-size:95%;
  }
  .job_card{
    background:white;
    box-shadow: 5px 10px 18px #d4d4d459;
    border-bottom-left-radius:12.5px;
    border-bottom-right-radius:12.5px;
  }
img{
    height:200px !important;
}
p{
  height:80px;
}
span{
  color:#83838e;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* number of lines to show */
  -webkit-box-orient: vertical;
  overflow: hidden; 
}
.btn{
    border:0px  ;
}
.card{
    margin-left:20px;
    margin-right:20px;
}

</style>
`;
class job_card_reject extends HTMLElement {
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
    ${jobCardCssReject}
    <div class="job_card_pending  card" style="width: 20rem;">
         <img class="card-img-top" src="${this.props.logo}" alt="Card image cap">
         <div class="card-body">
                <h5 class="card-title">${this.props.name}</h5>
                <p class="card-text"><span>${this.props.overview}</span></p>
                <ul class="nav">
                    <li class="nav-item">
                         <a class="nav-link text-warning" href="#">${this.props.type_tag}</a>
                     </li>
                    <li class="nav-item">
                         <a class="nav-link text-warning" href="#">${this.props.salary_tag}+</a>
                     </li>
                     <li class="nav-item">
                        <a class="nav-link text-warning" href="#">${this.props.level_tag}</a>
                    </li>
                </ul>
                <div class="d-flex justify-content-end">
                <a href="#" class="btn btn-primary bg-danger delete-reject" id="delete-reject">Delete</a>
                </div>
                
    </div>
    </div>
    `;

    this.shadowRoot
      .querySelector("#delete-reject")
      .addEventListener("click", (e) => {
        e.preventDefault();
        if (e.path[5].id == this.props.id) {
          firebase.firestore().collection("jobs").doc(this.props.id).delete();
        }
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

customElements.define("job-card-reject", job_card_reject);
