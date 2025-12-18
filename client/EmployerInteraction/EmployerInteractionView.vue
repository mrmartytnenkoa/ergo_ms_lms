<template>
  <div class="employer-interaction-dashboard">
    <div class="container-fluid py-4">
      <!-- Заголовок -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Дополнительные траектории</h1>
        <div class="d-flex gap-2">
          <select v-model="selectedPeriod" class="form-select form-select-sm" style="width: auto;">
            <option value="all">Все время</option>
            <option value="month">Последний месяц</option>
            <option value="quarter">Последний квартал</option>
            <option value="year">Последний год</option>
          </select>
        </div>
      </div>

      <!-- Статистика -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-primary bg-opacity-10 rounded p-3">
                    <Users class="text-primary" size="24" />
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Активных студентов</div>
                  <div class="h4 mb-0">{{ stats.activeStudents }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-success bg-opacity-10 rounded p-3">
                    <Briefcase class="text-success" size="24" />
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Трудоустроено</div>
                  <div class="h4 mb-0">{{ stats.employed }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-info bg-opacity-10 rounded p-3">
                    <Handshake class="text-info" size="24" />
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Партнеров</div>
                  <div class="h4 mb-0">{{ stats.partners }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-warning bg-opacity-10 rounded p-3">
                    <TrendingUp class="text-warning" size="24" />
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Средний прогресс</div>
                  <div class="h4 mb-0">{{ stats.avgProgress }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- График траектории -->
      <div class="row g-3 mb-4">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Траектория взаимодействия</h5>
            </div>
            <div class="card-body">
              <div class="timeline-container" style="min-height: 400px;">
                <div v-for="(event, index) in timelineEvents" :key="index" class="timeline-item mb-4">
                  <div class="d-flex">
                    <div class="timeline-marker flex-shrink-0">
                      <div :class="['timeline-dot', `bg-${event.type}`]"></div>
                      <div v-if="index < timelineEvents.length - 1" class="timeline-line"></div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <div class="card">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 class="mb-1">{{ event.title }}</h6>
                              <small class="text-muted">{{ event.student }}</small>
                            </div>
                            <span :class="['badge', getEventBadgeClass(event.type)]">{{ event.status }}</span>
                          </div>
                          <p class="mb-2 small">{{ event.description }}</p>
                          <div class="d-flex gap-2 flex-wrap">
                            <span v-if="event.course" class="badge bg-secondary">{{ event.course }}</span>
                            <span v-if="event.employer" class="badge bg-primary">{{ event.employer }}</span>
                          </div>
                          <div class="text-muted small mt-2">
                            <Calendar class="d-inline" size="14" />
                            {{ formatDate(event.date) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Статистика по курсам -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Популярные курсы</h5>
            </div>
            <div class="card-body">
              <div v-for="course in popularCourses" :key="course.id" class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-bold">{{ course.name }}</span>
                  <span class="badge bg-primary">{{ course.students }} студентов</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div 
                    class="progress-bar" 
                    :style="{ width: `${course.completionRate}%` }"
                  ></div>
                </div>
                <small class="text-muted">{{ course.completionRate }}% завершили</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Таблица студентов -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Студенты и их траектория</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Студент</th>
                      <th>Курсы</th>
                      <th>Прогресс</th>
                      <th>Статус</th>
                      <th>Работодатель</th>
                      <th>Этап</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in students" :key="student.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-placeholder me-2">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                 style="width: 40px; height: 40px; font-size: 14px;">
                              {{ student.initials }}
                            </div>
                          </div>
                          <div>
                            <div class="fw-bold">{{ student.name }}</div>
                            <small class="text-muted">{{ student.email }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          <span v-for="course in student.courses" :key="course" 
                                class="badge bg-secondary">{{ course }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2" style="height: 8px; width: 100px;">
                            <div class="progress-bar" 
                                 :style="{ width: `${student.progress}%` }"></div>
                          </div>
                          <span class="small">{{ student.progress }}%</span>
                        </div>
                      </td>
                      <td>
                        <span :class="['badge', getStatusBadgeClass(student.status)]">
                          {{ student.status }}
                        </span>
                      </td>
                      <td>
                        <span v-if="student.employer" class="badge bg-primary">
                          {{ student.employer }}
                        </span>
                        <span v-else class="text-muted">—</span>
                      </td>
                      <td>
                        <span :class="['badge', getStageBadgeClass(student.stage)]">
                          {{ student.stage }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Users, Briefcase, Handshake, TrendingUp, Calendar } from 'lucide-vue-next'

const selectedPeriod = ref('all')

const stats = ref({
  activeStudents: 0,
  employed: 0,
  partners: 0,
  avgProgress: 0
})

const timelineEvents = ref([])
const popularCourses = ref([])
const students = ref([])

// Генерация фейковых данных
function generateFakeData() {
  // Статистика
  stats.value = {
    activeStudents: 127,
    employed: 43,
    partners: 18,
    avgProgress: 68
  }

  // События траектории
  timelineEvents.value = [
    {
      type: 'success',
      status: 'Трудоустроен',
      title: 'Успешное трудоустройство',
      student: 'Иванов Александр',
      description: 'Студент успешно прошел собеседование и получил предложение о работе в компании "ТехноСофт"',
      course: 'React.js для начинающих',
      employer: 'ТехноСофт',
      date: new Date(2024, 0, 15)
    },
    {
      type: 'info',
      status: 'Стажировка',
      title: 'Начало стажировки',
      student: 'Петрова Екатерина',
      description: 'Студент начал стажировку в компании "ВебСтудия" после успешного прохождения курса',
      course: 'Django Framework',
      employer: 'ВебСтудия',
      date: new Date(2024, 0, 10)
    },
    {
      type: 'warning',
      status: 'Собеседование',
      title: 'Запланировано собеседование',
      student: 'Сидоров Максим',
      description: 'Студент приглашен на техническое собеседование в компанию "ДанныеПлюс"',
      course: 'Машинное обучение с Python',
      employer: 'ДанныеПлюс',
      date: new Date(2024, 0, 8)
    },
    {
      type: 'primary',
      status: 'Рекомендация',
      title: 'Рекомендация работодателю',
      student: 'Козлова Анастасия',
      description: 'Преподаватель рекомендовал студента компании "МобайлДев"',
      course: 'Android разработка на Kotlin',
      employer: 'МобайлДев',
      date: new Date(2024, 0, 5)
    },
    {
      type: 'success',
      status: 'Завершен',
      title: 'Завершение курса',
      student: 'Васильев Артем',
      description: 'Студент успешно завершил курс и получил сертификат',
      course: 'Node.js Backend',
      employer: null,
      date: new Date(2024, 0, 3)
    },
    {
      type: 'info',
      status: 'В процессе',
      title: 'Активное обучение',
      student: 'Смирнова Дарья',
      description: 'Студент активно проходит курс и показывает отличные результаты',
      course: 'Vue.js разработка',
      employer: null,
      date: new Date(2024, 0, 1)
    }
  ]

  // Популярные курсы
  popularCourses.value = [
    { id: 1, name: 'React.js для начинающих', students: 45, completionRate: 78 },
    { id: 2, name: 'Django Framework', students: 38, completionRate: 72 },
    { id: 3, name: 'Основы Python разработки', students: 52, completionRate: 85 },
    { id: 4, name: 'Node.js Backend', students: 32, completionRate: 68 },
    { id: 5, name: 'Vue.js разработка', students: 28, completionRate: 75 }
  ]

  // Студенты
  const studentNames = [
    { name: 'Иванов Александр', email: 'ivanov@example.com', initials: 'ИА' },
    { name: 'Петрова Екатерина', email: 'petrova@example.com', initials: 'ПЕ' },
    { name: 'Сидоров Максим', email: 'sidorov@example.com', initials: 'СМ' },
    { name: 'Козлова Анастасия', email: 'kozlova@example.com', initials: 'КА' },
    { name: 'Васильев Артем', email: 'vasiliev@example.com', initials: 'ВА' },
    { name: 'Смирнова Дарья', email: 'smirnova@example.com', initials: 'СД' },
    { name: 'Соколов Никита', email: 'sokolov@example.com', initials: 'СН' },
    { name: 'Новикова Валерия', email: 'novikova@example.com', initials: 'НВ' },
    { name: 'Лебедев Егор', email: 'lebedev@example.com', initials: 'ЛЕ' },
    { name: 'Волкова София', email: 'volkova@example.com', initials: 'ВС' }
  ]

  const courses = ['React.js', 'Django', 'Python', 'Node.js', 'Vue.js', 'Docker', 'SQL']
  const employers = ['ТехноСофт', 'ВебСтудия', 'ДанныеПлюс', 'МобайлДев', 'КлаудТех', null]
  const statuses = ['Обучается', 'Завершил', 'Трудоустроен', 'Стажировка']
  const stages = ['Обучение', 'Собеседование', 'Стажировка', 'Трудоустроен']

  students.value = studentNames.map((student, index) => {
    const studentCourses = courses.slice(0, Math.floor(Math.random() * 3) + 1)
    const progress = Math.floor(Math.random() * 40) + 50
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const employer = employers[Math.floor(Math.random() * employers.length)]
    const stage = stages[Math.floor(Math.random() * stages.length)]

    return {
      id: index + 1,
      ...student,
      courses: studentCourses,
      progress,
      status,
      employer,
      stage
    }
  })
}

function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function getStatusBadgeClass(status) {
  const classes = {
    'Обучается': 'bg-info',
    'Завершил': 'bg-success',
    'Трудоустроен': 'bg-primary',
    'Стажировка': 'bg-warning'
  }
  return classes[status] || 'bg-secondary'
}

function getStageBadgeClass(stage) {
  const classes = {
    'Обучение': 'bg-info',
    'Собеседование': 'bg-warning',
    'Стажировка': 'bg-primary',
    'Трудоустроен': 'bg-success'
  }
  return classes[stage] || 'bg-secondary'
}

function getEventBadgeClass(type) {
  const classes = {
    'success': 'bg-success',
    'info': 'bg-info',
    'warning': 'bg-warning',
    'primary': 'bg-primary',
    'danger': 'bg-danger'
  }
  return classes[type] || 'bg-secondary'
}

onMounted(() => {
  generateFakeData()
})
</script>

<style scoped>
.employer-interaction-dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.timeline-container {
  position: relative;
}

.timeline-item {
  position: relative;
}

.timeline-marker {
  position: relative;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px currentColor;
  z-index: 1;
}

.timeline-line {
  width: 2px;
  flex-grow: 1;
  background-color: #dee2e6;
  margin-top: 4px;
  min-height: 60px;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.table {
  font-size: 0.9rem;
}

.avatar-placeholder {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .timeline-item {
    margin-bottom: 1.5rem;
  }
  
  .table {
    font-size: 0.8rem;
  }
}
</style>

