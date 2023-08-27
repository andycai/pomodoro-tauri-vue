<script setup lang="ts">
import { readTextFile } from '@tauri-apps/api/fs';
import { resolveResource } from '@tauri-apps/api/path';
import { onBeforeMount, reactive } from 'vue';

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

let ICON_PLAY = "play-circle-outline";
let ICON_PAUSE = "pause-circle-outline";

const initialdata = {
  title: "Work",
  count: defaultWork(),
  showCount: convertCount(defaultWork()),
  status: Status.Idle,
  icon: ICON_PLAY,
  workType: WorkType.Work,
  todayCount: getTodayCount(),
}

const state = reactive({ ...initialdata });

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

function convertDate() {
  const date = new Date();
  const key = `todayCount-${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`;

  return key;
}

function getTodayCount() {
  if (localStorage.getItem(convertDate()) === null) {
    return 0;
  }
  return Number(localStorage.getItem(convertDate()));
}

function updateTodayCount() {
  localStorage.setItem(convertDate(), state.todayCount.toString());
}

function defaultWork() {
  if (localStorage.getItem("defaultWorkDuration") === null) {
    return 1500;
  }
  return Number(localStorage.getItem("defaultWorkDuration"));
}

function defaultBreak() {
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

function resetState(data: any) {
  state.icon = data.icon;
  state.status = data.status;
  state.count = data.count;
  state.showCount = data.showCount;
  state.title = data.title;
  state.workType = data.workType;
}

async function dispatch(action: any) {
  switch (action.type) {
    case Action.Pause:
      clearInterval(ticker);
      state.status = Status.Pause;
      state.icon = ICON_PLAY;
      break;
    case Action.Reset:
      clearInterval(ticker);
      resetState(initialdata);
      break;
    case Action.Ready:
      state.icon = ICON_PAUSE;
      state.status = Status.Tick;
      break;
    case Action.Tick:
      console.info("Tick0");
      if (action.count < 0) {
        console.info("Tick1");
        clearInterval(ticker);
        if (action.workType === WorkType.Work) {
          state.title = "Work";
          state.count = defaultWork();
          state.showCount = convertCount(defaultWork());
          state.status = Status.Idle;
          state.icon = ICON_PLAY;
        } else {
          state.title = "Break";
          state.count = defaultBreak();
          state.showCount = convertCount(defaultBreak());
          state.status = Status.Idle;
          state.icon = ICON_PLAY;
          state.todayCount += 1;
          updateTodayCount();
        }
        break;
      } else {
        state.count = action.count;
        state.showCount = convertCount(action.count);
        state.icon = ICON_PAUSE;
        break;
      }
  }
}

async function startClick() {
  if (state.status === Status.Tick) {
    dispatch({type: Action.Pause});
  } else {
    clearInterval(ticker);
    dispatch({type: Action.Ready});
    ticker = setInterval(() => {
      state.count -= 1;
      if (state.count < 0) {
        state.workType = state.workType === WorkType.Work ? WorkType.Break : WorkType.Work;
      }
      let count = state.count;
      let workType = state.workType;
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
      <h4 class="title">{{ state.title }}</h4>
      <h1 class="time">{{ state.showCount }}</h1>
    </div>
    <div class="today-count">
      <mdicon class="icon" name="clock-outline" :width="26" :height="26" /><span style="vertical-align: sub;">x{{ state.todayCount }}</span>
    </div>
    <div class="start-op">
      <mdicon class="icon" :name="state.icon" :width="26" :height="26" @click="startClick" />
    </div>
    <div class="reset-op">
      <mdicon class="icon" name="refresh-circle" :width="26" :height="26" @click="resetClick" />
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
  top: 3.8rem;
  right: 0.5rem;
}

.reset-op {
  position: absolute;
  top: 0.2rem;
  right: 0.5rem;
}

.today-count {
  position: absolute;
  display: inline;
  top: 3.8rem;
  left: 0.5rem;
  font-size: 0.8em;
  font-weight: 500;
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

.icon {
  cursor: pointer;
}

</style>