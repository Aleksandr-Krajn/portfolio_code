import Vue from "vue";
import VueI18n from "vue-i18n";
import messages from "@/assets/i18n";

Vue.use(VueI18n);

const locale = 'ru';
const i18n = new VueI18n({
  locale,
  messages,
});

export { locale, i18n };
export default i18n;