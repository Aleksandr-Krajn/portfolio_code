/**
 * Добавление модального окна в контейнер отображаемых модальных окон
 *
 * @param {Object} modalData
 */
export const ADD_MODAL = 'ADD_MODAL';

/**
 * Обновление данных у модального окна с указанным id в сторе
 *
 * @param {Number} id - ИД модального окна
 * @param {Object} value - Данные для обновления
 */
export const UPDATE_MODAL = 'UPDATE_MODAL';

/**
* Удаление модального окна с указанным id из стора
*
* @param {Number} id - Если ИД не передали, то удаляются все окна
*/
export const REMOVE_MODALS = 'REMOVE_MODALS';