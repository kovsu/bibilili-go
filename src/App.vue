<script setup lang="ts">
import { LiveWS } from "bilibili-live-ws";
import { reactive, ref, watch } from "vue";

// ws 接收到的数据包需要 Buffer 去解析
import { Buffer } from "buffer";
import { computed } from "@vue/reactivity";
import { info } from "console";
window.Buffer = Buffer;

interface IMessage {
  username: string;
  msg: string;
}

const roomid = 545068;
const live = new LiveWS(roomid);

// 缓存弹幕
const messages = reactive<IMessage[]>([]);
// 展示弹幕
const showMsg = reactive<IMessage[]>([]);

const show = computed(() => {
  return document.querySelector(".chat-box");
});

live.on("open", () => {
  console.log("ws connect successfully!");
});

live.on("live", () => {
  console.log("进入房间");
});

live.on("heartbeat", (online) => {
  console.log(`当前人气：${online}`);
});

// live.on("msg", (data) => {
//   switch (data.cmd) {
//     case "INTERACT_WORD":
//       console.log(
//         `${data.data["uname"]} 进入了直播间，他的 uid 为${data.data["uid"]}`
//       );
//   }
// });

// 监听弹幕信息
live.on("DANMU_MSG", async (data) => {
  // const uid = data.info[2][0];
  // const res = await fetch(`https://tenapi.cn/bilibili/?uid=${uid}`).then(
  //   (res) => res.json()
  // );
  const obj: IMessage = {
    username: data.info[2][1],
    msg: data.info[1],
  };

  messages.push(obj);
});

watch(
  () => messages.length,
  (val, oldVal) => {
    const add = val > oldVal;
    if (showMsg.length < 10 && add) {
      const first = messages.shift()!;
      showMsg.push(first);
    } else if (showMsg.length === 10 && add) {
      showMsg.shift();

      const first = messages.shift()!;
      showMsg.push(first);
    }
  }
);
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="chat-box">
    <li v-for="(item, index) in showMsg" :key="item.username + '' + item.msg">
      <span class="username">{{ item.username }}:&nbsp;</span>
      <span class="message">{{ item.msg }}</span>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.chat-box {
  list-style: none;
  padding: 50px 20px;
  width: 500px;
  height: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.chat-box::-webkit-scrollbar {
  display: none;
}

.chat-box li {
  margin-bottom: 5px;
}

.username {
  font-size: 18px;
  letter-spacing: 1px;
  color: rgb(231, 94, 94);
  font-weight: 700;
  text-shadow: -0.5px -0.5px 0 black, 0.5px -0.5px 0 black, -0.5px 0.5px 0 black,
    0.5px 0.5px 0 black !important;
}

.message {
  font-size: 20px;
  letter-spacing: 1px;
  font-weight: 600;
  color: #fff;
  text-shadow: -0.5px -0.5px 0 black, 0.5px -0.5px 0 black, -0.5px 0.5px 0 black,
    0.5px 0.5px 0 black !important;
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
  top: 0;
}
</style>
