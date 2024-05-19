/** @name enumCurrencyId - Список возможных валют */
export const enumCurrencyId = {
  ruble: 0, // Рубль
  dollar: 1, // Доллар
  euro: 2 // Евро
}

/** @name enumStateAccountId - Список состояний счёта */
export const enumStateAccountId = {
  hidden: 0, // Скрыт
  display: 1 // Показан
}

/** @name stateAccountIcon - Список иконок состояний счёта */
export const stateAccountIcon = {
  [enumStateAccountId.hidden]: 'View',
  [enumStateAccountId.display]: 'Hide'
}

/** @name currencyList - Список валют */
export const currencyList = {
  [enumCurrencyId.ruble]: '₽',
  [enumCurrencyId.dollar]: '$',
  [enumCurrencyId.euro]: '€'
}
