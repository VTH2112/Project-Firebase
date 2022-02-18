$(document).ready(() => {
  $(".job_detail_close").click(() => {
    $(".job_detail").hide(0);
    $(".wrap_body").hide(0);
    document.body.style.setProperty('overflow-y', 'overlay', 'important');
  });
});
// Scroll
document.getElementById("head_btn").addEventListener("click", () => {
  document.querySelector(".product").scrollIntoView();
});
