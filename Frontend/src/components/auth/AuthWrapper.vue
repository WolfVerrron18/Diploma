<template>
  <div class="auth-wrapper">
    <h3 ref="titleRef" class="auth-wrapper__title"></h3>

    <div class="auth-wrapper__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import TextPlugin from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const titleRef = ref(null)

const animateTitle = (newText) => {
  gsap.to(titleRef.value, {
    duration: 0.8,
    text: {
      value: newText,
      delimiter: ''
    },
    ease: 'power2.inOut'
  })
}

onMounted(() => {
  animateTitle(props.title)
})

// Если заголовок сменится (например, при переключении вход/регистрация), он переанимируется
watch(
  () => props.title,
  (newVal) => {
    animateTitle(newVal)
  }
)
</script>

<style scoped lang="scss">
.auth-wrapper {
  // Используем переменные Element Plus для автоматической темы
  width: 400px; // Немного увеличил, чтобы формам было просторнее
  height: fit-content;
  background-color: var(--el-bg-color);
  padding: 30px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;

  &__title {
    // Используем основной цвет текста из темы
    color: var(--el-text-color-primary);
    text-align: center;
    margin-bottom: 25px;
    font-size: 1.5rem;
    font-weight: 700;
    min-height: 1.5em; // Резервируем место под анимацию текста
  }

  &__content {
    // Внутренний контейнер для слота
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}

// Адаптация под мобилки
@media (max-width: 450px) {
  .auth-wrapper {
    width: 90%;
    padding: 20px;
  }
}
</style>
