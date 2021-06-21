//test
console.log("Succesfully connected front-end JS");

const music_profimg = document.querySelector(".profilecard_img");
const likebutton = document.querySelector("#likebutton");
const dislikebutton = document.querySelector("#dislikebutton");
document.querySelector("#hearsongimg").src = "../images/speaker.png";

// make p element and add textcontent, than add it to an empty article
const heartext = document.createElement("p");
heartext.textContent = "Click image to listen to their favorite song!";
document.querySelector("#hearsong").appendChild(heartext);
const songarticle = document.querySelector("#hearsong");

// make h1 element and add textcontent, than add it to an empty article
const liketext = document.createElement("h1");
liketext.textContent = "Liked!";
document.querySelector(".newlike").appendChild(liketext);
const likearticle = document.querySelector(".newlike");

// make h1 element and add textcontent, than add it to an empty article
const disliketext = document.createElement("h1");
disliketext.textContent = "Disliked!";
document.querySelector(".newdislike").appendChild(disliketext);
const dislikearticle = document.querySelector(".newdislike");

//play audio
function playlike(file) {
    let audiosource = "../sounds/" + file + ".wav";
    let audio = new Audio(audiosource);
    audio.play();
}

music_profimg.addEventListener("click", () => {
    playlike("like");
    songarticle.classList.add('hidehearsong');
});

likebutton.addEventListener("click", () => {
    likearticle.classList.remove('hide');
});

dislikebutton.addEventListener("click", () => {
    dislikearticle.classList.remove('hide');
});

const formdislike = document.querySelector('#dislikeform');
const formlike = document.querySelector('#likeform');
//detect horizontal swipe gestures
let touchstartX = 0;
let touchendX = 0;

function handleGesture() {
    if (touchendX < touchstartX) formdislike.submit();
    if (touchendX > touchstartX) formlike.submit();
}

function handleGesture2() {
    if (touchendX < touchstartX) dislikearticle.classList.remove('hide');
    if (touchendX > touchstartX) likearticle.classList.remove('hide');
}

music_profimg.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
});

music_profimg.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
    handleGesture2();
});

// Bronnen:
// Detect a finger swipe through JavaScript on the iPhone and Android. (2010, 15 februari). Stack Overflow. https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android