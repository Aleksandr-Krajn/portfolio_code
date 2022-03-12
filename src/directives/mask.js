import Inputmask from 'inputmask';

/**
 * Маскирует значение input. Позволяет как подставлять уже преднастроенную маску, так и добавлять кастомные маски
 * Поднобнее о масках - https://github.com/RobinHerbots/Inputmask
 *
 * Поддерживаемые преднастроенные типы:
 * int - целочисленные значения
 * float - число с плавающей запятой
 * date - дата в формате дд.мм.гггг
 * datetime - дата в формате дд.мм.гггг чч:мм
 * url - ссылка в формате http(s)://..
 * email
 * color - строка в формате #rrggbb / #rgb
 */
const Mask = {
  inserted(el, { value, modifiers }) {
    const _types = {
      int: { alias: 'integer', rightAlign: false },
      float: { alias: 'decimal', rightAlign: false },
      date: { alias: 'datetime', inputFormat: 'dd.mm.yyyy' },
      datetime: { alias: 'datetime', inputFormat: 'dd.mm.yyyy HH:MM' },
      url: { alias: 'url' },
      email: { alias: 'email' },
      color: { regex: '^#(?:[0-9a-fA-F]{3}){1,2}$' },
    };

    const firstModifier = Object.keys(modifiers)[0];
    const config = {
      showMaskOnHover: false,
      insertModeVisual: false,
      noValuePatching: true,
      clearIncomplete: true,
      ..._types[firstModifier],
      ...value
    };
    const elements = [];
    
    const setAttributesToInput = (input) => {
      const attributes = {
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: "false",
      };

      Object.keys(attributes).forEach(key => input.setAttribute(key, attributes[key]));
    };

    if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
      var inputes = el.getElementsByTagName('input');
      if (inputes) {
        elements.push(...inputes);
      }
    } else {
      elements.push(el);
    }

    if (elements.length) {
      const inputMask = Inputmask(config);
      elements.forEach(input => {
        setAttributesToInput(input)
        inputMask.mask(input);
      });
    } 
  },
};

export { Mask };