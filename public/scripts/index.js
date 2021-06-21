//test
console.log("Succesfully connected front-end JS");


const music_profimg = document.querySelector(".profilecard_img");
const likebutton = document.querySelector("#likebutton");
const dislikebutton = document.querySelector("#dislikebutton");
document.querySelector("#hearsongimg").src="../images/speaker.png";

const heartext = document.createElement("p");
heartext.textContent = "Click image to listen to their favorite song!";
document.querySelector("#hearsong").appendChild(heartext);
const imgsong = document.querySelector("#hearsong");

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
    imgsong.classList.add('hidehearsong');
});
likebutton.addEventListener("mouseover", backgroundcolorlike);
dislikebutton.addEventListener("mouseover", backgroundcolordis);

