import { enumPriorities, enumStatusNotes } from '@/components/notes/enums/enumNotes.js'

export const noteLabels = {
  [enumStatusNotes.completed]: 'Выполнено',
  [enumStatusNotes.inPlans]: 'В планах',
  [enumStatusNotes.frozen]: 'Заморожено'
}

export const priorityLabels = {
  [enumPriorities.low]: 'Низкий',
  [enumPriorities.middle]: 'Средний',
  [enumPriorities.high]: 'Высокий'
}

export const rowStylePriorities = {
  [enumPriorities.low]: '#84f84e',
  [enumPriorities.middle]: '#ecd530',
  [enumPriorities.high]: '#ff758b'
}

export const rowStyleStates = {
  [enumStatusNotes.completed]: 'rgba(167,250,107,0.3)',
  [enumStatusNotes.inPlans]: 'rgba(222,165,255,0.3)',
  [enumStatusNotes.frozen]: 'rgba(116,138,248,0.3)'
}
