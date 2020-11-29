// const chatForm = document.getElementById('chat-form');
// const chatMessages = document.querySelector('.chat-messages');
// const roomName = document.getElementById('room-name');
// const userList = document.getElementById('users');

// // Get username and room from URL
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true
// });

// const socket = io();

// // Join chatroom
// socket.emit('joinRoom', { username, room });

// // Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// // Message from server
// socket.on('message', message => {
//   console.log(message);
//   outputMessage(message);

//   // Scroll down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// // Message submit
// chatForm.addEventListener('submit', e => {
//   e.preventDefault();

//   // Get message text
//   let msg = e.target.elements.msg.value;
  
//   msg = msg.trim();
  
//   if (!msg){
//     return false;
//   }

//   // Emit message to server
//   socket.emit('chatMessage', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });

// // Output message to DOM
// function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement('p');
//   para.classList.add('text');
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector('.chat-messages').appendChild(div);
// }

// // Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach(user=>{
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
//  }

// _______________________________________


// this is frontend js 

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name'); //h2
const userList = document.getElementById('users'); //ul

// get username and room from the url
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// console.log(username, room);

const socket = io();

// join chatroom
socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})

// message from server
socket.on('message', message => {
  // console.log(`MSG IS ${message}`);
  outputMessage(message);

  // Scroll down - always at the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
  // when u submit a form, it automatically submits in to a file
  // so we wont to prevent it by using preventDefault method
  e.preventDefault(); // prevent the default behaviour
  const msg = e.target.elements.msg.value;  //msg is the id from the html-form
  // console.log(msg);
  socket.emit('chatMessage', msg) //emitting a msg to server

  // Clear input- this is to empty input text bar after msg is Send 
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus(); //focus cursor on the input(Enter message) field, after you send the msg
});


// output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class= "text">
    ${message.text}
  </p> `;
  document.querySelector('.chat-messages').appendChild(div);
}


// Add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user=> `<li>${user.username}</li>`).join('')}
  `;
}