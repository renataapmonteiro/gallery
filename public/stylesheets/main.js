var tbsLink = document.querySelector(".nav-links");


function tabs() {
    for (var i = 0; i < tbsLink.length; i++) {
        tbsLink[i].addEventListener("click", function () {
           this.toggleClass("active");
        });
    }
}