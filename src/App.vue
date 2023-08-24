<script setup lang="ts">
import { readTextFile } from '@tauri-apps/api/fs';
import { resolveResource } from '@tauri-apps/api/path';
import { onBeforeMount, ref } from 'vue';

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup


const ONE_MINUTE = 60;
const INTERVAL = 1000;

enum Status {
  Idle = 0,
  Pause,
  Tick,
}

enum Action {
  Pause = 1,
  Reset,
  Ready,
  Tick,
}

enum WorkType {
  Work = 1,
  Break,
}

onBeforeMount( async () => {
  const resourcePath = await resolveResource("resources/data.json");
  const data = JSON.parse(await readTextFile(resourcePath));

  if (localStorage.getItem("defaultWorkDuration") === null) {
    localStorage.setItem("defaultWorkDuration", data.defaultWorkDuration.toString());
  }

  if (localStorage.getItem("defaultBreakDuration") === null) {
    localStorage.setItem("defaultBreakDuration", data.defaultBreakDuration.toString());
  }

});

function getDefaultWorkDuration() {
  if (localStorage.getItem("defaultWorkDuration") === null) {
    return 1500;
  }
  return Number(localStorage.getItem("defaultWorkDuration"));
}

function getDefaultBreakDuration() {
  if (localStorage.getItem("defaultBreakDuration") === null) {
    return 300;
  }
  return Number(localStorage.getItem("defaultBreakDuration"));
}

let ticker : any;

// const data = {
//     "defaultWorkDuration": 1500,
//     "workDurationList": [
//         900,
//         1200,
//         1500,
//         1800,
//         2700,
//         3600
//     ],
//     "defaultBreakDuration": 300,
//     "breakDurationList": [
//         300,
//         600
//     ]
// };


/**
 * 转换秒数为显示：分:秒
 */
function convertCount(count: number) : string {
  return (`${Math.floor(count / ONE_MINUTE)}:${Math.floor(count % ONE_MINUTE) < 10 ? "0" : ""}${count % ONE_MINUTE}`);
}

const initialdata = {
  title: "Work",
  count: getDefaultWorkDuration(),
  showCount: convertCount(getDefaultWorkDuration()),
  status: Status.Idle,
  buttonName: "Start",
  workType: WorkType.Work,
}

const showData = ref({ ...initialdata });

async function dispatch(action: any) {
  switch (action.type) {
    case Action.Pause:
      clearInterval(ticker);
      showData.value.status = Status.Pause;
      showData.value.buttonName = "Start";
      break;
    case Action.Reset:
      clearInterval(ticker);
      showData.value = { ...initialdata }
      break;
    case Action.Ready:
      showData.value.buttonName = "Pause";
      showData.value.status = Status.Tick;
      break;
    case Action.Tick:
      console.info("Tick0");
      if (action.count < 0) {
        console.info("Tick1");
        clearInterval(ticker);
        if (action.workType === WorkType.Work) {
          showData.value = {
            ...showData.value,
            title: "Work",
            count: getDefaultWorkDuration(),
            showCount: convertCount(getDefaultWorkDuration()),
            status: Status.Idle,
            buttonName: "Start",
          }
        } else {
          showData.value = {
            ...showData.value,
            title: "Break",
            count: getDefaultBreakDuration(),
            showCount: convertCount(getDefaultBreakDuration()),
            status: Status.Idle,
            buttonName: "Start",
          }
        }
        break;
      } else {
        console.info("Tick2");
        showData.value = {
          ...showData.value,
          count: action.count,
          showCount: convertCount(action.count),
          buttonName: "Pause",
        };
        break;
      }
  }
}

async function startClick() {
  if (showData.value.status === Status.Tick) {
    dispatch({type: Action.Pause});
  } else {
    clearInterval(ticker);
    dispatch({type: Action.Ready});
    ticker = setInterval(() => {
      showData.value.count -= 1;
      if (showData.value.count < 0) {
        showData.value.workType = showData.value.workType === WorkType.Work ? WorkType.Break : WorkType.Work;
      }
      let count = showData.value.count;
      let workType = showData.value.workType;
      dispatch({type: Action.Tick, count: count, workType: workType});
      // dispatch({type: Action.Tick, count: count, workType: workType});
    }, INTERVAL);
  }
}

async function resetClick() {
  dispatch({type: Action.Reset});
}

</script>

<template>
  <div class="container">
    <div class="content">
      <h4 class="title">{{ showData.title }}</h4>
      <h1 class="time">{{ showData.showCount }}</h1>
    </div>
    <div class="start-op">
      <button class="start" @click="startClick">{{ showData.buttonName }}</button>
    </div>
    <div class="reset-op" v-if="showData.status !== Status.Idle">
      <button class="reset" @click="resetClick">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 0;
  padding-top: 6vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  -webkit-user-select: none; /* Safari/Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none;
}

.content {
  cursor:default;
}

.start-op {
  position: absolute;
  top: 4em;
  right: 0.4em;
}

.reset-op {
  position: absolute;
  top: 0;
  right: 0.4em;
}

h1.time {
  margin: 0;
  padding: 0.2em 0 0 0;
  line-height: 0.9;
  font-size: 4rem;
}

h4.title {
  margin: 0;
  padding: 0;
  line-height: 0.4;
  /* font-size: 1rem; */
}

</style>