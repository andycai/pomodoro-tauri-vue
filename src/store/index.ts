import { useMainStore } from './main'

const appStore: any = {}

export const registerStore = () => {
  appStore.main = useMainStore()
}

export default appStore