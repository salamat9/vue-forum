import { ref } from 'vue';

export function useAsyncDataStatus() {
  const ready = ref(false)

  function show() {
    return ready.value = true
  }

  return show()
}
