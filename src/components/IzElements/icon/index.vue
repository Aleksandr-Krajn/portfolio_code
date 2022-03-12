<template>
  <component
    v-if="component"
    :is="component.is"
    v-bind="component.bind"/>
</template>

<script>
// Иконки из дизайна Изолятора в svg формате
const _izIcons = {
  // alias: original file name
  "door_icon": "door_icon",
  "hammer": "hammer",
};

// Словарь зарегистрированных и закешированных иконок компонентов
const _components = {};

const _libs = [
  // ElementUI
  "el",
  // Izolyator Icons
  "iz",
  // MaterialDesignIcons
  "mdi"
];

export default {
  name: "IzIcon",

  props: {
    name: {
      type: String,
      default: null,
    },

    library: {
      type: String,
      default: 'el',
      validator(value) {
        return _libs.includes(value);
      }
    }
  },

  data() {
    return {
      // Текущий bind настройки компонента отображения
      component: null,
    }
  },

  computed: {
    components() {
      return _components;
    }
  },

  watch: {
    name: {
      immediate: true,
      handler(newName){
        this.asyncUpdateData(newName);
      }
    }
  },

  methods: {
    /**
     * Асинхронная загрузка иконки из локальных файлов компонента
     */
    async loadComponent(name){
      if (!name){
        return Promise.reject(null);
      }
      return () => import(/* webpackMode: "lazy-once" */`./icons/${ name }.svg`);
    },

    /**
     * Асинхронное обновление состояние компонента
     */
    async asyncUpdateData(name) {
      this.component = null;
      let result = null;

      switch (this.library) {
        // Если это библиотека ElementUI
        case "el": {
          result = {
            is: 'i',
            bind: {
              class: `iz-icon el-icon-${ name }`,
            }
          };
          break;
        }
        // Если это внутренние иконки проекта
        case "iz": {
          if (_izIcons[name] && !_components[name]) {
            let load = null;
            try {
              load = await this.loadComponent(_izIcons[name]);
            } catch {
              load = null;
            }
            
            if (load != null){
              _components[name] = load;
            } else {
              this.component = null;
              return;
            }
          }

          result = {
            is: _components[name],
            bind: {
              class: `iz-icon iz-icon-${ name }`,
            },
          };
          break;
        }
        // Если это библиотека MaterialDesignIcons
        case "mdi": {
          result = {
            is: 'i',
            bind: {
              class: `iz-icon mdi mdi-${ name }`,
            }
          };
          break;
        }
      }

      this.component = result;
    },
  }
}
</script>