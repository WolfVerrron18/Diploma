import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

/** @function
 * @name defineColor - Определение цвета на контрасте */
export const defineColor = (color) => {
  return parseInt(color.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
}

/** @function
 * @name getFormatDate - Получение даты в заданном формате */
export const getFormatTime = (date) => {
  return dayjs(date).utc().format('DD-MM-YYYY HH:ss')
}
