const moodThemes = {
  default: { primary: '#409eff' },
  calm: { primary: '#5f85db' },
  productive: { primary: '#ff9900' },
  stressed: { primary: '#769f7a' },
  tired: { primary: '#8c8c8c' }
}

/**
 * Функция динамической смены темы через CSS-переменные
 * @param {string} mood - ключ из moodThemes
 */
export const applyMoodTheme = (mood) => {
  console.log(mood)
  const el = document.documentElement
  const theme = moodThemes[mood] || moodThemes.default

  // 1. Устанавливаем основные цвета
  Object.keys(theme).forEach((key) => {
    el.style.setProperty(`--el-color-${key}`, theme[key])
  })

  // 2. Генерируем "светлую" версию для эффектов при наведении (hover)
  // Для диплома можно просто добавить небольшую прозрачность
  el.style.setProperty('--el-color-primary-light-3', `${theme.primary}b3`)
  el.style.setProperty('--el-color-primary-light-9', `${theme.primary}1a`)

  // 3. Если нужно перекрасить фон кнопок в активном состоянии
  el.style.setProperty('--el-color-primary-dark-2', theme.primary)
}
