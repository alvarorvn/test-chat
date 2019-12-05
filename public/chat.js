const socket = io();

let btn_acceder = document.getElementById('btnAcceder');
let input_nickname = document.getElementById('nickname');
let nickname = '';
let divLogin = document.getElementById('login');
let divChat = document.getElementById('chat');
let menu = document.getElementById('menu');
let btn_regresar = document.getElementById('btnRegresar');
let message = document.getElementById('message');
let outputMyMessage = document.getElementById('MessageOutput');

btn_acceder.addEventListener('click', function () {
    if (input_nickname.value == '') {
        nickname = 'Anonimo'
    } else {
        nickname = input_nickname.value;
    }

    divLogin.style.display = "none";
    divChat.style.display = "block"

    menu.innerHTML += `    
    <label class="name" id="label_user">${nickname}</label>
    `
})

document.body.addEventListener('click', function (event) {
    if (event.srcElement.id == 'btnRegresar') {
        divLogin.style.display = "block";
        divChat.style.display = "none"

        nickname = '';

        input_nickname.value = '';

        let label_user = document.getElementById('label_user');
        label_user.innerHTML = '';
    };

    if (event.srcElement.id == 'btnSend') {
        socket.emit('chat:message', {
            username: nickname,
            message: message.value
        })

        message.value = '';
    }

    if (event.srcElement.id == 'msg') {
        event.srcElement.innerHTML += `
            <button class="" id="btnDelete" type="button">Eliminar</button>
        `
    }

    if (event.srcElement.id == 'btnDelete') {
        event.srcElement.parentNode.remove();
    }
});

socket.on('chat:return', function (data) {
    outputMyMessage.innerHTML += `
        <p id="msg"> 
            <strong>${data.username}</strong>: ${data.message}            
        </p>
    `
})

