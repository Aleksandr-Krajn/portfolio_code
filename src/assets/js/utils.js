/**
 * @description - Рекурсивный обход дерева
 * @param {Array} array - массив, который нужно обойти
 * @param {Function} func - функция коллбэк
 * @param {String} keyChild - Ключ для определения ребенка
 * @returns {void}
 */
export const eachRecursive = (array, func, keyChild = 'children') => {
  const _eachRecursive = (array, func, keyChild, parent) => {
    if (array && func) {
      array.forEach(element => {
        const nodeElement = {
          ...element,
          parent,
        };
        func(nodeElement);
        if (keyChild in element) {
          _eachRecursive(element.children, func, keyChild, nodeElement);
        }
      });
    }
  }
  
  _eachRecursive(array, func, keyChild, null);
};

/**
 * @description - Рекурсивный обход дерева c фильтрацией элементов
 * @param {Array} array - массив, который нужно обойти
 * @param {Function} filter - функция фильтра
 * @param {String} keyChild - Ключ для определения ребенка
 * @returns {Array} - итоговый массив
 */
export const eachRecursiveFilter = (array, filter, keyChild = 'children') => {
  let result = [];
  if (Array.isArray(array)) {
    array.forEach(element => {
      if (typeof element === 'object' && element) {
        if (!filter || filter(element)) {

          const newElement = {};
          for (let key in element) {
            newElement[key] = key !== keyChild
              ? element[key]
              : eachRecursiveFilter(element[key] || [], filter, keyChild);
          }

          result.push(newElement);
        }
      }
    });
  }
  return result;
};

export default {
  eachRecursive,
  eachRecursiveFilter,
};