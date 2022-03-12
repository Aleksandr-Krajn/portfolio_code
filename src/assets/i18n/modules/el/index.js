import elementUILocaleRU from 'element-ui/lib/locale/lang/ru-RU';

import ru from "./languages/ru.json";

const isObject = (obj) => {
  return typeof obj === 'object' && !Array.isArray(obj) && !!obj;
};

const recursiveMergeLocale = function(left, right) {
  if (isObject(left)) {
    const result = {};
    for (let k in left) {
      const _right = (right && k in right) ? right[k] : undefined;

      if (isObject(left[k])) {
        result[k] = recursiveMergeLocale(left[k], _right);
      } else {
        result[k] = _right || left[k];
      }
    }
    return result;
  }
  return null;
};

export default {
  ru: recursiveMergeLocale(elementUILocaleRU.el, ru),
};