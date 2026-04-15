export default {
  applicantProfile: {
    id: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    middleName: 'Сергеевич',
    email: 'ivan.petrov@example.ru',
    phone: '+7 (900) 123-45-67',
    birthDate: '2007-03-15',
    classProfile: '11 класс',
    educationType: 'school',
    specialization: 'Физико-математический профиль',
    institution: 'Лицей №15 г. Москва',
    avatarUrl: null,
    city: 'Москва',
    region: 'Московская область'
  },

  diagnosticTests: [
    { id: 1, name: 'Тест профессиональных интересов', description: 'Определение ведущих профессиональных интересов по методике Е.А. Климова', duration: 25, questionsCount: 42, status: 'completed', completedAt: '2025-11-20T14:30:00' },
    { id: 2, name: 'Диагностика способностей', description: 'Комплексная оценка когнитивных и специальных способностей', duration: 40, questionsCount: 60, status: 'completed', completedAt: '2025-11-22T10:15:00' },
    { id: 3, name: 'Психологический портрет', description: 'Определение типа личности и особенностей характера', duration: 30, questionsCount: 48, status: 'in_progress', completedAt: null },
    { id: 4, name: 'Тест на профпригодность', description: 'Оценка соответствия личных качеств требованиям профессий', duration: 35, questionsCount: 55, status: 'available', completedAt: null }
  ],

  learningSummary: {
    averageGrade: 4.6,
    totalCourses: 5,
    completedCourses: 3,
    inProgressCourses: 2,
    totalHours: 128,
    completedHours: 94,
    subjects: [
      { name: 'Математика (профиль)', grade: 5, progress: 100, status: 'completed' },
      { name: 'Информатика', grade: 5, progress: 100, status: 'completed' },
      { name: 'Физика', grade: 4, progress: 100, status: 'completed' },
      { name: 'Подготовка к ЕГЭ по информатике', grade: null, progress: 72, status: 'in_progress' },
      { name: 'Основы программирования (Python)', grade: null, progress: 45, status: 'in_progress' }
    ],
    achievements: [
      { title: 'Олимпиада по информатике — призёр регионального этапа', date: '2025-12-15' },
      { title: 'Хакатон «Цифровой прорыв» — 2 место', date: '2025-11-10' },
      { title: 'Сертификат «Основы Python» (Stepik)', date: '2025-10-20' }
    ]
  },

  diagnosticResults: {
    overallScore: 78,
    interestsProfile: [
      { name: 'Информационные технологии', score: 92 },
      { name: 'Техника', score: 85 },
      { name: 'Знаковая система', score: 78 },
      { name: 'Экономика', score: 65 },
      { name: 'Человек', score: 58 },
      { name: 'Природа', score: 42 },
      { name: 'Художественный образ', score: 35 },
      { name: 'Медицина', score: 28 }
    ],
    abilities: [
      { name: 'Логическое мышление', score: 88, level: 'высокий' },
      { name: 'Математические способности', score: 82, level: 'высокий' },
      { name: 'Пространственное мышление', score: 75, level: 'выше среднего' },
      { name: 'Вербальные способности', score: 70, level: 'выше среднего' },
      { name: 'Креативность', score: 64, level: 'средний' },
      { name: 'Коммуникативные навыки', score: 55, level: 'средний' }
    ],
    recommendations: [
      'Рекомендуются профессии в сфере IT и инженерии, где востребованы аналитические способности',
      'Стоит обратить внимание на направления Data Science, программная инженерия, системный анализ',
      'Для развития рекомендуется участие в олимпиадах по информатике и хакатонах'
    ]
  },

  educationalRoute: {
    stages: [
      { id: 1, name: 'Базовое образование', description: 'Завершение школьного образования, подготовка к ЕГЭ', status: 'completed', progress: 100, startDate: '2024-09-01', endDate: '2025-05-31', courses: [{ id: 1, name: 'Подготовка к ЕГЭ по информатике' }, { id: 2, name: 'Подготовка к ЕГЭ по математике' }] },
      { id: 2, name: 'Профориентация', description: 'Прохождение диагностик и определение профессионального направления', status: 'current', progress: 65, startDate: '2025-10-01', endDate: '2026-02-28', courses: [{ id: 3, name: 'Основы программирования' }] },
      { id: 3, name: 'Поступление', description: 'Подача документов и поступление в вуз', status: 'upcoming', progress: 0, startDate: '2026-06-01', endDate: '2026-08-31', courses: [] },
      { id: 4, name: 'Бакалавриат', description: 'Обучение по направлению «Программная инженерия»', status: 'upcoming', progress: 0, startDate: '2026-09-01', endDate: '2030-06-30', courses: [] },
      { id: 5, name: 'Стажировка', description: 'Прохождение практики в IT-компании', status: 'upcoming', progress: 0, startDate: '2029-06-01', endDate: '2029-08-31', courses: [] },
      { id: 6, name: 'Трудоустройство', description: 'Начало профессиональной карьеры', status: 'upcoming', progress: 0, startDate: '2030-07-01', endDate: '2030-12-31', courses: [] }
    ]
  },

  competencies: [
    { id: 1, name: 'Алгоритмическое мышление', category: 'Технические', currentLevel: 4, targetLevel: 5, progress: 80, description: 'Способность разрабатывать и анализировать алгоритмы' },
    { id: 2, name: 'Программирование на Python', category: 'Технические', currentLevel: 3, targetLevel: 5, progress: 60, description: 'Владение языком Python для решения задач' },
    { id: 3, name: 'Базы данных', category: 'Технические', currentLevel: 2, targetLevel: 4, progress: 50, description: 'Проектирование и работа с базами данных' },
    { id: 4, name: 'Математический анализ', category: 'Фундаментальные', currentLevel: 3, targetLevel: 4, progress: 75, description: 'Владение методами математического анализа' },
    { id: 5, name: 'Командная работа', category: 'Гибкие навыки', currentLevel: 3, targetLevel: 4, progress: 75, description: 'Эффективное взаимодействие в команде' },
    { id: 6, name: 'Проектное управление', category: 'Гибкие навыки', currentLevel: 1, targetLevel: 3, progress: 33, description: 'Основы управления проектами' },
    { id: 7, name: 'Английский язык (B2)', category: 'Языковые', currentLevel: 3, targetLevel: 4, progress: 75, description: 'Владение английским на уровне Upper-Intermediate' },
    { id: 8, name: 'Веб-разработка', category: 'Технические', currentLevel: 2, targetLevel: 4, progress: 50, description: 'Создание веб-приложений (HTML, CSS, JS)' }
  ],

  developmentPlan: {
    steps: [
      { id: 1, title: 'Завершить курс по Python', description: 'Пройти курс «Python для продвинутых» на платформе', deadline: '2026-04-15', status: 'in_progress', competencyId: 2 },
      { id: 2, title: 'Подготовка к олимпиаде', description: 'Участие в региональной олимпиаде по информатике', deadline: '2026-03-01', status: 'completed', competencyId: 1 },
      { id: 3, title: 'Проект по веб-разработке', description: 'Создать персональный сайт-портфолио', deadline: '2026-05-30', status: 'pending', competencyId: 8 },
      { id: 4, title: 'Курс по базам данных', description: 'Изучить основы SQL и NoSQL баз данных', deadline: '2026-06-15', status: 'pending', competencyId: 3 },
      { id: 5, title: 'Командный хакатон', description: 'Участие в хакатоне для развития командных навыков', deadline: '2026-07-01', status: 'pending', competencyId: 5 }
    ]
  },

  professions: [
    { id: 1, name: 'Программист (Backend)', field: 'IT', avgSalary: 180000, demand: 'high', matchScore: 92, description: 'Разработка серверной логики приложений', requiredCompetencies: ['Python', 'Базы данных', 'Алгоритмы'], educationPrograms: [{ name: 'Программная инженерия', institution: 'МГУ', duration: '4 года' }] },
    { id: 2, name: 'Data Scientist', field: 'IT', avgSalary: 200000, demand: 'high', matchScore: 88, description: 'Анализ данных и машинное обучение', requiredCompetencies: ['Python', 'Математика', 'Статистика'], educationPrograms: [{ name: 'Прикладная математика и информатика', institution: 'МФТИ', duration: '4 года' }] },
    { id: 3, name: 'Системный аналитик', field: 'IT', avgSalary: 160000, demand: 'high', matchScore: 85, description: 'Анализ и проектирование информационных систем', requiredCompetencies: ['UML', 'SQL', 'Бизнес-анализ'], educationPrograms: [{ name: 'Бизнес-информатика', institution: 'ВШЭ', duration: '4 года' }] },
    { id: 4, name: 'DevOps-инженер', field: 'IT', avgSalary: 190000, demand: 'high', matchScore: 78, description: 'Автоматизация процессов разработки и развертывания', requiredCompetencies: ['Linux', 'Docker', 'CI/CD'], educationPrograms: [{ name: 'Информатика и вычислительная техника', institution: 'МГТУ', duration: '4 года' }] },
    { id: 5, name: 'Инженер-конструктор', field: 'Инженерия', avgSalary: 120000, demand: 'medium', matchScore: 72, description: 'Проектирование технических конструкций и механизмов', requiredCompetencies: ['САПР', 'Физика', 'Черчение'], educationPrograms: [{ name: 'Машиностроение', institution: 'МГТУ', duration: '4 года' }] },
    { id: 6, name: 'Финансовый аналитик', field: 'Экономика', avgSalary: 140000, demand: 'medium', matchScore: 65, description: 'Анализ финансовых показателей и прогнозирование', requiredCompetencies: ['Экономика', 'Статистика', 'Excel'], educationPrograms: [{ name: 'Экономика', institution: 'РЭУ', duration: '4 года' }] },
    { id: 7, name: 'Кибербезопасность', field: 'IT', avgSalary: 170000, demand: 'high', matchScore: 80, description: 'Защита информационных систем от угроз', requiredCompetencies: ['Сети', 'Linux', 'Криптография'], educationPrograms: [{ name: 'Информационная безопасность', institution: 'МИФИ', duration: '4 года' }] },
    { id: 8, name: 'UX/UI дизайнер', field: 'Дизайн', avgSalary: 130000, demand: 'medium', matchScore: 45, description: 'Проектирование интерфейсов и пользовательского опыта', requiredCompetencies: ['Figma', 'Типографика', 'Исследования'], educationPrograms: [{ name: 'Дизайн', institution: 'Школа дизайна ВШЭ', duration: '4 года' }] },
    { id: 9, name: 'Робототехник', field: 'Инженерия', avgSalary: 150000, demand: 'medium', matchScore: 70, description: 'Разработка и программирование робототехнических систем', requiredCompetencies: ['Электроника', 'Программирование', 'Механика'], educationPrograms: [{ name: 'Мехатроника и робототехника', institution: 'ИТМО', duration: '4 года' }] },
    { id: 10, name: 'Биоинформатик', field: 'Наука', avgSalary: 130000, demand: 'medium', matchScore: 55, description: 'Применение IT в биологических исследованиях', requiredCompetencies: ['Python', 'Биология', 'Статистика'], educationPrograms: [{ name: 'Биоинформатика', institution: 'СПбГУ', duration: '4 года' }] }
  ],

  trajectory: {
    stages: [
      { id: 1, name: 'Профильные курсы ЕГЭ', type: 'education', duration: '6 месяцев', institution: 'Лицей №15', status: 'completed' },
      { id: 2, name: 'Онлайн-курс Python', type: 'education', duration: '3 месяца', institution: 'Stepik', status: 'in_progress' },
      { id: 3, name: 'Бакалавриат «Программная инженерия»', type: 'education', duration: '4 года', institution: 'МГУ', status: 'planned' },
      { id: 4, name: 'Стажировка в IT-компании', type: 'practice', duration: '3 месяца', institution: 'Яндекс', status: 'planned' },
      { id: 5, name: 'Сертификация AWS', type: 'certification', duration: '1 месяц', institution: 'Amazon', status: 'planned' }
    ],
    recommendations: [
      'На основе диагностики рекомендовано направление «Программная инженерия»',
      'Для повышения конкурентоспособности стоит пройти стажировку начиная с 3 курса',
      'Сертификация в облачных технологиях значительно увеличит шансы на трудоустройство'
    ]
  },

  learningTrajectoriesOverview: {
    intro:
      'Траектория обучения — последовательность образовательных и практических этапов.',
    glossary: [
      {
        term: 'Общая траектория',
        definition:
          'Базовый маршрут в рамках программы или набора курсов: обязательные модули, контрольные точки, типовой календарь. Отражает основную цель подготовки.'
      },
      {
        term: 'Дополнительная траектория',
        definition:
          'Расширение к общему пути: практика у работодателя, проектные школы, менторство, мероприятия карьерного цикла. Часто фиксируется на странице взаимодействия с работодателями.'
      }
    ],
    generalTrajectories: [
      {
        id: 1,
        title: 'Программа среднего профессионального образования',
        audience: 'Студенты колледжа, кураторы групп',
        description: 'Последовательность дисциплин и практик по учебному плану с промежуточной аттестацией.',
        keyStages: ['Вводный модуль', 'Теоретическое ядро', 'Производственная практика', 'Госэкзамен / диплом'],
        tag: 'СПО',
        status: 'active',
        progressPercent: 72,
        accent: 'primary'
      },
      {
        id: 2,
        title: 'Модульный маршрут по направлению',
        audience: 'Студенты вуза, методисты',
        description: 'Гибкая цепочка курсов и элективов в рамках одной специализации с накоплением компетенций.',
        keyStages: ['Базовый блок', 'Профильные модули', 'Научно-исследовательская работа', 'Итоговая аттестация'],
        tag: 'ВО',
        status: 'active',
        progressPercent: 45,
        accent: 'success'
      },
      {
        id: 3,
        title: 'Подготовка абитуриента',
        audience: 'Абитуриенты, профориентация',
        description: 'Связка диагностики, целевых курсов и личного плана поступления.',
        keyStages: ['Диагностика интересов', 'Профильные курсы', 'Выбор вуза и программы', 'Вступительные испытания'],
        tag: 'Профориентация',
        status: 'draft',
        accent: 'info'
      }
    ],
    additionalTrajectories: [
      {
        id: 1,
        title: 'Практика и стажировка у партнёра',
        description: 'Офсетные часы на площадке работодателя с куратором от организации и от колледжа.',
        context: 'Договор с работодателем, журнал практики, отчёт.',
        tag: 'Практика',
        status: 'active',
        progressPercent: 60,
        accent: 'primary'
      },
      {
        id: 2,
        title: 'Карьерные мероприятия и кейс-чемпионаты',
        description: 'Серия внеучебных активностей, повышающих вовлечённость и знакомство с отраслью.',
        context: 'Календарь мероприятий, регистрация, учёт участия.',
        tag: 'Мероприятия',
        status: 'active',
        progressPercent: 88,
        accent: 'success'
      },
      {
        id: 3,
        title: 'Менторство и проект с индустрией',
        description: 'Индивидуальное сопровождение и прикладной проект под задачи компании.',
        context: 'Назначение наставника, промежуточные ревью, защита результатов.',
        tag: 'Проект',
        status: 'archived',
        accent: 'secondary'
      },
      {
        id: 4,
        title: 'Дополнительный модуль без явного контекста (демо пустого поля)',
        description: 'Короткое описание для проверки верстки при отсутствии блока контекста.',
        tag: 'Тест',
        status: 'draft',
        accent: 'info'
      }
    ],
    summaryStats: {
      trajectoryTemplates: 12,
      employerLinkedPrograms: 5,
      activeRoutes: 28,
      lastUpdated: '2026-04-12'
    }
  },

  learningTrajectoriesOverviewHeavy: {
    intro:
      'Траектория обучения — последовательность образовательных и практических этапов.',
    glossary: [
      {
        term: 'Общая траектория',
        definition:
          'Базовый маршрут в рамках программы или набора курсов: обязательные модули, контрольные точки, типовой календарь. Отражает основную цель подготовки.'
      },
      {
        term: 'Дополнительная траектория',
        definition:
          'Расширение к общему пути: практика у работодателя, проектные школы, менторство, мероприятия карьерного цикла.'
      },
      {
        term: 'Шаблон',
        definition: 'Сохранённый типовой маршрут, который можно назначить группе или программе.'
      }
    ],
    generalTrajectories: [
      {
        id: 101,
        title: 'Очень длинное название образовательной траектории для проверки переноса в карточке и заголовков на узких экранах мобильных устройств',
        audience: 'Методисты, заведующие отделениями, администраторы программ',
        description:
          'Демонстрационное описание из более чем трёхсот символов: траектория объединяет обязательные дисциплины, междисциплинарные проекты, промежуточную и итоговую аттестацию, а также точки контроля качества освоения компетенций. Такой текст проверяет перенос строк, ограничение высоты и кнопку «Развернуть» в интерфейсе. Дополнительно можно учитывать индивидуальные траектории в рамках элективного блока и факультативов без выхода за рамки учебного плана.',
        keyStages: ['Вводный семестр', 'База дисциплин', 'Профиль', 'Практика I', 'Практика II', 'Преддипломная практика', 'ГИА', 'Диплом', 'Архивация портфолио', 'Обратная связь'],
        tag: 'Длинный текст',
        status: 'active',
        progressPercent: 33,
        accent: 'primary'
      },
      {
        id: 102,
        title: 'Короткий маршрут',
        description: 'Без аудитории — проверка верстки.',
        keyStages: ['Шаг 1', 'Шаг 2'],
        tag: 'Минимум',
        status: 'draft',
        accent: 'success'
      },
      {
        id: 103,
        title: 'Маршрут «Цифровая кафедра»',
        audience: 'Студенты очной формы',
        description: 'Смешанное обучение с онлайн-модулями.',
        keyStages: ['Онбординг LMS', 'Синхронные вебинары', 'Асинхронные модули', 'Экзамен'],
        tag: 'Смешанное',
        status: 'active',
        progressPercent: 91,
        accent: 'info'
      },
      {
        id: 104,
        title: 'Дополнительное общее направление A',
        audience: 'Группы 1–4 курса',
        description: 'Нагрузочный список карточек.',
        keyStages: ['М1', 'М2', 'М3'],
        tag: 'Нагрузка',
        status: 'active',
        progressPercent: 10,
        accent: 'primary'
      },
      {
        id: 105,
        title: 'Дополнительное общее направление B',
        audience: 'Группы 2–3 курса',
        description: 'Нагрузочный список карточек.',
        keyStages: ['М1', 'М2'],
        tag: 'Нагрузка',
        status: 'archived',
        accent: 'secondary'
      },
      {
        id: 106,
        title: 'Дополнительное общее направление C',
        audience: 'Магистратура',
        description: 'Нагрузочный список карточек.',
        keyStages: ['М1', 'М2', 'М3', 'М4'],
        tag: 'Магистратура',
        status: 'active',
        progressPercent: 55,
        accent: 'success'
      }
    ],
    additionalTrajectories: [
      {
        id: 201,
        title: 'Индустриальный трек с длинным описанием и полным контекстом для QA интерфейса карточек дополнительных траекторий',
        description:
          'Партнёрский трек включает серию воркшопов, ревью кода, демо-день и итоговую защиту перед комиссией работодателя и представителем учебного заведения. Текст специально удлинён для проверки line-clamp и кнопки раскрытия.',
        context:
          'Юридическое соглашение, NDA, график посещений площадки, куратор от компании, куратор от вуза, журнал компетенций, промежуточные отчёты в LMS.',
        tag: 'Индустрия',
        status: 'active',
        progressPercent: 40,
        accent: 'primary'
      },
      {
        id: 202,
        title: 'Краткая доп. траектория',
        description: 'Без контекста.',
        tag: 'Тест',
        status: 'draft',
        accent: 'info'
      },
      {
        id: 203,
        title: 'Волонтёрский модуль',
        description: 'Социальные проекты.',
        context: 'Договор с НКО.',
        tag: 'Вне аудитории',
        status: 'active',
        progressPercent: 100,
        accent: 'success'
      },
      {
        id: 204,
        title: 'Зимняя школа',
        description: 'Интенсив.',
        context: 'Регистрация, квоты.',
        tag: 'Школа',
        status: 'active',
        progressPercent: 0,
        accent: 'primary'
      },
      {
        id: 205,
        title: 'Архивный партнёрский набор',
        description: 'Завершён.',
        context: 'Архив 2024.',
        tag: 'Архив',
        status: 'archived',
        accent: 'secondary'
      }
    ],
    summaryStats: {
      trajectoryTemplates: 48,
      employerLinkedPrograms: 17,
      activeRoutes: 132,
      lastUpdated: '2026-04-13'
    }
  },

  gapAnalysis: {
    gaps: [
      { specialization: 'Backend-разработка', studentInterest: 85, employerDemand: 92, gap: -7 },
      { specialization: 'Data Science', studentInterest: 78, employerDemand: 88, gap: -10 },
      { specialization: 'Кибербезопасность', studentInterest: 45, employerDemand: 85, gap: -40 },
      { specialization: 'DevOps', studentInterest: 35, employerDemand: 80, gap: -45 },
      { specialization: 'Frontend-разработка', studentInterest: 70, employerDemand: 65, gap: 5 },
      { specialization: 'Мобильная разработка', studentInterest: 60, employerDemand: 72, gap: -12 },
      { specialization: 'Дизайн интерфейсов', studentInterest: 55, employerDemand: 40, gap: 15 },
      { specialization: 'Робототехника', studentInterest: 68, employerDemand: 50, gap: 18 }
    ],
    recommendations: [
      'Необходимо повысить интерес студентов к кибербезопасности и DevOps — высокий спрос работодателей',
      'Направление Frontend-разработки и дизайна перенасыщено — стоит перенаправить часть студентов',
      'Рекомендуется организовать мастер-классы от компаний по наиболее дефицитным направлениям'
    ],
    summary: { totalStudents: 245, avgGap: 12.4, criticalGaps: 2 }
  },

  careerEvents: [
    { id: 1, title: 'Мастер-класс «Введение в Data Science»', type: 'masterclass', date: '2026-03-20T14:00:00', location: 'Аудитория 305', description: 'Знакомство с основами анализа данных', participantsCount: 28, maxParticipants: 40, status: 'upcoming', organizer: 'Петрова А.В.' },
    { id: 2, title: 'Экскурсия в офис Яндекса', type: 'excursion', date: '2026-03-25T10:00:00', location: 'Офис Яндекс, Москва', description: 'Знакомство с работой IT-компании', participantsCount: 40, maxParticipants: 40, status: 'upcoming', organizer: 'Сидоров К.П.' },
    { id: 3, title: 'Ярмарка профессий 2026', type: 'fair', date: '2026-04-10T09:00:00', location: 'Актовый зал', description: 'Презентация профессий от работодателей региона', participantsCount: 0, maxParticipants: 200, status: 'upcoming', organizer: 'Администрация' },
    { id: 4, title: 'Лекция «Профессии будущего»', type: 'lecture', date: '2026-02-15T15:00:00', location: 'Онлайн', description: 'Обзор перспективных профессий на 2030 год', participantsCount: 65, maxParticipants: 100, status: 'completed', organizer: 'Козлова М.И.' },
    { id: 5, title: 'Воркшоп «Создай свое резюме»', type: 'workshop', date: '2026-02-28T13:00:00', location: 'Аудитория 210', description: 'Практическое занятие по составлению резюме', participantsCount: 22, maxParticipants: 30, status: 'completed', organizer: 'Петрова А.В.' },
    { id: 6, title: 'Встреча с работодателями IT-сферы', type: 'masterclass', date: '2026-04-15T11:00:00', location: 'Конференц-зал', description: 'Панельная дискуссия с представителями IT-компаний', participantsCount: 12, maxParticipants: 50, status: 'upcoming', organizer: 'Сидоров К.П.' },
    { id: 7, title: 'Экскурсия на завод', type: 'excursion', date: '2026-01-20T09:00:00', location: 'ЗАО «Промтех»', description: 'Знакомство с инженерными профессиями', participantsCount: 35, maxParticipants: 35, status: 'completed', organizer: 'Козлова М.И.' },
    { id: 8, title: 'Хакатон для школьников', type: 'workshop', date: '2026-05-10T10:00:00', location: 'IT-парк', description: 'Командный хакатон по разработке приложений', participantsCount: 5, maxParticipants: 60, status: 'upcoming', organizer: 'Администрация' }
  ],

  monitoringData: {
    coverage: { total: 320, covered: 245, percentage: 76.6 },
    engagement: [
      { month: 'Октябрь', participation: 62, satisfaction: 78 },
      { month: 'Ноябрь', participation: 71, satisfaction: 82 },
      { month: 'Декабрь', participation: 58, satisfaction: 75 },
      { month: 'Январь', participation: 80, satisfaction: 85 },
      { month: 'Февраль', participation: 85, satisfaction: 88 },
      { month: 'Март', participation: 77, satisfaction: 83 }
    ],
    riskGroups: [
      { id: 1, name: 'Смирнов Алексей', group: '11-А', uncertaintyScore: 85, lastActivity: '2026-01-15', riskLevel: 'high' },
      { id: 2, name: 'Волкова Дарья', group: '11-Б', uncertaintyScore: 72, lastActivity: '2026-02-01', riskLevel: 'medium' },
      { id: 3, name: 'Кузнецов Максим', group: '10-В', uncertaintyScore: 90, lastActivity: '2025-12-20', riskLevel: 'high' },
      { id: 4, name: 'Новикова Анна', group: '11-А', uncertaintyScore: 65, lastActivity: '2026-02-20', riskLevel: 'medium' },
      { id: 5, name: 'Морозов Дмитрий', group: '10-А', uncertaintyScore: 78, lastActivity: '2026-01-28', riskLevel: 'high' }
    ],
    professionDemand: [
      { name: 'IT-специалист', demand: 95, trend: 'up' },
      { name: 'Инженер', demand: 78, trend: 'up' },
      { name: 'Врач', demand: 82, trend: 'stable' },
      { name: 'Педагог', demand: 70, trend: 'stable' },
      { name: 'Экономист', demand: 55, trend: 'down' },
      { name: 'Юрист', demand: 48, trend: 'down' },
      { name: 'Дизайнер', demand: 60, trend: 'up' },
      { name: 'Маркетолог', demand: 65, trend: 'stable' }
    ]
  },

  careerAnalytics: {
    kpis: { nps: 72, coverage: 76.6, conversion: 45.2, satisfaction: 83 },
    eventMetrics: [
      { id: 1, name: 'Мастер-класс «Data Science»', type: 'masterclass', participants: 28, satisfaction: 88, impact: 'high' },
      { id: 2, name: 'Экскурсия в Яндекс', type: 'excursion', participants: 40, satisfaction: 95, impact: 'high' },
      { id: 3, name: 'Лекция «Профессии будущего»', type: 'lecture', participants: 65, satisfaction: 78, impact: 'medium' },
      { id: 4, name: 'Воркшоп по резюме', type: 'workshop', participants: 22, satisfaction: 85, impact: 'medium' },
      { id: 5, name: 'Экскурсия на завод', type: 'excursion', participants: 35, satisfaction: 72, impact: 'low' },
      { id: 6, name: 'Ярмарка профессий 2025', type: 'fair', participants: 180, satisfaction: 80, impact: 'high' }
    ],
    trends: [
      { month: 'Октябрь', events: 3, participants: 95, satisfaction: 78 },
      { month: 'Ноябрь', events: 4, participants: 120, satisfaction: 82 },
      { month: 'Декабрь', events: 2, participants: 60, satisfaction: 75 },
      { month: 'Январь', events: 5, participants: 155, satisfaction: 85 },
      { month: 'Февраль', events: 4, participants: 130, satisfaction: 88 },
      { month: 'Март', events: 3, participants: 105, satisfaction: 83 }
    ]
  },

  reportTemplates: [
    { id: 1, name: 'Отчет по профориентационной работе', description: 'Сводный отчет по всем мероприятиям за период', format: 'pdf', sections: ['Обзор мероприятий', 'Охват', 'Удовлетворенность', 'Рекомендации'] },
    { id: 2, name: 'Аналитика по учащимся', description: 'Детальный отчет по результатам диагностик учащихся', format: 'xlsx', sections: ['Результаты диагностик', 'Распределение по интересам', 'Группы риска'] },
    { id: 3, name: 'Отчет по трудоустройству', description: 'Статистика трудоустройства выпускников', format: 'pdf', sections: ['Статистика', 'Распределение по отраслям', 'Средняя зарплата'] },
    { id: 4, name: 'Мониторинг качества', description: 'Оценка качества профориентационных мероприятий', format: 'docx', sections: ['KPI', 'Оценки мероприятий', 'Тренды', 'План улучшений'] }
  ],

  studentsList: [
    { id: 1, firstName: 'Иван', lastName: 'Петров', middleName: 'Сергеевич', group: '11-А', course: 'Информатика', status: 'active', email: 'petrov@example.ru', enrollmentDate: '2024-09-01', diagnosticsCompleted: true, trajectoryBuilt: true },
    { id: 2, firstName: 'Мария', lastName: 'Сидорова', middleName: 'Алексеевна', group: '11-А', course: 'Математика', status: 'active', email: 'sidorova@example.ru', enrollmentDate: '2024-09-01', diagnosticsCompleted: true, trajectoryBuilt: false },
    { id: 3, firstName: 'Алексей', lastName: 'Смирнов', middleName: 'Дмитриевич', group: '11-Б', course: 'Физика', status: 'active', email: 'smirnov@example.ru', enrollmentDate: '2024-09-01', diagnosticsCompleted: false, trajectoryBuilt: false },
    { id: 4, firstName: 'Елена', lastName: 'Козлова', middleName: 'Игоревна', group: '11-Б', course: 'Информатика', status: 'active', email: 'kozlova@example.ru', enrollmentDate: '2024-09-01', diagnosticsCompleted: true, trajectoryBuilt: true },
    { id: 5, firstName: 'Дмитрий', lastName: 'Волков', middleName: 'Петрович', group: '10-А', course: 'Математика', status: 'active', email: 'volkov@example.ru', enrollmentDate: '2025-09-01', diagnosticsCompleted: false, trajectoryBuilt: false },
    { id: 6, firstName: 'Анна', lastName: 'Новикова', middleName: 'Андреевна', group: '10-А', course: 'Биология', status: 'active', email: 'novikova@example.ru', enrollmentDate: '2025-09-01', diagnosticsCompleted: true, trajectoryBuilt: false },
    { id: 7, firstName: 'Максим', lastName: 'Кузнецов', middleName: 'Олегович', group: '10-В', course: 'Химия', status: 'inactive', email: 'kuznetsov@example.ru', enrollmentDate: '2025-09-01', diagnosticsCompleted: false, trajectoryBuilt: false },
    { id: 8, firstName: 'Ольга', lastName: 'Морозова', middleName: 'Викторовна', group: '11-В', course: 'Экономика', status: 'active', email: 'morozova@example.ru', enrollmentDate: '2024-09-01', diagnosticsCompleted: true, trajectoryBuilt: true },
    { id: 9, firstName: 'Артем', lastName: 'Лебедев', middleName: 'Николаевич', group: '11-А', course: 'Информатика', status: 'graduated', email: 'lebedev@example.ru', enrollmentDate: '2023-09-01', diagnosticsCompleted: true, trajectoryBuilt: true },
    { id: 10, firstName: 'Дарья', lastName: 'Попова', middleName: 'Сергеевна', group: '10-Б', course: 'Литература', status: 'active', email: 'popova@example.ru', enrollmentDate: '2025-09-01', diagnosticsCompleted: false, trajectoryBuilt: false }
  ],

  dashboardData: {
    student: {
      stats: {
        enrolledCourses: { value: 5, label: 'Записанных курсов', trend: 2, icon: 'BookOpen', color: 'primary' },
        completedTests: { value: 12, label: 'Пройденных тестов', trend: 3, icon: 'FileCheck', color: 'success' },
        earnedBadges: { value: 3, label: 'Получено значков', trend: 1, icon: 'Award', color: 'warning' },
        studyHours: { value: 47, label: 'Часов обучения', trend: 8, icon: 'Clock', color: 'info' }
      },
      recentCourses: [
        { id: 101, name: 'Основы Python', category: 'Программирование', instructor: 'Иванова А.С.', progress: 72, lastAccess: '2026-03-04T18:30:00', status: 'active', lessonsTotal: 24, lessonsCompleted: 17 },
        { id: 102, name: 'Веб-разработка (HTML/CSS)', category: 'Веб-технологии', instructor: 'Петров Д.В.', progress: 45, lastAccess: '2026-03-03T14:15:00', status: 'active', lessonsTotal: 18, lessonsCompleted: 8 },
        { id: 103, name: 'Математический анализ', category: 'Математика', instructor: 'Козлова Е.И.', progress: 88, lastAccess: '2026-03-05T09:00:00', status: 'active', lessonsTotal: 32, lessonsCompleted: 28 },
        { id: 104, name: 'Английский язык B2', category: 'Языки', instructor: 'Smith J.', progress: 34, lastAccess: '2026-03-01T16:45:00', status: 'active', lessonsTotal: 40, lessonsCompleted: 14 },
        { id: 105, name: 'Основы Data Science', category: 'Аналитика', instructor: 'Сидоров М.К.', progress: 15, lastAccess: '2026-02-28T11:20:00', status: 'active', lessonsTotal: 20, lessonsCompleted: 3 }
      ],
      upcomingEvents: [
        { id: 1, title: 'Контрольная работа по Python', type: 'test', date: '2026-03-07T10:00:00', location: 'Аудитория 305', description: 'Модуль 3: Функции и ООП' },
        { id: 2, title: 'Вебинар: Карьера в IT', type: 'webinar', date: '2026-03-08T15:00:00', location: 'Онлайн (Zoom)', description: 'Гостевая лекция от Яндекс' },
        { id: 3, title: 'Дедлайн: Проект по HTML', type: 'deadline', date: '2026-03-10T23:59:00', location: null, description: 'Сдача финального проекта' },
        { id: 4, title: 'Лекция: Интегралы', type: 'lecture', date: '2026-03-11T09:00:00', location: 'Аудитория 201', description: 'Определенные интегралы' },
        { id: 5, title: 'Практика: SQL запросы', type: 'practice', date: '2026-03-12T14:00:00', location: 'Комп. класс 3', description: 'Работа с реальными данными' }
      ],
      notifications: [
        { id: 1, type: 'grading', message: 'Преподаватель оценил задание «Функции в Python» — 95 баллов', createdAt: '2026-03-05T08:30:00', read: false },
        { id: 2, type: 'assignment', message: 'Новое задание в курсе «Веб-разработка»: Адаптивная верстка', createdAt: '2026-03-04T16:00:00', read: false },
        { id: 3, type: 'badge', message: 'Вы получили значок «Прилежный студент» за 7 дней подряд', createdAt: '2026-03-03T12:00:00', read: true },
        { id: 4, type: 'enrollment', message: 'Вы успешно записаны на курс «Основы Data Science»', createdAt: '2026-03-01T10:00:00', read: true },
        { id: 5, type: 'info', message: 'Плановое обслуживание платформы 12 марта с 02:00 до 04:00', createdAt: '2026-02-28T18:00:00', read: true },
        { id: 6, type: 'grading', message: 'Тест «Основы HTML» проверен — результат: 88/100', createdAt: '2026-02-27T14:20:00', read: true },
        { id: 7, type: 'warning', message: 'Дедлайн по проекту «REST API на Django» через 6 часов', createdAt: '2026-03-05T12:10:00', read: false },
        { id: 8, type: 'assignment', message: 'В курсе «Data Science» опубликовано практическое задание «Очистка датасета»', createdAt: '2026-03-05T10:25:00', read: false },
        { id: 9, type: 'info', message: 'Расписание вебинара «Карьера в IT» обновлено: начало в 16:00', createdAt: '2026-03-05T09:50:00', read: false },
        { id: 10, type: 'success', message: 'Домашняя работа «Адаптивная галерея» успешно отправлена на проверку', createdAt: '2026-03-04T21:05:00', read: true },
        { id: 11, type: 'error', message: 'Не удалось прикрепить файл к заданию «SQL-запросы». Повторите загрузку.', createdAt: '2026-03-04T20:10:00', read: false },
        { id: 12, type: 'badge', message: 'Открыт прогресс по достижению «Марафонец»: 47 из 100 часов', createdAt: '2026-03-04T19:15:00', read: true },
        { id: 13, type: 'grading', message: 'Промежуточный тест по SQL проверен — результат: 92/100', createdAt: '2026-03-04T18:30:00', read: false },
        { id: 14, type: 'enrollment', message: 'Вы добавлены в учебную группу «Python Advanced Evening»', createdAt: '2026-03-04T17:40:00', read: true },
        { id: 15, type: 'warning', message: 'У вас 2 непройденных обязательных урока в курсе «Основы Python»', createdAt: '2026-03-03T19:45:00', read: true },
        { id: 16, type: 'info', message: 'Преподаватель оставил комментарий к вашему ответу в форуме курса', createdAt: '2026-03-03T17:20:00', read: false },
        { id: 17, type: 'success', message: 'Синхронизация календаря с личным расписанием завершена', createdAt: '2026-03-03T08:10:00', read: true },
        { id: 18, type: 'assignment', message: 'Открыт доступ к заданию «Семантическая верстка лендинга»', createdAt: '2026-03-02T15:00:00', read: true }
      ],
      achievements: [
        { id: 1, title: 'Первый шаг', description: 'Завершить первый урок', icon: 'Rocket', earned: true, earnedAt: '2026-01-15T10:00:00' },
        { id: 2, title: 'Прилежный студент', description: '7 дней обучения подряд', icon: 'Flame', earned: true, earnedAt: '2026-03-03T12:00:00' },
        { id: 3, title: 'Отличник', description: 'Получить 90+ баллов за 5 заданий', icon: 'Star', earned: true, earnedAt: '2026-02-20T16:00:00' },
        { id: 4, title: 'Полиглот', description: 'Записаться на 3 курса из разных категорий', icon: 'Globe', earned: false, progress: 66 },
        { id: 5, title: 'Марафонец', description: 'Набрать 100 часов обучения', icon: 'Timer', earned: false, progress: 47 }
      ],
      weeklyActivity: [
        { day: 'Пн', hours: 2.5 },
        { day: 'Вт', hours: 1.0 },
        { day: 'Ср', hours: 3.0 },
        { day: 'Чт', hours: 0.5 },
        { day: 'Пт', hours: 2.0 },
        { day: 'Сб', hours: 4.0 },
        { day: 'Вс', hours: 1.5 }
      ]
    },
    teacher: {
      stats: {
        createdCourses: { value: 8, label: 'Активных курсов', trend: 1, icon: 'BookOpen', color: 'primary' },
        totalStudents: { value: 156, label: 'Всего студентов', trend: 12, icon: 'Users', color: 'success' },
        pendingGrades: { value: 23, label: 'К проверке', trend: -5, icon: 'ClipboardCheck', color: 'warning' },
        teachingHours: { value: 320, label: 'Часов преподавания', trend: 15, icon: 'Clock', color: 'info' }
      },
      recentCourses: [
        { id: 201, name: 'Основы Python', category: 'Программирование', instructor: 'Вы', progress: 85, lastAccess: '2026-03-05T09:00:00', status: 'active', studentsCount: 45, lessonsTotal: 24 },
        { id: 202, name: 'Продвинутый Python', category: 'Программирование', instructor: 'Вы', progress: 60, lastAccess: '2026-03-04T14:00:00', status: 'active', studentsCount: 28, lessonsTotal: 30 },
        { id: 203, name: 'Алгоритмы и структуры данных', category: 'Информатика', instructor: 'Вы', progress: 40, lastAccess: '2026-03-03T11:00:00', status: 'active', studentsCount: 35, lessonsTotal: 20 },
        { id: 204, name: 'Базы данных (SQL)', category: 'Базы данных', instructor: 'Вы', progress: 95, lastAccess: '2026-03-05T10:30:00', status: 'active', studentsCount: 48, lessonsTotal: 16 }
      ],
      upcomingEvents: [
        { id: 1, title: 'Проверка контрольной по Python', type: 'deadline', date: '2026-03-07T18:00:00', location: null, description: '45 работ к проверке' },
        { id: 2, title: 'Лекция: Рекурсия', type: 'lecture', date: '2026-03-08T09:00:00', location: 'Аудитория 305', description: 'Курс «Алгоритмы»' },
        { id: 3, title: 'Совещание кафедры', type: 'meeting', date: '2026-03-10T14:00:00', location: 'Каб. 410', description: 'Обсуждение учебного плана' },
        { id: 4, title: 'Вебинар для студентов', type: 'webinar', date: '2026-03-12T15:00:00', location: 'Онлайн', description: 'Разбор домашних заданий' }
      ],
      notifications: [
        { id: 1, type: 'assignment', message: '12 новых работ отправлены на проверку по курсу «Основы Python»', createdAt: '2026-03-05T07:00:00', read: false },
        { id: 2, type: 'info', message: 'Студент Петров И.С. задал вопрос в форуме курса «Продвинутый Python»', createdAt: '2026-03-04T20:30:00', read: false },
        { id: 3, type: 'success', message: 'Курс «Базы данных» прошел модерацию и опубликован', createdAt: '2026-03-03T10:00:00', read: true },
        { id: 4, type: 'warning', message: '5 студентов не сдали задание в срок по курсу «Алгоритмы»', createdAt: '2026-03-02T09:00:00', read: true }
      ],
      achievements: [
        { id: 1, title: 'Наставник', description: 'Обучить 100 студентов', icon: 'GraduationCap', earned: true, earnedAt: '2026-02-15T10:00:00' },
        { id: 2, title: 'Контент-мейкер', description: 'Создать 5 курсов', icon: 'PenTool', earned: true, earnedAt: '2026-01-20T14:00:00' },
        { id: 3, title: 'Высокий рейтинг', description: 'Средняя оценка курсов 4.5+', icon: 'Star', earned: true, earnedAt: '2026-03-01T12:00:00' },
        { id: 4, title: 'Эксперт', description: 'Провести 500 часов занятий', icon: 'Award', earned: false, progress: 64 }
      ],
      weeklyActivity: [
        { day: 'Пн', hours: 6.0 },
        { day: 'Вт', hours: 4.5 },
        { day: 'Ср', hours: 5.0 },
        { day: 'Чт', hours: 7.0 },
        { day: 'Пт', hours: 3.5 },
        { day: 'Сб', hours: 2.0 },
        { day: 'Вс', hours: 0 }
      ]
    },
    admin: {
      stats: {
        totalCourses: { value: 42, label: 'Всего курсов', trend: 5, icon: 'BookOpen', color: 'primary' },
        totalStudents: { value: 1250, label: 'Всего студентов', trend: 87, icon: 'Users', color: 'success' },
        totalTeachers: { value: 18, label: 'Преподавателей', trend: 2, icon: 'GraduationCap', color: 'warning' },
        systemHealth: { value: 98, label: 'Здоровье системы (%)', trend: 1, icon: 'Activity', color: 'info' }
      },
      recentCourses: [
        { id: 301, name: 'Основы Python', category: 'Программирование', instructor: 'Иванова А.С.', progress: 85, status: 'active', studentsCount: 45, rating: 4.8 },
        { id: 302, name: 'Маркетинг для начинающих', category: 'Бизнес', instructor: 'Сидорова М.В.', progress: 100, status: 'completed', studentsCount: 32, rating: 4.5 },
        { id: 303, name: 'UI/UX Дизайн', category: 'Дизайн', instructor: 'Козлов Р.Н.', progress: 55, status: 'active', studentsCount: 28, rating: 4.7 },
        { id: 304, name: 'Управление проектами', category: 'Менеджмент', instructor: 'Волкова Т.А.', progress: 20, status: 'draft', studentsCount: 0, rating: null }
      ],
      upcomingEvents: [
        { id: 1, title: 'Обновление платформы v2.5', type: 'system', date: '2026-03-08T02:00:00', location: 'Серверная', description: 'Плановое обновление' },
        { id: 2, title: 'Педагогический совет', type: 'meeting', date: '2026-03-10T10:00:00', location: 'Конференц-зал', description: 'Итоги полугодия' },
        { id: 3, title: 'Запуск нового курса', type: 'launch', date: '2026-03-15T09:00:00', location: null, description: '«Машинное обучение»' },
        { id: 4, title: 'Аудит безопасности', type: 'system', date: '2026-03-20T14:00:00', location: null, description: 'Ежеквартальная проверка' }
      ],
      notifications: [
        { id: 1, type: 'warning', message: 'Дисковое пространство заполнено на 85% — рекомендуется очистка', createdAt: '2026-03-05T06:00:00', read: false },
        { id: 2, type: 'success', message: 'Новый преподаватель Волкова Т.А. зарегистрирована в системе', createdAt: '2026-03-04T11:00:00', read: false },
        { id: 3, type: 'info', message: '87 новых студентов зарегистрировались за последнюю неделю', createdAt: '2026-03-03T09:00:00', read: true },
        { id: 4, type: 'error', message: 'Ошибка синхронизации с Moodle — требуется проверка настроек', createdAt: '2026-03-02T14:30:00', read: true },
        { id: 5, type: 'info', message: 'Резервная копия базы данных успешно создана', createdAt: '2026-03-01T03:00:00', read: true }
      ],
      achievements: [
        { id: 1, title: 'Основатель', description: 'Запустить платформу', icon: 'Rocket', earned: true, earnedAt: '2025-09-01T10:00:00' },
        { id: 2, title: 'Масштаб', description: 'Достичь 1000 студентов', icon: 'TrendingUp', earned: true, earnedAt: '2026-02-10T12:00:00' },
        { id: 3, title: 'Библиотека', description: 'Опубликовать 50 курсов', icon: 'Library', earned: false, progress: 84 },
        { id: 4, title: 'Стабильность', description: '99.9% аптайм за квартал', icon: 'Shield', earned: false, progress: 92 }
      ],
      weeklyActivity: [
        { day: 'Пн', hours: 3.0 },
        { day: 'Вт', hours: 4.0 },
        { day: 'Ср', hours: 2.5 },
        { day: 'Чт', hours: 5.0 },
        { day: 'Пт', hours: 3.5 },
        { day: 'Сб', hours: 1.0 },
        { day: 'Вс', hours: 0.5 }
      ]
    }
  },

  integrations: [
    { id: 1, name: 'Moodle LMS', type: 'moodle', status: 'connected', lastSync: '2026-03-04T18:30:00', settings: { url: 'https://moodle.example.ru', apiKey: '****-****-****-1234' }, description: 'Импорт курсов и оценок из Moodle' },
    { id: 2, name: '1С: Образование', type: '1c', status: 'connected', lastSync: '2026-03-04T12:00:00', settings: { url: 'https://1c.example.ru', apiKey: '****-****-****-5678' }, description: 'Синхронизация данных учащихся и сотрудников' },
    { id: 3, name: 'Портал «Работа России»', type: 'other', status: 'disconnected', lastSync: null, settings: { url: '', apiKey: '' }, description: 'Импорт данных о вакансиях и рынке труда' },
    { id: 4, name: 'Электронный дневник', type: 'other', status: 'error', lastSync: '2026-02-28T08:00:00', settings: { url: 'https://diary.example.ru', apiKey: '****-****-****-9012' }, description: 'Синхронизация успеваемости учащихся' }
  ],

  studyPlans: [
    {
      id: 1,
      code: '09.03.04-1',
      name: 'Программная инженерия, очная форма, 4 года',
      level: 'Бакалавриат',
      status: 'published',
      totalHours: 3888,
      credits: 240,
      academicYear: '2025/2026',
      completionPercent: 100,
      updatedAt: '2026-03-01T14:20:00',
      author: 'Кафедра программной инженерии',
      modules: [
        { order: 1, title: 'Информатика и программирование', hours: 540, type: 'lecture' },
        { order: 2, title: 'Дискретная математика', hours: 216, type: 'mixed' },
        { order: 3, title: 'Алгоритмы и структуры данных', hours: 288, type: 'practice' },
        { order: 4, title: 'Базы данных', hours: 180, type: 'mixed' },
        { order: 5, title: 'Государственный экзамен (защита ВКР)', hours: 216, type: 'exam' }
      ]
    },
    {
      id: 2,
      code: '01.04.02-маг',
      name: 'Прикладная математика и информатика (профиль «Машинное обучение»), магистратура',
      level: 'Магистратура',
      status: 'review',
      totalHours: 1872,
      credits: 120,
      academicYear: '2025/2026',
      completionPercent: 72,
      updatedAt: '2026-03-10T09:45:00',
      author: 'Иванова А.П.',
      modules: [
        { order: 1, title: 'Современные методы оптимизации', hours: 144, type: 'lecture' },
        { order: 2, title: 'Глубокое обучение', hours: 180, type: 'mixed' },
        { order: 3, title: 'Научно-исследовательская практика', hours: 216, type: 'practice' },
        { order: 4, title: 'Подготовка к итоговой аттестации', hours: 72, type: 'exam' }
      ]
    },
    {
      id: 3,
      code: '38.03.05-оч',
      name: 'Бизнес-информатика: цифровая трансформация предприятий',
      level: 'Бакалавриат',
      status: 'draft',
      totalHours: 4032,
      credits: 240,
      academicYear: '2026/2027',
      completionPercent: 28,
      updatedAt: '2026-02-18T16:00:00',
      author: 'Петров Д.С.',
      modules: [
        { order: 1, title: 'Экономика организации', hours: 180, type: 'lecture' },
        { order: 2, title: 'Информационные системы в управлении', hours: 144, type: 'mixed' },
        { order: 3, title: 'Проектный семинар: ERP и CRM', hours: 288, type: 'practice' }
      ]
    },
    {
      id: 4,
      code: '27.03.03-заоч',
      name: 'Системный анализ и управление (заочная форма, ускоренная программа)',
      level: 'Бакалавриат',
      status: 'published',
      totalHours: 3240,
      credits: 240,
      academicYear: '2024/2025',
      completionPercent: 100,
      updatedAt: '2025-12-20T11:30:00',
      author: 'Кафедра системного анализа',
      modules: [
        { order: 1, title: 'Математическое моделирование', hours: 216, type: 'lecture' },
        { order: 2, title: 'Операционные исследования', hours: 180, type: 'mixed' },
        { order: 3, title: 'Системная инженерия', hours: 144, type: 'practice' },
        { order: 4, title: 'Итоговый междисциплинарный экзамен', hours: 72, type: 'exam' }
      ]
    },
    {
      id: 5,
      code: '09.03.01-вк',
      name: 'Информатика и вычислительная техника (вечерняя форма)',
      level: 'Бакалавриат',
      status: 'draft',
      totalHours: 4104,
      credits: 240,
      academicYear: '2026/2027',
      completionPercent: 15,
      updatedAt: '2026-01-05T10:15:00',
      author: 'Сидорова М.К.',
      modules: [
        { order: 1, title: 'Архитектура вычислительных систем', hours: 216, type: 'lecture' },
        { order: 2, title: 'Операционные системы', hours: 180, type: 'mixed' },
        { order: 3, title: 'Сети и телекоммуникации', hours: 144, type: 'practice' },
        { order: 4, title: 'Электив по выбору студента', hours: 108, type: 'mixed' }
      ]
    },
    {
      id: 6,
      code: '40.05.01-асп',
      name: 'Правовое обеспечение национальной безопасности (аспирантура, очно-заочная)',
      level: 'Аспирантура',
      status: 'review',
      totalHours: 936,
      credits: 54,
      academicYear: '2025/2026',
      completionPercent: 55,
      updatedAt: '2026-03-12T13:00:00',
      author: 'Юридический институт',
      modules: [
        { order: 1, title: 'История и философия науки', hours: 180, type: 'lecture' },
        { order: 2, title: 'Иностранный язык в профессиональной деятельности', hours: 144, type: 'practice' },
        { order: 3, title: 'Спецкурс по теме диссертации', hours: 360, type: 'mixed' },
        { order: 4, title: 'Научно-исследовательская работа', hours: 252, type: 'practice' }
      ]
    }
  ],

  workPrograms: [
    {
      id: 1,
      code: 'Б1.В.ОД.3.1.01',
      title: 'Программирование на языке Python',
      department: 'Кафедра информатики и программирования',
      status: 'published',
      totalHours: 180,
      credits: 5,
      semester: '2025/2026, осенний',
      completionPercent: 100,
      updatedAt: '2026-02-28T10:00:00',
      author: 'Козлов А.В.',
      sections: [
        { order: 1, title: 'Цели и задачи дисциплины, место в структуре ОП', hours: 4, type: 'theory' },
        { order: 2, title: 'Содержание теоретического обучения', hours: 72, type: 'theory' },
        { order: 3, title: 'Практические и лабораторные работы', hours: 84, type: 'practice' },
        { order: 4, title: 'Текущий контроль и промежуточная аттестация', hours: 12, type: 'control' },
        { order: 5, title: 'Итоговая аттестация (экзамен)', hours: 8, type: 'control' }
      ]
    },
    {
      id: 2,
      code: 'Б1.В.ОД.2.15',
      title: 'Базы данных и системы управления базами данных',
      department: 'Кафедра прикладной информатики',
      status: 'review',
      totalHours: 144,
      credits: 4,
      semester: '2025/2026, весенний',
      completionPercent: 68,
      updatedAt: '2026-03-08T14:30:00',
      author: 'Новиков И.П.',
      sections: [
        { order: 1, title: 'Компетенции и результаты обучения', hours: 6, type: 'theory' },
        { order: 2, title: 'Реляционная модель и SQL', hours: 48, type: 'mixed' },
        { order: 3, title: 'Проектирование и нормализация', hours: 36, type: 'practice' },
        { order: 4, title: 'Защита курсового проекта', hours: 54, type: 'control' }
      ]
    },
    {
      id: 3,
      code: 'Б1.В.ОД.4.05',
      title: 'Веб-технологии и основы клиентской разработки (HTML, CSS, JavaScript)',
      department: 'Кафедра информатики и программирования',
      status: 'draft',
      totalHours: 216,
      credits: 6,
      semester: '2026/2027, осенний',
      completionPercent: 22,
      updatedAt: '2026-03-01T09:00:00',
      author: 'Петрова М.С.',
      sections: [
        { order: 1, title: 'Рабочая программа и календарный график', hours: 2, type: 'theory' },
        { order: 2, title: 'Верстка и адаптивность', hours: 90, type: 'mixed' },
        { order: 3, title: 'Клиентские сценарии и DOM', hours: 72, type: 'practice' }
      ]
    },
    {
      id: 4,
      code: 'Б1.В.ОД.1.03',
      title: 'Математический анализ',
      department: 'Кафедра высшей математики',
      status: 'published',
      totalHours: 288,
      credits: 8,
      semester: '2024/2025, полный год',
      completionPercent: 100,
      updatedAt: '2025-12-15T16:45:00',
      author: 'Кафедра высшей математики',
      sections: [
        { order: 1, title: 'Пределы и непрерывность', hours: 36, type: 'theory' },
        { order: 2, title: 'Дифференциальное исчисление', hours: 54, type: 'theory' },
        { order: 3, title: 'Интегральное исчисление', hours: 54, type: 'mixed' },
        { order: 4, title: 'Ряды и практикум', hours: 108, type: 'practice' },
        { order: 5, title: 'Экзаменационный блок', hours: 36, type: 'control' }
      ]
    },
    {
      id: 5,
      code: 'Б1.В.ОД.5.12',
      title: 'Экономика и управление проектами в IT',
      department: 'Кафедра менеджмента и экономики',
      status: 'draft',
      totalHours: 108,
      credits: 3,
      semester: '2026/2027, весенний',
      completionPercent: 10,
      updatedAt: '2026-01-20T11:00:00',
      author: 'Волкова Т.А.',
      sections: [
        { order: 1, title: 'Основы экономики для IT-специалистов', hours: 24, type: 'theory' },
        { order: 2, title: 'Управление проектами: Agile/Scrum', hours: 48, type: 'mixed' },
        { order: 3, title: 'Практикум по кейсам', hours: 36, type: 'practice' }
      ]
    },
    {
      id: 6,
      code: 'М1.О.04',
      title: 'Методы машинного обучения',
      department: 'Кафедра искусственного интеллекта',
      status: 'review',
      totalHours: 162,
      credits: 4,
      semester: '2025/2026, весенний',
      completionPercent: 45,
      updatedAt: '2026-03-11T12:15:00',
      author: 'Сидоренко Е.К.',
      sections: [
        { order: 1, title: 'Результаты обучения магистрантов', hours: 4, type: 'theory' },
        { order: 2, title: 'Обучение с учителем и без', hours: 48, type: 'mixed' },
        { order: 3, title: 'Нейросетевые модели', hours: 56, type: 'practice' },
        { order: 4, title: 'Зачёт с устной компонентой', hours: 54, type: 'control' }
      ]
    }
  ],

  lessonsManagement: {
    categories: [
      { id: 1, name: 'Программирование', description: 'Курсы по языкам программирования, алгоритмам и разработке ПО', parent: null, sort_order: 1, is_visible: true, courses_count: 18, icon: 'Code', color: 'primary' },
      { id: 2, name: 'Математика', description: 'Фундаментальные и прикладные математические дисциплины', parent: null, sort_order: 2, is_visible: true, courses_count: 8, icon: 'Calculator', color: 'success' },
      { id: 3, name: 'Языки', description: 'Иностранные языки для профессионального и личного развития', parent: null, sort_order: 3, is_visible: true, courses_count: 5, icon: 'Globe', color: 'info' },
      { id: 4, name: 'Бизнес', description: 'Управление проектами, маркетинг, предпринимательство', parent: null, sort_order: 4, is_visible: true, courses_count: 7, icon: 'Briefcase', color: 'warning' },
      { id: 5, name: 'Дизайн', description: 'UI/UX, графический дизайн, типографика и визуальные коммуникации', parent: null, sort_order: 5, is_visible: true, courses_count: 6, icon: 'Palette', color: 'danger' },
      { id: 6, name: 'Python', description: 'Основы и продвинутый Python, Data Science, автоматизация', parent: 1, sort_order: 1, is_visible: true, courses_count: 8, icon: 'Terminal', color: 'primary' },
      { id: 7, name: 'Веб-разработка', description: 'HTML, CSS, JavaScript, фреймворки и инструменты веб-разработки', parent: 1, sort_order: 2, is_visible: true, courses_count: 6, icon: 'Globe', color: 'primary' },
      { id: 8, name: 'Линейная алгебра', description: 'Матрицы, векторные пространства, линейные отображения', parent: 2, sort_order: 1, is_visible: true, courses_count: 3, icon: 'Grid3x3', color: 'success' },
      { id: 9, name: 'Английский язык', description: 'Общий и технический английский для разных уровней', parent: 3, sort_order: 1, is_visible: true, courses_count: 4, icon: 'BookOpen', color: 'info' },
      { id: 10, name: 'UI/UX дизайн', description: 'Проектирование интерфейсов, прототипирование, юзабилити', parent: 5, sort_order: 1, is_visible: false, courses_count: 3, icon: 'Figma', color: 'danger' }
    ],
    courseFormats: [
      { id: 1, name: 'Онлайн', description: 'Полностью дистанционное обучение с видеоуроками и заданиями', is_active: true, courses_count: 24, icon: 'Wifi' },
      { id: 2, name: 'Гибридный', description: 'Сочетание онлайн-материалов и очных встреч', is_active: true, courses_count: 10, icon: 'Laptop' },
      { id: 3, name: 'Очный', description: 'Традиционное обучение в аудитории с преподавателем', is_active: true, courses_count: 6, icon: 'School' },
      { id: 4, name: 'Самостоятельный', description: 'Обучение в своем темпе без фиксированного расписания', is_active: true, courses_count: 8, icon: 'UserCog' },
      { id: 5, name: 'Интенсив', description: 'Ускоренная программа обучения за короткий срок', is_active: true, courses_count: 3, icon: 'Zap' },
      { id: 6, name: 'Вебинар', description: 'Интерактивные онлайн-занятия в реальном времени', is_active: false, courses_count: 0, icon: 'Video' }
    ],
    courses: [
      {
        id: 1, name: 'Основы Python', description: 'Полный курс по языку Python для начинающих: от основ синтаксиса до ООП и работы с файлами.',
        category: { id: 1, name: 'Программирование' }, course_format: { id: 1, name: 'Онлайн' },
        is_published: true, course_image: null,
        teacher: { id: 1, first_name: 'Анна', last_name: 'Иванова', username: 'ivanova' }
      },
      {
        id: 2, name: 'Веб-разработка (HTML/CSS/JS)', description: 'Создание современных веб-сайтов: верстка, стили, интерактивность.',
        category: { id: 1, name: 'Программирование' }, course_format: { id: 2, name: 'Гибридный' },
        is_published: true, course_image: null,
        teacher: { id: 2, first_name: 'Дмитрий', last_name: 'Петров', username: 'petrov' }
      },
      {
        id: 3, name: 'Математический анализ', description: 'Основы математического анализа: пределы, производные, интегралы.',
        category: { id: 2, name: 'Математика' }, course_format: { id: 3, name: 'Очный' },
        is_published: false, course_image: null,
        teacher: { id: 3, first_name: 'Елена', last_name: 'Козлова', username: 'kozlova' }
      }
    ],
    themes: [
      { id: 1, name: 'Введение в Python', subject: 1, is_visible: true, sort_order: 1 },
      { id: 2, name: 'Управляющие конструкции', subject: 1, is_visible: true, sort_order: 2 },
      { id: 3, name: 'Функции и модули', subject: 1, is_visible: true, sort_order: 3 },
      { id: 4, name: 'HTML-основы', subject: 2, is_visible: true, sort_order: 1 },
      { id: 5, name: 'CSS и адаптивная верстка', subject: 2, is_visible: true, sort_order: 2 },
      { id: 6, name: 'Пределы и непрерывность', subject: 3, is_visible: true, sort_order: 1 },
      { id: 7, name: 'Производные', subject: 3, is_visible: false, sort_order: 2 }
    ],
    lessons: [
      { id: 1, name: 'Установка Python и IDE', description: 'Настройка рабочего окружения для разработки', theme: 1, lessontype: 'L', is_visible: true, completion_required: true, sort_order: 1 },
      { id: 2, name: 'Переменные и типы данных', description: 'Числа, строки, списки, словари', theme: 1, lessontype: 'V', is_visible: true, completion_required: true, sort_order: 2 },
      { id: 3, name: 'Практика: Первая программа', description: 'Написание программы «Hello World» и калькулятора', theme: 1, lessontype: 'A', is_visible: true, completion_required: false, sort_order: 3 },
      { id: 4, name: 'Условные операторы if/else', description: 'Ветвление программы, логические выражения', theme: 2, lessontype: 'L', is_visible: true, completion_required: true, sort_order: 1 },
      { id: 5, name: 'Циклы for и while', description: 'Итерация, range(), break и continue', theme: 2, lessontype: 'V', is_visible: true, completion_required: true, sort_order: 2 },
      { id: 6, name: 'Тест: Управляющие конструкции', description: 'Проверочный тест по теме', theme: 2, lessontype: 'Q', is_visible: true, completion_required: true, sort_order: 3 },
      { id: 7, name: 'Определение функций', description: 'def, аргументы, return, lambda', theme: 3, lessontype: 'L', is_visible: true, completion_required: true, sort_order: 1 },
      { id: 8, name: 'Модули и пакеты', description: 'import, pip, создание собственных модулей', theme: 3, lessontype: 'V', is_visible: true, completion_required: false, sort_order: 2 },
      { id: 9, name: 'Структура HTML-документа', description: 'DOCTYPE, head, body, мета-теги', theme: 4, lessontype: 'L', is_visible: true, completion_required: true, sort_order: 1 },
      { id: 10, name: 'Семантические теги', description: 'header, nav, main, article, footer', theme: 4, lessontype: 'V', is_visible: true, completion_required: false, sort_order: 2 },
      { id: 11, name: 'Практика: Верстка лендинга', description: 'Создание одностраничного сайта', theme: 4, lessontype: 'A', is_visible: true, completion_required: true, sort_order: 3 },
      { id: 12, name: 'Селекторы и свойства CSS', description: 'Каскадность, специфичность, наследование', theme: 5, lessontype: 'L', is_visible: true, completion_required: true, sort_order: 1 },
      { id: 13, name: 'Flexbox и Grid', description: 'Современные способы раскладки элементов', theme: 5, lessontype: 'V', is_visible: true, completion_required: true, sort_order: 2 },
      { id: 14, name: 'Медиа-запросы', description: 'Адаптивность под мобильные устройства', theme: 5, lessontype: 'URL', is_visible: true, completion_required: false, sort_order: 3 },
      { id: 15, name: 'Понятие предела', description: 'Определение, свойства, вычисление пределов', theme: 6, lessontype: 'L', is_visible: true, completion_required: true, sort_order: 1 },
      { id: 16, name: 'Непрерывность функций', description: 'Точки разрыва, теоремы о непрерывности', theme: 6, lessontype: 'V', is_visible: true, completion_required: true, sort_order: 2 },
      { id: 17, name: 'Определение производной', description: 'Геометрический и физический смысл', theme: 7, lessontype: 'L', is_visible: false, completion_required: true, sort_order: 1 },
      { id: 18, name: 'Таблица производных', description: 'Справочный материал с формулами', theme: 7, lessontype: 'FILE', is_visible: false, completion_required: false, sort_order: 2 }
    ],
    tests: [
      { id: 1, title: 'Тест: Основы Python', name: 'Тест: Основы Python', lesson: 3, test_type: 'C', duration_minutes: 20, passing_score: 70, questions_count: 15, sort_order: 1 },
      { id: 2, title: 'Тест: Циклы и условия', name: 'Тест: Циклы и условия', lesson: 6, test_type: 'C', duration_minutes: 30, passing_score: 75, questions_count: 20, sort_order: 1 },
      { id: 3, title: 'Тест: Функции', name: 'Тест: Функции', lesson: 7, test_type: 'O', duration_minutes: 25, passing_score: 60, questions_count: 10, sort_order: 1 },
      { id: 4, title: 'Тест: HTML-разметка', name: 'Тест: HTML-разметка', lesson: 11, test_type: 'C', duration_minutes: 15, passing_score: 80, questions_count: 12, sort_order: 1 },
      { id: 5, title: 'Тест: Пределы', name: 'Тест: Пределы', lesson: 16, test_type: 'O', duration_minutes: 40, passing_score: 65, questions_count: 8, sort_order: 1 }
    ],
    assignments: [
      { id: 1, title: 'Калькулятор на Python', lesson: 3, description: 'Написать консольный калькулятор с 4 операциями', max_grade: 100, deadline: '2026-03-20T23:59:00', sort_order: 2 },
      { id: 2, title: 'Игра «Угадай число»', lesson: 5, description: 'Реализовать игру с использованием циклов и условий', max_grade: 100, deadline: '2026-03-25T23:59:00', sort_order: 1 },
      { id: 3, title: 'Верстка лендинга', lesson: 11, description: 'Сверстать лендинг по макету из Figma', max_grade: 100, deadline: '2026-04-01T23:59:00', sort_order: 2 },
      { id: 4, title: 'Адаптивная галерея', lesson: 13, description: 'Создать галерею изображений на Flexbox/Grid', max_grade: 100, deadline: '2026-04-05T23:59:00', sort_order: 1 }
    ],
    resources: [
      { id: 1, name: 'Шпаргалка по Python', lesson: 2, file_size_formatted: '245 KB', download_count: 87, sort_order: 1 },
      { id: 2, name: 'Слайды: Управляющие конструкции', lesson: 4, file_size_formatted: '1.2 MB', download_count: 64, sort_order: 1 },
      { id: 3, name: 'Макет лендинга (Figma)', lesson: 11, file_size_formatted: '3.8 MB', download_count: 45, sort_order: 3 },
      { id: 4, name: 'Справочник CSS-свойств', lesson: 12, file_size_formatted: '512 KB', download_count: 52, sort_order: 1 },
      { id: 5, name: 'Таблица производных (PDF)', lesson: 18, file_size_formatted: '180 KB', download_count: 31, sort_order: 1 }
    ],
    forums: [
      { id: 1, name: 'Вопросы по Python', theme: 1, description: 'Обсуждение материалов и помощь по курсу', forum_type: 'qa', is_moderated: false, allow_anonymous: false },
      { id: 2, name: 'Код-ревью', theme: 3, description: 'Разбор и обсуждение кода студентов', forum_type: 'discussion', is_moderated: true, allow_anonymous: false },
      { id: 3, name: 'Обсуждение верстки', theme: 5, description: 'Вопросы и советы по CSS и адаптивности', forum_type: 'general', is_moderated: false, allow_anonymous: true }
    ]
  },

  myCourses: [
    {
      id: 1, subjectId: 1, name: 'Основы Python', description: 'Полный курс по языку Python: от синтаксиса до ООП и работы с файлами.',
      instructor: 'Анна Иванова', category: 'Программирование', course_format: 'Онлайн',
      progress: 47, status: 'active', enrollmentDate: '2026-01-15', lastAccessed: '2026-03-18T14:20:00',
      studentsCount: 234, rating: 4.7, lessonsTotal: 18, lessonsCompleted: 8,
      nextLesson: { name: 'Модули и пакеты', type: 'video' },
      isFavorite: true, image: null
    },
    {
      id: 2, subjectId: 2, name: 'Веб-разработка (HTML/CSS/JS)', description: 'Создание современных веб-сайтов: верстка, стили, интерактивность.',
      instructor: 'Дмитрий Петров', category: 'Программирование', course_format: 'Гибридный',
      progress: 82, status: 'active', enrollmentDate: '2025-11-20', lastAccessed: '2026-03-19T09:10:00',
      studentsCount: 187, rating: 4.9, lessonsTotal: 24, lessonsCompleted: 20,
      nextLesson: { name: 'Flexbox и Grid', type: 'practice' },
      isFavorite: false, image: null
    },
    {
      id: 3, subjectId: 4, name: 'Основы UI/UX дизайна', description: 'Принципы проектирования интерфейсов, пользовательский опыт, Figma.',
      instructor: 'Мария Сидорова', category: 'Дизайн', course_format: 'Онлайн',
      progress: 15, status: 'active', enrollmentDate: '2026-03-01', lastAccessed: '2026-03-17T11:45:00',
      studentsCount: 156, rating: 4.5, lessonsTotal: 16, lessonsCompleted: 2,
      nextLesson: { name: 'Цветовые палитры', type: 'lecture' },
      isFavorite: false, image: null
    },
    {
      id: 4, subjectId: 5, name: 'Базы данных и SQL', description: 'Реляционные базы данных, SQL-запросы, нормализация, индексы.',
      instructor: 'Алексей Козлов', category: 'Программирование', course_format: 'Очный',
      progress: 100, status: 'completed', enrollmentDate: '2025-09-01', lastAccessed: '2026-01-28T16:00:00',
      studentsCount: 312, rating: 4.8, lessonsTotal: 20, lessonsCompleted: 20,
      completedDate: '2026-01-28', certificate: true,
      nextLesson: null, isFavorite: true, image: null
    },
    {
      id: 5, subjectId: 6, name: 'Английский для IT-специалистов', description: 'Техническая лексика, чтение документации, деловая переписка.',
      instructor: 'Елена Белова', category: 'Языки', course_format: 'Онлайн',
      progress: 100, status: 'completed', enrollmentDate: '2025-10-10', lastAccessed: '2026-02-15T13:30:00',
      studentsCount: 98, rating: 4.3, lessonsTotal: 12, lessonsCompleted: 12,
      completedDate: '2026-02-15', certificate: false,
      nextLesson: null, isFavorite: false, image: null
    },
    {
      id: 6, subjectId: 7, name: 'Введение в Data Science', description: 'Анализ данных, pandas, визуализация, основы машинного обучения.',
      instructor: 'Игорь Новиков', category: 'Программирование', course_format: 'Самостоятельный',
      progress: 5, status: 'paused', enrollmentDate: '2026-02-20', lastAccessed: '2026-02-22T10:00:00',
      studentsCount: 203, rating: 4.6, lessonsTotal: 22, lessonsCompleted: 1,
      nextLesson: { name: 'Установка Anaconda', type: 'lecture' },
      isFavorite: false, image: null
    }
  ],

  gradesData: [
    { id: 1, subject_name: 'Основы Python', grade: 95, related: '2026-03-04T10:00:00', feedback: 'Отличная работа! Все операции реализованы корректно.', grader_name: 'Анна Иванова', grade_type: 'assignment', assignment_name: 'Калькулятор на Python', max_grade: 100 },
    { id: 2, subject_name: 'Основы Python', grade: 88, related: '2026-02-28T14:20:00', feedback: 'Тест пройден успешно', grader_name: 'Автоматическая проверка', grade_type: 'test', assignment_name: 'Тест: Циклы и условия', max_grade: 100 },
    { id: 3, subject_name: 'Основы Python', grade: 72, related: '2026-02-15T09:30:00', feedback: 'Есть ошибки в обработке исключений. Доработайте блок try/except.', grader_name: 'Анна Иванова', grade_type: 'assignment', assignment_name: 'Игра «Угадай число»', max_grade: 100 },
    { id: 4, subject_name: 'Основы Python', grade: 91, related: '2026-01-20T16:45:00', feedback: 'Тест пройден', grader_name: 'Автоматическая проверка', grade_type: 'test', assignment_name: 'Тест: Основы Python', max_grade: 100 },
    { id: 5, subject_name: 'Основы Python', grade: 85, related: '2026-01-10T11:00:00', feedback: 'Хорошее понимание материала', grader_name: 'Анна Иванова', grade_type: 'manual', assignment_name: 'Устный опрос: Типы данных', max_grade: 100 },
    { id: 6, subject_name: 'Веб-разработка (HTML/CSS/JS)', grade: 98, related: '2026-03-02T13:15:00', feedback: 'Превосходная верстка! Семантика на высоте.', grader_name: 'Дмитрий Петров', grade_type: 'assignment', assignment_name: 'Верстка лендинга', max_grade: 100 },
    { id: 7, subject_name: 'Веб-разработка (HTML/CSS/JS)', grade: 76, related: '2026-02-20T10:00:00', feedback: 'Тест пройден, но есть пробелы в CSS Grid', grader_name: 'Автоматическая проверка', grade_type: 'test', assignment_name: 'Тест: HTML-разметка', max_grade: 100 },
    { id: 8, subject_name: 'Веб-разработка (HTML/CSS/JS)', grade: 82, related: '2026-02-05T15:30:00', feedback: 'Хорошая работа, но адаптивность можно улучшить', grader_name: 'Дмитрий Петров', grade_type: 'assignment', assignment_name: 'Адаптивная галерея', max_grade: 100 },
    { id: 9, subject_name: 'Веб-разработка (HTML/CSS/JS)', grade: 90, related: '2026-01-25T12:00:00', feedback: 'Отличное владение Flexbox', grader_name: 'Дмитрий Петров', grade_type: 'manual', assignment_name: 'Практика: Flexbox-раскладка', max_grade: 100 },
    { id: 10, subject_name: 'Математический анализ', grade: 65, related: '2026-03-01T09:00:00', feedback: 'Тест не пройден. Повторите тему «Замечательные пределы».', grader_name: 'Автоматическая проверка', grade_type: 'test', assignment_name: 'Тест: Пределы', max_grade: 100 },
    { id: 11, subject_name: 'Математический анализ', grade: 58, related: '2026-02-12T10:30:00', feedback: 'Допущены ошибки в вычислении производных сложных функций', grader_name: 'Елена Козлова', grade_type: 'assignment', assignment_name: 'Контрольная: Производные', max_grade: 100 },
    { id: 12, subject_name: 'Математический анализ', grade: 42, related: '2026-01-28T14:00:00', feedback: 'Необходимо пересдать. Обратитесь на консультацию.', grader_name: 'Елена Козлова', grade_type: 'manual', assignment_name: 'Коллоквиум по теории', max_grade: 100 },
    { id: 13, subject_name: 'Математический анализ', grade: 71, related: '2026-01-15T11:45:00', feedback: 'Удовлетворительно', grader_name: 'Елена Козлова', grade_type: 'assignment', assignment_name: 'Домашняя работа: Пределы', max_grade: 100 },
    { id: 14, subject_name: 'Базы данных и SQL', grade: 94, related: '2026-01-28T16:00:00', feedback: 'Отличное знание SQL. Запросы оптимальны.', grader_name: 'Алексей Козлов', grade_type: 'test', assignment_name: 'Финальный тест: SQL', max_grade: 100 },
    { id: 15, subject_name: 'Базы данных и SQL', grade: 97, related: '2026-01-20T13:00:00', feedback: 'Идеальная нормализация схемы', grader_name: 'Алексей Козлов', grade_type: 'assignment', assignment_name: 'Проект: Нормализация БД', max_grade: 100 },
    { id: 16, subject_name: 'Базы данных и SQL', grade: 89, related: '2026-01-05T10:00:00', feedback: 'Хорошая работа с JOIN-запросами', grader_name: 'Алексей Козлов', grade_type: 'manual', assignment_name: 'Практика: Сложные запросы', max_grade: 100 },
    { id: 17, subject_name: 'Английский для IT-специалистов', grade: 78, related: '2026-02-15T13:30:00', feedback: 'Финальный тест пройден', grader_name: 'Автоматическая проверка', grade_type: 'test', assignment_name: 'Финальный тест: IT English', max_grade: 100 },
    { id: 18, subject_name: 'Английский для IT-специалистов', grade: 83, related: '2026-02-01T11:00:00', feedback: 'Хороший уровень технической лексики, поработайте над произношением', grader_name: 'Елена Белова', grade_type: 'manual', assignment_name: 'Презентация: My Project', max_grade: 100 }
  ],

  badgesData: {
    allBadges: [
      { id: 1, name: 'Первый шаг', description: 'Записаться на первый курс в системе', badge_type: 'course_enrollment', category: 'Обучение', tier: 'bronze', criteria: 'Записаться на любой курс', icon: 'BookOpen', xp: 50, is_active: true },
      { id: 2, name: 'Выпускник', description: 'Успешно завершить курс', badge_type: 'course_completion', category: 'Обучение', tier: 'silver', criteria: 'Завершить любой курс на 100%', icon: 'GraduationCap', xp: 200, is_active: true },
      { id: 3, name: 'Эрудит', description: 'Завершить 5 курсов из разных категорий', badge_type: 'multi_category', category: 'Обучение', tier: 'gold', criteria: 'Завершить курсы в 5 разных категориях', icon: 'Library', xp: 500, is_active: true, progress: { current: 3, target: 5 } },
      { id: 4, name: 'На старт!', description: 'Учиться 3 дня подряд', badge_type: 'streak_3', category: 'Регулярность', tier: 'bronze', criteria: 'Войти и пройти урок 3 дня подряд', icon: 'Flame', xp: 75, is_active: true },
      { id: 5, name: 'Прилежный ученик', description: 'Учиться 7 дней подряд', badge_type: 'streak_7', category: 'Регулярность', tier: 'silver', criteria: 'Войти и пройти урок 7 дней подряд', icon: 'Flame', xp: 150, is_active: true, progress: { current: 5, target: 7 } },
      { id: 6, name: 'Марафонец', description: 'Учиться 30 дней подряд', badge_type: 'streak_30', category: 'Регулярность', tier: 'gold', criteria: 'Войти и пройти урок 30 дней подряд', icon: 'Timer', xp: 500, is_active: true, progress: { current: 12, target: 30 } },
      { id: 7, name: 'Отличник', description: 'Получить 90+ баллов за задание', badge_type: 'high_score', category: 'Академические', tier: 'bronze', criteria: 'Набрать 90 или более баллов за любое задание', icon: 'Star', xp: 100, is_active: true },
      { id: 8, name: 'Перфекционист', description: 'Получить 5 оценок 90+ подряд', badge_type: 'perfect_streak', category: 'Академические', tier: 'silver', criteria: 'Получить 5 оценок выше 90 баллов подряд', icon: 'Award', xp: 250, is_active: true, progress: { current: 3, target: 5 } },
      { id: 9, name: 'Гений', description: 'Средний балл 95+ по всем курсам', badge_type: 'avg_95', category: 'Академические', tier: 'gold', criteria: 'Поддерживать средний балл 95+ по всем активным курсам', icon: 'Sparkles', xp: 600, is_active: true },
      { id: 10, name: 'Комментатор', description: 'Оставить 5 сообщений на форуме', badge_type: 'forum_5', category: 'Социальные', tier: 'bronze', criteria: 'Написать 5 сообщений на форумах курсов', icon: 'MessageSquare', xp: 50, is_active: true, progress: { current: 2, target: 5 } },
      { id: 11, name: 'Помощник', description: 'Получить 10 благодарностей за ответы', badge_type: 'helpful_10', category: 'Социальные', tier: 'silver', criteria: 'Получить 10 отметок "Полезный ответ" на форуме', icon: 'Heart', xp: 200, is_active: true },
      { id: 12, name: 'Наставник', description: 'Помочь 25 студентам на форуме', badge_type: 'mentor', category: 'Социальные', tier: 'gold', criteria: 'Получить 25 отметок "Полезный ответ"', icon: 'Users', xp: 400, is_active: true },
      { id: 13, name: 'Быстрый старт', description: 'Завершить урок в первые 24 часа после записи', badge_type: 'early_bird', category: 'Мастерство', tier: 'bronze', criteria: 'Пройти первый урок в течение 24 часов после записи на курс', icon: 'Zap', xp: 75, is_active: true },
      { id: 14, name: 'Спринтер', description: 'Пройти тест без ошибок', badge_type: 'perfect_test', category: 'Мастерство', tier: 'silver', criteria: 'Получить 100% за любой тест', icon: 'Target', xp: 300, is_active: true },
      { id: 15, name: 'Мастер', description: 'Набрать 100 часов обучения', badge_type: 'hours_100', category: 'Мастерство', tier: 'gold', criteria: 'Суммарно провести 100 часов за обучением', icon: 'Crown', xp: 750, is_active: true, progress: { current: 47, target: 100 } }
    ],
    earnedBadges: [
      { id: 1, badge: 1, awarded_at: '2026-01-15T10:00:00' },
      { id: 2, badge: 4, awarded_at: '2026-01-18T09:15:00' },
      { id: 3, badge: 7, awarded_at: '2026-02-01T14:30:00' },
      { id: 4, badge: 2, awarded_at: '2026-02-10T16:00:00' },
      { id: 5, badge: 13, awarded_at: '2026-02-15T08:45:00' },
      { id: 6, badge: 10, awarded_at: '2026-02-20T12:00:00' },
      { id: 7, badge: 14, awarded_at: '2026-03-01T11:20:00' },
      { id: 8, badge: 5, awarded_at: '2026-03-03T17:00:00' }
    ]
  },

  catalogData: [
    {
      id: 101, name: 'Основы Python', summary: 'Полный курс по языку Python для начинающих: от синтаксиса до ООП и работы с файлами.',
      description: 'Изучите Python с нуля. Курс охватывает переменные, циклы, функции, ООП, работу с файлами и библиотеками.',
      category: { id: 1, name: 'Программирование' }, course_format: { id: 1, name: 'Онлайн' },
      is_published: true, image: null,
      teacher: { id: 1, first_name: 'Анна', last_name: 'Иванова', full_name: 'Анна Иванова' },
      rating: 4.8, reviews_count: 342, difficulty: 'beginner', duration_hours: 40, lessons_count: 24, students_count: 1250,
      tags: ['Python', 'ООП', 'Автоматизация'], is_new: false, is_popular: true, creationdate: '2025-09-01T10:00:00'
    },
    {
      id: 102, name: 'Веб-разработка (HTML/CSS/JS)', summary: 'Создание современных веб-сайтов: верстка, стили, интерактивность и адаптивный дизайн.',
      description: 'Научитесь создавать веб-сайты с нуля. HTML5, CSS3, Flexbox, Grid, JavaScript, адаптивная верстка.',
      category: { id: 1, name: 'Программирование' }, course_format: { id: 2, name: 'Гибридный' },
      is_published: true, image: null,
      teacher: { id: 2, first_name: 'Дмитрий', last_name: 'Петров', full_name: 'Дмитрий Петров' },
      rating: 4.9, reviews_count: 518, difficulty: 'beginner', duration_hours: 60, lessons_count: 36, students_count: 1870,
      tags: ['HTML', 'CSS', 'JavaScript'], is_new: false, is_popular: true, creationdate: '2025-08-15T10:00:00'
    },
    {
      id: 103, name: 'Продвинутый Python', summary: 'Углубленное изучение Python: декораторы, генераторы, асинхронность, тестирование.',
      description: 'Для тех, кто освоил основы. Декораторы, метаклассы, asyncio, pytest, паттерны проектирования.',
      category: { id: 1, name: 'Программирование' }, course_format: { id: 1, name: 'Онлайн' },
      is_published: true, image: null,
      teacher: { id: 1, first_name: 'Анна', last_name: 'Иванова', full_name: 'Анна Иванова' },
      rating: 4.7, reviews_count: 156, difficulty: 'advanced', duration_hours: 35, lessons_count: 20, students_count: 430,
      tags: ['Python', 'asyncio', 'Тестирование'], is_new: true, is_popular: false, creationdate: '2026-02-10T10:00:00'
    },
    {
      id: 104, name: 'Математический анализ', summary: 'Основы математического анализа: пределы, производные, интегралы и ряды.',
      description: 'Классический курс матанализа для студентов технических специальностей.',
      category: { id: 2, name: 'Математика' }, course_format: { id: 3, name: 'Очный' },
      is_published: true, image: null,
      teacher: { id: 3, first_name: 'Елена', last_name: 'Козлова', full_name: 'Елена Козлова' },
      rating: 4.3, reviews_count: 89, difficulty: 'intermediate', duration_hours: 72, lessons_count: 32, students_count: 560,
      tags: ['Матанализ', 'Пределы', 'Интегралы'], is_new: false, is_popular: false, creationdate: '2025-09-10T10:00:00'
    },
    {
      id: 105, name: 'Линейная алгебра', summary: 'Матрицы, определители, системы уравнений, линейные пространства и отображения.',
      description: 'Фундаментальный курс линейной алгебры с практическими заданиями.',
      category: { id: 2, name: 'Математика' }, course_format: { id: 3, name: 'Очный' },
      is_published: true, image: null,
      teacher: { id: 3, first_name: 'Елена', last_name: 'Козлова', full_name: 'Елена Козлова' },
      rating: 4.5, reviews_count: 67, difficulty: 'intermediate', duration_hours: 54, lessons_count: 28, students_count: 380,
      tags: ['Матрицы', 'Векторы', 'Системы уравнений'], is_new: false, is_popular: false, creationdate: '2025-10-01T10:00:00'
    },
    {
      id: 106, name: 'Английский для IT-специалистов', summary: 'Техническая лексика, чтение документации, деловая переписка и собеседования.',
      description: 'Специализированный курс английского для разработчиков и IT-менеджеров.',
      category: { id: 3, name: 'Языки' }, course_format: { id: 1, name: 'Онлайн' },
      is_published: true, image: null,
      teacher: { id: 6, first_name: 'Елена', last_name: 'Белова', full_name: 'Елена Белова' },
      rating: 4.6, reviews_count: 203, difficulty: 'intermediate', duration_hours: 30, lessons_count: 20, students_count: 920,
      tags: ['English', 'IT', 'Business'], is_new: false, is_popular: true, creationdate: '2025-07-20T10:00:00'
    },
    {
      id: 107, name: 'Управление проектами', summary: 'Agile, Scrum, Kanban, планирование и управление командой в IT-проектах.',
      description: 'Практический курс по управлению проектами. Методологии, инструменты, реальные кейсы.',
      category: { id: 4, name: 'Бизнес' }, course_format: { id: 2, name: 'Гибридный' },
      is_published: true, image: null,
      teacher: { id: 7, first_name: 'Татьяна', last_name: 'Волкова', full_name: 'Татьяна Волкова' },
      rating: 4.4, reviews_count: 134, difficulty: 'intermediate', duration_hours: 25, lessons_count: 16, students_count: 670,
      tags: ['Agile', 'Scrum', 'PM'], is_new: false, is_popular: false, creationdate: '2025-11-05T10:00:00'
    },
    {
      id: 108, name: 'UI/UX Дизайн', summary: 'Проектирование интерфейсов, пользовательский опыт, Figma и прототипирование.',
      description: 'От исследования пользователей до финального макета. Figma, wireframes, юзабилити-тестирование.',
      category: { id: 5, name: 'Дизайн' }, course_format: { id: 1, name: 'Онлайн' },
      is_published: true, image: null,
      teacher: { id: 8, first_name: 'Мария', last_name: 'Сидорова', full_name: 'Мария Сидорова' },
      rating: 4.7, reviews_count: 278, difficulty: 'beginner', duration_hours: 45, lessons_count: 22, students_count: 1100,
      tags: ['Figma', 'UX', 'Прототипы'], is_new: false, is_popular: true, creationdate: '2025-08-01T10:00:00'
    },
    {
      id: 109, name: 'Data Science и машинное обучение', summary: 'Анализ данных, pandas, визуализация, scikit-learn, нейронные сети.',
      description: 'Комплексный курс по Data Science: от анализа данных до построения моделей машинного обучения.',
      category: { id: 1, name: 'Программирование' }, course_format: { id: 1, name: 'Онлайн' },
      is_published: true, image: null,
      teacher: { id: 9, first_name: 'Игорь', last_name: 'Новиков', full_name: 'Игорь Новиков' },
      rating: 4.8, reviews_count: 412, difficulty: 'advanced', duration_hours: 80, lessons_count: 40, students_count: 780,
      tags: ['Data Science', 'ML', 'Python'], is_new: true, is_popular: true, creationdate: '2026-01-15T10:00:00'
    },
    {
      id: 110, name: 'Базы данных и SQL', summary: 'Реляционные БД, SQL-запросы, нормализация, индексы, оптимизация.',
      description: 'Полный курс по базам данных: проектирование, SQL, нормализация, транзакции, оптимизация запросов.',
      category: { id: 1, name: 'Программирование' }, course_format: { id: 4, name: 'Самостоятельный' },
      is_published: true, image: null,
      teacher: { id: 10, first_name: 'Алексей', last_name: 'Козлов', full_name: 'Алексей Козлов' },
      rating: 4.6, reviews_count: 189, difficulty: 'intermediate', duration_hours: 35, lessons_count: 20, students_count: 640,
      tags: ['SQL', 'PostgreSQL', 'NoSQL'], is_new: false, is_popular: false, creationdate: '2025-10-20T10:00:00'
    },
    {
      id: 111, name: 'Маркетинг для начинающих', summary: 'Основы маркетинга, digital-стратегии, SMM, контент-маркетинг и аналитика.',
      description: 'Введение в современный маркетинг. Целевая аудитория, воронки продаж, метрики эффективности.',
      category: { id: 4, name: 'Бизнес' }, course_format: { id: 1, name: 'Онлайн' },
      is_published: true, image: null,
      teacher: { id: 11, first_name: 'Ольга', last_name: 'Морозова', full_name: 'Ольга Морозова' },
      rating: 4.2, reviews_count: 95, difficulty: 'beginner', duration_hours: 20, lessons_count: 14, students_count: 450,
      tags: ['Маркетинг', 'SMM', 'Аналитика'], is_new: true, is_popular: false, creationdate: '2026-02-25T10:00:00'
    },
    {
      id: 112, name: 'Графический дизайн', summary: 'Adobe Photoshop, Illustrator, композиция, типографика и цветоведение.',
      description: 'Освойте инструменты графического дизайна и создавайте профессиональные визуальные материалы.',
      category: { id: 5, name: 'Дизайн' }, course_format: { id: 2, name: 'Гибридный' },
      is_published: true, image: null,
      teacher: { id: 8, first_name: 'Мария', last_name: 'Сидорова', full_name: 'Мария Сидорова' },
      rating: 4.5, reviews_count: 167, difficulty: 'beginner', duration_hours: 50, lessons_count: 26, students_count: 830,
      tags: ['Photoshop', 'Illustrator', 'Типографика'], is_new: false, is_popular: false, creationdate: '2025-06-10T10:00:00'
    }
  ],

  calendarEvents: [
    { id: 1, title: 'Контрольная работа: Функции Python', description: 'Модуль 3: Функции, замыкания и декораторы', event_type: 'assignment', start_date: '2026-03-05T10:00:00', end_date: '2026-03-05T11:30:00', is_all_day: false, location: 'Аудитория 305', subject: { id: 1, name: 'Основы Python' }, color: 'primary' },
    { id: 2, title: 'Дедлайн: Проект по HTML/CSS', description: 'Сдача финального проекта адаптивной верстки', event_type: 'deadline', start_date: '2026-03-07T23:59:00', end_date: null, is_all_day: false, location: null, subject: { id: 2, name: 'Веб-разработка' }, color: 'warning' },
    { id: 3, title: 'Вебинар: Карьера в IT', description: 'Гостевая лекция от ведущих специалистов Яндекс', event_type: 'webinar', start_date: '2026-03-08T15:00:00', end_date: '2026-03-08T16:30:00', is_all_day: false, location: 'Онлайн (Zoom)', subject: null, color: 'info' },
    { id: 4, title: 'Лекция: Определенные интегралы', description: 'Теория и примеры вычисления определенных интегралов', event_type: 'lesson', start_date: '2026-03-10T09:00:00', end_date: '2026-03-10T10:30:00', is_all_day: false, location: 'Аудитория 201', subject: { id: 3, name: 'Математический анализ' }, color: 'success' },
    { id: 5, title: 'Тест: Основы HTML', description: 'Промежуточный тест по тегам, атрибутам и семантике', event_type: 'quiz', start_date: '2026-03-11T14:00:00', end_date: '2026-03-11T15:00:00', is_all_day: false, location: 'Онлайн', subject: { id: 2, name: 'Веб-разработка' }, color: 'info' },
    { id: 6, title: 'Практика: SQL запросы', description: 'Работа с реальными данными: SELECT, JOIN, GROUP BY', event_type: 'lesson', start_date: '2026-03-12T14:00:00', end_date: '2026-03-12T16:00:00', is_all_day: false, location: 'Комп. класс 3', subject: { id: 5, name: 'Базы данных' }, color: 'success' },
    { id: 7, title: 'Задание: Рекурсивные алгоритмы', description: 'Реализация рекурсивных решений для классических задач', event_type: 'assignment', start_date: '2026-03-14T10:00:00', end_date: null, is_all_day: true, location: null, subject: { id: 1, name: 'Основы Python' }, color: 'primary' },
    { id: 8, title: 'Экзамен: Математический анализ', description: 'Итоговый экзамен за первый семестр', event_type: 'exam', start_date: '2026-03-17T09:00:00', end_date: '2026-03-17T12:00:00', is_all_day: false, location: 'Аудитория 101', subject: { id: 3, name: 'Математический анализ' }, color: 'danger' },
    { id: 9, title: 'Дедлайн: Эссе по бизнес-стратегии', description: 'Анализ бизнес-кейса и написание эссе на 3000 слов', event_type: 'deadline', start_date: '2026-03-18T23:59:00', end_date: null, is_all_day: false, location: null, subject: { id: 4, name: 'Бизнес-стратегия' }, color: 'warning' },
    { id: 10, title: 'Совещание кафедры', description: 'Обсуждение учебного плана на следующий семестр', event_type: 'meeting', start_date: '2026-03-19T14:00:00', end_date: '2026-03-19T15:30:00', is_all_day: false, location: 'Каб. 410', subject: null, color: 'secondary' },
    { id: 11, title: 'Лекция: CSS Grid и Flexbox', description: 'Современные подходы к созданию адаптивных макетов', event_type: 'lesson', start_date: '2026-03-20T10:00:00', end_date: '2026-03-20T11:30:00', is_all_day: false, location: 'Аудитория 305', subject: { id: 2, name: 'Веб-разработка' }, color: 'success' },
    { id: 12, title: 'Тест: ООП в Python', description: 'Классы, наследование, полиморфизм, инкапсуляция', event_type: 'quiz', start_date: '2026-03-22T10:00:00', end_date: '2026-03-22T11:00:00', is_all_day: false, location: 'Онлайн', subject: { id: 1, name: 'Основы Python' }, color: 'info' },
    { id: 13, title: 'Задание: Анализ данных в Pandas', description: 'Обработка и визуализация датасета продаж', event_type: 'assignment', start_date: '2026-03-24T10:00:00', end_date: null, is_all_day: true, location: null, subject: { id: 6, name: 'Data Science' }, color: 'primary' },
    { id: 14, title: 'Вебинар: UI тренды 2026', description: 'Обзор современных тенденций в дизайне интерфейсов', event_type: 'webinar', start_date: '2026-03-25T16:00:00', end_date: '2026-03-25T17:30:00', is_all_day: false, location: 'Онлайн (Teams)', subject: { id: 7, name: 'UI/UX дизайн' }, color: 'info' },
    { id: 15, title: 'Дедлайн: Лабораторная по БД', description: 'Создание и заполнение реляционной базы данных', event_type: 'deadline', start_date: '2026-03-27T23:59:00', end_date: null, is_all_day: false, location: null, subject: { id: 5, name: 'Базы данных' }, color: 'warning' },
    { id: 16, title: 'Лекция: Нейронные сети', description: 'Введение в архитектуру нейронных сетей и обучение моделей', event_type: 'lesson', start_date: '2026-03-28T09:00:00', end_date: '2026-03-28T10:30:00', is_all_day: false, location: 'Аудитория 201', subject: { id: 6, name: 'Data Science' }, color: 'success' },
    { id: 17, title: 'Задание: REST API на Django', description: 'Создание CRUD API с использованием Django REST Framework', event_type: 'assignment', start_date: '2026-04-02T10:00:00', end_date: null, is_all_day: true, location: null, subject: { id: 1, name: 'Основы Python' }, color: 'primary' },
    { id: 18, title: 'Тест: JavaScript продвинутый', description: 'Промисы, async/await, модули, замыкания', event_type: 'quiz', start_date: '2026-04-05T14:00:00', end_date: '2026-04-05T15:00:00', is_all_day: false, location: 'Онлайн', subject: { id: 2, name: 'Веб-разработка' }, color: 'info' },
    { id: 19, title: 'Экзамен: Базы данных', description: 'Итоговый экзамен: SQL, нормализация, проектирование', event_type: 'exam', start_date: '2026-04-10T09:00:00', end_date: '2026-04-10T12:00:00', is_all_day: false, location: 'Аудитория 101', subject: { id: 5, name: 'Базы данных' }, color: 'danger' },
    { id: 20, title: 'Совещание: Итоги семестра', description: 'Подведение итогов и планирование на следующий период', event_type: 'meeting', start_date: '2026-04-15T10:00:00', end_date: '2026-04-15T12:00:00', is_all_day: false, location: 'Конференц-зал', subject: null, color: 'secondary' }
  ]
}
