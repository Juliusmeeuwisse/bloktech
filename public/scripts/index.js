//test
console.log("Succesfully connected front-end JS");


const music_profimg = document.querySelector(".profilecard_img");
const likebutton = document.querySelector("#likebutton");
const dislikebutton = document.querySelector("#dislikebutton");

function playlike(file) {
    let audiosource = "../sounds/" + file + ".wav";
    let audio = new Audio(audiosource);
    audio.play();

}

function backgroundcolorlike() {
    document.body.style.background = "#f3f3f3 url('../images/greenbackground.png') no-repeat right top";

}

function backgroundcolordis() {
    document.body.style.background = "#f3f3f3 url('../images/redbackground.png') no-repeat right top";

}

music_profimg.addEventListener("click", () => {
    playlike("like");
});
likebutton.addEventListener("mouseover", backgroundcolorlike);
dislikebutton.addEventListener("mouseover", backgroundcolordis);