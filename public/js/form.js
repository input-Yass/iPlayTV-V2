window.onload =() => {
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        if(user.email){
            location.replace('/')
        }
    }
}


let formBtn = document.querySelector('.submit-btn');
let loader = document.querySelector('.loader')

formBtn.addEventListener('click', () => {
    let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let number = document.querySelector('#number') || null;
    let tac = document.querySelector('#tc') || null;

    if(fullname != null) {
        if(fullname.value.length < 3){
            showFormError('Name most be 3 letters long')
        } else if(!email.value.length){
            showFormError('Enter your Email')
        } else if(password.value.length < 8){
            showFormError('Enter a strong password')
        }  else if (!tac.checked){
            showFormError('You most agree to our Terms and Conditions!')
        } else {
            loader.style.display = 'block';
            sendData('/signup', {
                name: fullname.value,
                email: email.value,
                password: password.value,
                number: number.value,
                tac: tac.checked
            })
        }
    } else {
        if(!email.value.length || !password.value.length){
            showFormError('fill all the form please!')
        } else {
            loader.style.display = 'block';
            sendData('/login', {
                email: email.value,
                password: password.value,
            })
        }
    }
})
