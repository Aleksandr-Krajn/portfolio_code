import Authorization from "./modules/authorization";
import Administration from "./modules/administration";
import Planning from "./modules/planning";
import Common from "./modules/common";
import El from "./modules/el";

const messages = {
  ru: {
    message: {
      auth: Authorization.ru,
      admin: Administration.ru,
      common: Common.ru,
      planning: Planning.ru,
    },

    el: El.ru,
  }
};

export default messages;