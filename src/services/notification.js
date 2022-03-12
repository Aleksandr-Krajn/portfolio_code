import { Notification } from 'element-ui';

const types = [ 'success', 'warning', 'error', 'info'];
const settingsType = {
  success: {
    iconClass: "el-icon-success",
    customClass: 'iz-notification iz-notification_success',
  },

  error: {
    iconClass: "el-icon-error",
    customClass: 'iz-notification iz-notification_error',
  },

  warning: {
    iconClass: "el-icon-warning",
    customClass: 'iz-notification iz-notification_warning',
  },

  info: {
    iconClass: "el-icon-info",
    customClass: "iz-notification iz-notification_info",
  }
};

const isObject = function(obj) {
  return typeof obj === 'object' && !!obj;
};

const notification = function(options) {
  if (!isObject(options) || !types.includes(options.type)) return;

  const { type, showIcon, data } = options;
  const settings = settingsType[type];
  const iconClass = (data ? data.iconClass : null) || settings.iconClass;
  const customClass = (data && data.customClass ? ` ${ data.customClass }` : '' );
  
  const notice = {
    duration: 5000,
    ...data,
    type: undefined,
    customClass: settings.customClass + customClass,
    iconClass: (showIcon === false) ? undefined : iconClass,
  };

  setTimeout(() => {
    Notification(notice);
  }, 100);
};

export default notification;