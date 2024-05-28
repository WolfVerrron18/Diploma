<template>
  <div class="auth-wrapper">
    <!-- Заголовок -->
    <h3 ref="titleRef" class="auth-wrapper__title"></h3>

    <slot />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

/** @module GSAP - Библиотека анимаций */
import { gsap } from 'gsap'
import TextPlugin from 'gsap/TextPlugin'
gsap.registerPlugin(TextPlugin)

export default {
  name: 'AuthWrapper',

  props: {
    /** @param {string} title - Заголовок */
    title: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const titleRef = ref(null)

    onMounted(() => {
      gsap.to(titleRef.value, {
        duration: 0.25,
        text: props.title,
        ease: 'none'
      })
    })

    return { titleRef }
  }
}
</script>

<style scoped lang="scss">
.auth-wrapper {
  width: 320px;
  height: fit-content;
  background: white;
  padding: 20px;
  border: 1px solid var(--el-menu-border-color);
  border-radius: var(--main-border-radius);

  &__title {
    color: black;
    text-align: center;
    margin-bottom: 10px;
  }
}
</style>
