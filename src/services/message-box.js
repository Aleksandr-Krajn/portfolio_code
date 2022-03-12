import { MessageBox } from 'element-ui'

export function primitiveMessageBox(prop) {
  return MessageBox.alert(prop.text, '', {
    confirmButtonText: 'OK',
    type: prop.type,
    customClass: 'message-box',
    center: true,
    dangerouslyUseHTMLString: true
  })
}

export function confirmSaveMessageBox(prop, successFunc) {
  return MessageBox.confirm(prop.text, '', {
    confirmButtonText: 'Сохранить',
    cancelButtonText: 'Отмена',
    type: prop.type,
    customClass: 'message-box',
    center: true,
    dangerouslyUseHTMLString: true
  }).then(() => {
    successFunc()
  });
}