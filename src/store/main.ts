import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { DefaultBreakDuration, DefaultWorkDuration, INTERVAL, Keys, MagicNumber, Status, Tasks, WorkType } from '../config'
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
  const theme = ref<number>(0)

  let id: any

  const minuteShow = computed(() => {
    return convertMinuteString(count.value)
  })

  const secondShow = computed(() => {
    return convertSecondString(count.value)
  })

  const themeStyle = computed(() => {
    return convertThemeStyle(workType.value, theme.value % themeNum)
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
    theme.value = Math.floor(ptoday / MagicNumber)
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
        if (today.value % MagicNumber === 0) {
          changeTheme()
        }
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

  function changeTheme() {
    theme.value = (theme.value + 1) % themeNum
  }

  function updateDuration() {
      if (status.value == Status.Idle) {
        if (workType.value == WorkType.Break) {
          count.value = getIntDefault(Keys.defaultBreakDuration, DefaultBreakDuration)
        }
        count.value = getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration)
      }
  }

  return { 
    count, status, workType, daykey, today, total,
    minuteShow, secondShow, themeStyle, 
    initData, updateDaykey, updateToday, countdown, tick, reset, changeTheme, updateDuration
  }
})

/*

// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})

import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // 带自动补全 ✨
    counter.$patch({ count: counter.count + 1 })
    // 或使用 action 代替
    counter.increment()
  },
}

*/

/*
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
*/