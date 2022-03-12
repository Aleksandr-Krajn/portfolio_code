export default {
  tablesRights: [
    {
      width: 184,
      prop: '',
      label: 'Управление правами доступа',
      type: 'checkbox'
    },{
      width: 184,
      prop: '',
      label: 'Управление пользователями',
      type: 'checkbox'
    },{
      width: 184,
      prop: '',
      label: 'Конструктор шаблонов отчетов',
      type: 'checkbox'
    },{
      width: 184,
      prop: '',
      label: 'Конструктор модулей/цехов',
      type: 'checkbox'
    },{
      width: 184,
      prop: '',
      label: 'Просмотр истории изменений (логи)',
      type: 'checkbox'
    },{
      width: 184,
      prop: '',
      label: 'Создание заявки на производство',
      type: 'checkbox'
    },{
      width: 184,
      prop: '',
      label: 'Изменение заявки на производство',
      type: 'checkbox'
    },{
      width: 184,
      prop: '',
      label: 'Отмена заявки на производство',
      type: 'checkbox'
    },
  ],
  
  tablesUsers: [
    {
      width: 123,
      prop: 'id',
      label: 'ID',
      type: 'text',
      sortable: true,
      filters: {
        prop: 'id',
        placeholder: '№',
        type: 'text',
        styles: "width: 8.3rem"
      }
    }, {
      width: 95,
      prop: 'status',
      label: 'Статус',
      filters: {
        prop: 'status',
        type: 'select',
        placeholder: 'Все',
        options: [
          { text: 'Активные', value: 'true' },
          { text: 'Неактивные', value: 'false' }
        ]
      }
    }, {
      width: 352,
      prop: 'full_name',
      label: 'Ф.И.О.',
      type: 'text',
      sortable: true,
      filters: {
        prop: 'full_name',
        type: 'text',
        placeholder: 'Ф.И.О.',
        styles: 'width: 25.3rem'
      }
    }, {
      width: 370,
      prop: 'role',
      label: 'Роль',
      filters: {
        prop: 'role',
        type: 'autocomplete',
        placeholder: 'Роль'
      }
    }, {
      width: 231,
      prop: 'login',
      label: 'Логин',
      type: 'text',
      sortable: true,
      filters: {
        prop: 'login',
        type: 'text',
        placeholder: 'Логин'
      }
    },{
      width: 195,
      prop: 'date_create',
      label: 'Дата добавления',
      type: 'date',
      sortable: true,
    },{
      width: 197,
      prop: 'add_place',
      label: 'Место добавления',
      type: 'select',
      filters: {
        prop: 'add_place',
        type: 'select',
        options: ['Локально', 'Active Directory'],
        placeholder: 'Место',
      }
    },
  ]
}