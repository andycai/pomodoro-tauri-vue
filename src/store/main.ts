import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { DefaultBreakDuration, DefaultWorkDuration, Keys, Status, Tasks, WorkType } from '../config'
import { getIntDefault, saveItem } from './local'
import { convertTimeString } from '../utils'
import { ClassContainer, TextColors } from '../style'

// type State = {
//   count: number
//   status: Status
//   workType: WorkType
//   daykey: string
//   today: number // 当天番茄钟
//   total: number // 总番茄钟
// }

export const useMainStore = defineStore('main', () => {
  // const state = reactive<State>({
  //   count: getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration),
  //   status: Status.Idle,
  //   workType: WorkType.Work,
  //   daykey: Keys.today(),
  //   today: 0,
  //   total: 0,
  // })
  const count = ref<number>(getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
  const status = ref<Status>(Status.Idle)
  const workType = ref<WorkType>(WorkType.Work)
  const daykey = ref<string>(Keys.today())
  const today = ref<number>(0)
  const total = ref<number>(0)

  const timeShow = computed(() => {
    return convertTimeString(count.value)
  })

  const classContainer = computed(() => {
    const index = Math.floor(today.value / 4)
    const arr = TextColors[workType.value]??TextColors[1]
    const color = arr[index]??arr[4]
    // console.log("color", index, color)
    return ClassContainer + color 
  })

  watch(today, (newValue, oldValue) => {
    console.log("watch today", newValue, oldValue)
    if (newValue > 0) {
      if (daykey.value === Keys.today()) { // 当天
        saveItem(daykey.value, newValue.toString())
      } else {
        daykey.value = Keys.today()
        today.value = 1;
      }
    }
  })
  
  watch(total, (newValue, oldValue) => {
    console.log("watch total", newValue, oldValue)
    if (newValue > 0) {
      saveItem(Keys.total(Tasks.default), newValue.toString())
    }
  })

  function initData(ptoday:number, ptotal:number, pcount:number) {
    today.value = ptoday
    total.value = ptotal
    count.value = pcount
  }

  function updateDaykey(key: string) {
    daykey.value = key
  }

  function updateToday(count: number) {
    today.value = count
  }

  function countdown() {
    if (count.value === 0) {
      if (workType.value === WorkType.Work) {
        today.value++
        total.value++
        status.value = Status.Idle
        count.value = getIntDefault(Keys.defaultBreakDuration, DefaultBreakDuration)
        workType.value = WorkType.Break
        return
      }
      status.value = Status.Idle
      count.value = getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration)
      workType.value = WorkType.Work
      return
    }
    count.value--
  }

  function tick() {
    if (status.value !== Status.Tick) {
      status.value = Status.Tick
    } else {
      status.value = Status.Pause
    }
  }

  function reset() {
    count.value = getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration) 
    status.value = Status.Idle
    workType.value = WorkType.Work
  }

  return { count, status, workType, daykey, today, total, timeShow, classContainer, initData, updateDaykey, updateToday, countdown, tick, reset }
})