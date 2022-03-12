export default {
  employee_created: {
    text: 'Сотрудник успешно создан',
    type: 'success'
  },
  
  error_save: {
    text: 'Ошибка сохранения данных',
    type: 'error'
  },

  role_save: {
    text: `<div class="message-box__save-role>
            <p class="message-box__save-title"> 
              Вы действительно хотите сохранить изменения?
            </p>
            <p class="message-box__save-text">Данное действие невозможно будет отменить</p>
          </div>`,
    type: 'warning'
  }
}