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
let escribiendo = document.getElementById('typing');
let files = document.getElementById('file');

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

document.body.addEventListener('keypress', function () {
    if (event.srcElement.id == 'message') {
        socket.emit('chat:typing', nickname);
    }
})

$('#file').bind('change', function (e) {
    var data = e.originalEvent.target.files[0];
    readThenSendFile(data)
});

function readThenSendFile(data) {

    var reader = new FileReader();
    reader.onload = function (evt) {
        var msg = {};
        msg.username = nickname;
        msg.file = evt.target.result;
        msg.fileName = data.name;
        socket.emit('base64 file', msg);
    };
    reader.readAsDataURL(data);
}

socket.on('chat:return', function (data) {
    outputMyMessage.innerHTML += `
        <p id="msg"> 
            <strong>${data.username}</strong>: ${data.message}            
        </p>
    `

    escribiendo.innerHTML = '';
})

socket.on('chat:typing-return', (user) => {
    escribiendo.innerHTML = `<p>
    <img src="./img/escribiendo.gif" width="50" height="50"> <em>${user}</em> esta escribiendo ...
    </p>
    `
})

socket.on('base64 file', function (msg) {
    console.log(msg);

    var ispngimage = msg.file.includes("data:image/png;base64,");
    var isjpegimage = msg.file.includes("data:image/jpeg;base64,");
    var isjpgimage = msg.file.includes("data:image/jpg;base64,");
    var isgifimage = msg.file.includes("data:image/gif;base64,");

    if (ispngimage == true || isjpegimage == true || isjpgimage == true || isgifimage) {
        outputMyMessage.innerHTML += `
        <p id="msg"> 
            <strong>${msg.username}</strong>: <img src="${msg.file}" width="150" height="150"/>      
        </p>
    `
    } else {
        outputMyMessage.innerHTML += `
        <p id="msg">  
        <strong>${msg.username}</strong>: <a href="${msg.file}">${msg.fileName}</a>     
        </p>
    `
    }



    escribiendo.innerHTML = '';
})

