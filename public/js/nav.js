const navbar = document.querySelector('.navbar');
const mainLogo = document.querySelector('.main-logo');
const logo = document.querySelector('.logo');

window.addEventListener('scroll', () => {
  if(scrollY >= 70) {
    navbar.classList.add('bg');
    mainLogo.classList.add('hide');
    logo.classList.add('block');
  } else {
    navbar.classList.remove('bg');
    mainLogo.classList.remove('hide');
    logo.classList.remove('block')
  } 
})




const createNavbar = () => {

    let navbar = document.querySelector('.nav');

    navbar.innerHTML += `
    <i class="fa-regular fa-circle-user mobile-only"></i>
    <div class="user-icon-popup">
    <p>Login to your account</p>
    <button class="login-btn">log in</button>
    </div>
    `
}

createNavbar();

let userIcon = document.querySelector('.fa-circle-user');
let userPopupIcon = document.querySelector('.user-icon-popup');

userIcon.addEventListener('click', () => userPopupIcon.classList.toggle('active'))


let text = userPopupIcon.querySelector('p');
let actionBtn = userPopupIcon.querySelector('button');
let user = JSON.parse(sessionStorage.user || null);

if (user != null) {
    text.innerHTML = `Hi ${user.name}!`;
    actionBtn.innerHTML = `log out`;
    actionBtn.addEventListener('click', () => logout())
} else {
    text.innerHTML = `Log in to your account`;
    actionBtn.innerHTML = `log in`;
    actionBtn.addEventListener('click', () => location.href = '/login');
}

const logout = () => {
    sessionStorage.clear();
    location.replace('/')
}