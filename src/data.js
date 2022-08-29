const RoomId = 5194110;
const chatBox = document.querySelector("#chat-box");

const dm = {
  msg: [],
};

const dm_proxy = new Proxy(dm, {
  set: function (obj, prop, value) {
    if (obj[prop].length >= 10) {
      obj[prop].shift();
      obj[prop].push(value);
      renderAllChat(obj[prop]);
    } else {
      obj[prop].push(value);
      renderPartChat(obj[prop]);
    }
  },
  get: function (obj, prop) {
    return obj[prop];
  },
});

function clearActive() {
  const lis = document.querySelectorAll("#chat-box li");
  const flag = lis.length >= 10 ? true : false;
  lis.forEach((item, index) => {
    if (!flag) {
      item.setAttribute("style", `transform: translate(0, ${index * 30}px);`);
    } else {
      item.setAttribute(
        "style",
        `transform: translate(0, ${(index - 1) * 30}px);`
      );
    }
  });
}

// >= 10
function renderAllChat(arr) {
  clearActive();
  const li = document.querySelector("#chat-box li:first-child");
  chatBox.removeChild(li);

  const new_li = document.createElement("li");
  new_li.innerHTML = `
        <span class="username">${arr[9].username}<span> : </span></span>
        <span class="message">${arr[9].msg}</span>
    `;
  new_li.setAttribute("style", `transform: translate(0, 270px); opacity: 0;`);
  chatBox.appendChild(new_li);
}

// 0 ~ 9
function renderPartChat(arr) {
  clearActive();
  const item = arr[arr.length - 1];
  const index = arr.length - 1;
  const li = document.createElement("li");
  li.innerHTML = `
        <span class="username">${item.username}<span> : </span></span>
        <span class="message">${item.msg}</span>
    `;

  li.setAttribute("style", `transform: translate(0, ${index * 30}px)`);
  chatBox.appendChild(li);
}
