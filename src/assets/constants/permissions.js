export default {
  //#region Администрирование
  // Управление правами доступа
  ACCESS_RIGHTS_MANAGEMENT: "access_rights_management",

  // Управление пользователями
  USER_MANAGEMENT: "user_management",

  // Конструктор шаблонов отчетов
  REPORT_TEMPLATE_CONSTRUCTOR: "report_template_designer",

  // Конструктор модулей/цехов
  MODULE_CONSTRUCTOR: "constructor_of_modules_workshops",

  // Просмотр истории изменений (логи)
  VIEW_HISTORY_LOGS: "view_change_history_logs",
  //#endregion
  
  //#region Планирование
  // Просмотр заявок на пр-во
  VIEW_PRODUCTION_APPLICATION: "view_request_for_production",

  // Создание заявки на пр-во
  CREATE_PRODUCTION_APPLICATION: "create_request_for_production",

  // Изменение заявки на пр-во
  CHANGE_PRODUCTION_APPLICATION: "alter_request_for_production",

  // Отмена заявки на пр-во
  CANCEL_PRODUCTION_APPLICATION: "cancel_request_for_production",

  // Создание ПП
  CREATE_PRODUCTION_PLAN: "create_production_plan",

  // Изменение ПП
  CHANGE_PRODUCTION_PLAN: "alter_production_plan",

  // Создание задания на месяц
  CREATE_TASKS_MONTH: "create_task_for_month",

  // Изменения задания на месяц
  CHANGE_TASKS_MONTH: "alter_task_for_month",

  // Создание ЦЗ
  CREATE_MANUFACTURE_TASK: "create_manufacture_task",

  // Изменение ЦЗ
  CHANGE_MANUFACTURE_TASK: "alter_manufacture_task",

  // Отмена ЦЗ
  CANCEL_MANUFACTURE_TASK: "cancel_manufacture_task",

  // Создание СЗ
  CREATE_SHIFT_TASK: "create_shift_task",

  // Изменение СЗ
  CHANGE_SHIFT_TASK: "alter_shift_task",

  // Просмотр графиков пр-ва
  VIEW_PRODUCTION_SCHEDULES: "view_production_schedules",

  // Просмотр нормокарт
  VIEW_NORM_MAPS: "view_norm_maps",

  // Просмотр чертежей изделия и деталей в отдельности
  VIEW_PART_DRAWINGS: "view_product_and_details_drawings_individually",
  //#endregion

  //#region Отдел закупок (ОЗ)
  // Ведение информации о поставщиках
  SUPPLIER_INFO_MAINTENANCE: "control_supplier_information",

  // Создание запроса поставщикам
  CREATE_REQUEST_SUPPLIER: "create_suppliers_request",

  // Создание заказа поставщику
  CREATE_ORDER_SUPPLIER: "create_supplier_order",

  // Управление закупками ТМЦ
  PROCUREMENT_MANAGEMENT_MATERIAL: "management_procurement_inventories",

  // Заполнение КСУ
  FILL_KSU: "fill_material_inventory_control_card",
  //#endregion

  //#region Диспетчер
  // Отображение факта выполнения СЗ
  DISPLAY_EXECUTION_SHIFT_TASK: "display_fact_execution_shift_task",

  // Изменение ПП, ЦЗ на основании факта отображения выполнения заданий
  CHANGE_PRODUCTION_PLASN_BY_FACTS: "alter_production_plan_manufacture_task_based_on_progress_of_tasks",
  //#endregion

  //#region Отдел технического контроля (ОТК)
  // Внесение записи в журнал предъявления продукции на контроль
  LOGGING_JOURNAL_CONTROL: "create_entry_in_submit_products_for_control_log",

  // Формирование актов предъявления продукции
  FORMATION_ACTS_PRODUCTS: "create_presentation_products_acts",

  // Формирование запроса на Решение в НТЦ
  FORMATION_REQUEST_STC: "create_request_for_solution_in_scientific_and_technical_center",

  // Формирование Решения НТЦ
  FORMATION_SOLUTION_STC: "create_scientific_and_technical_center_decision",

  // Формирование акта о браке
  FORMATION_ACTS_DEFECT: "create_defect_act",

  // Оповещение ПДО о необходимости изменения сменных заданий ввиду потребности в доработке/новой детали
  NOTICE_PDO: "create_planning_and_dispatch_department_notification_to_change_shift_task",
  //#endregion

  //#region Документация/отчеты
  // Формирование отчетов по заданным критериям
  GENERAT_REPORT_CRITERIA: "create_specified_criteria_reports",

  // Создание пользовательского шаблона отчета
  CREATE_CUSTOM_REPORT_TEMPLATE: "create_custom_report_template",

  // Формирование отчетов по шаблону
  FORMATION_REPORT_TEMPLATE: "create_reports_using_template",

  // Экспорт отчетов
  EXPORT_REPORT: "export_reports",

  // Делиться отчетом (не MVP????)
  // SHARE_REPORT: "",
  //#endregion
};