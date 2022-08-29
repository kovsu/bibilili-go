const RoomId = 8864977;
const chatBox = document.querySelector("#chat-box");

const dm = {
  msg: [],
};

const dm_proxy = new Proxy(dm, {
  set: function (obj, prop, value) {
    if (obj[prop].length >= 10) {
      obj[prop].shift();
    }

    obj[prop].push(value);
    renderChat(obj[prop]);
  },
  get: function (obj, prop) {
    return obj[prop];
  },
});

function renderChat(arr) {
  chatBox.innerHTML = "";
  for (let item of arr) {
    const li = document.createElement("li");
    li.innerHTML = `${item.username} : ${item.msg}`;
    chatBox.appendChild(li);
  }
}
