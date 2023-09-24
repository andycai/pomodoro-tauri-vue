import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { DefaultBreakDuration, DefaultWorkDuration, INTERVAL, Keys, Status, Tasks, WorkType } from '../config'
import { getIntDefault, saveItem } from './local'
import { convertMinuteString, convertSecondString, convertThemeStyle, playAudio, playEndAudio } from '../utils'
import { themeNum } from '../style'

export const useMainStore = defineStore('main', () => {
  const count = ref<number>(getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
  const status = ref<Status>(Status.Idle)
  const workType = ref<WorkType>(WorkType.Work)
  const daykey = ref<string>(Keys.today())
  const today = ref<number>(0)
  const total = ref<number>(0)
  const themeIndex = ref<number>(0)

  let id: any

  const minuteShow = computed(() => {
    return convertMinuteString(count.value)
  })

  const secondShow = computed(() => {
    return convertSecondString(count.value)
  })

  const themeStyle = computed(() => {
    return convertThemeStyle(1, themeIndex.value % themeNum)
  })

  watch(today, (newValue) => {
    if (newValue > 0) {
      if (daykey.value === Keys.today()) { // 当天
        saveItem(daykey.value, newValue.toString())
      } else {
        daykey.value = Keys.today()
        today.value = 1;
      }
    }
  })
  
  watch(total, (newValue) => {
    if (newValue > 0) {
      saveItem(Keys.total(Tasks.default), newValue.toString())
    }
  })

  watch(status, (newValue) => {
    clearInterval(id)
    if (newValue === Status.Tick) {
      id = setInterval(countdown, INTERVAL)
    }
    playAudio(newValue === Status.Tick)
    playEndAudio(newValue === Status.Idle)
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
    themeIndex.value++
    themeIndex.value = themeIndex.value % themeNum
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

  function changeTheme() {
    themeIndex.value = (themeIndex.value + 1) % themeNum
  }

  return { 
    count, status, workType, daykey, today, total,
    minuteShow, secondShow, themeStyle, 
    initData, updateDaykey, updateToday, countdown, tick, reset, changeTheme
  }
})