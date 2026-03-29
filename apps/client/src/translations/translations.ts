export const translations = {
    // Navigation
    nav: {
        title: {et: "CatsHelp hoiukoduportaal", en: "CatsHelp foster home portal", ru: "CatsHelp Портал передержки" },
        dashboard: {et: 'Töölaud', en: 'Dashboard', ru: 'Панель'},
        catProfile: {et: 'Kassi profiil', en: 'Cat Profile', ru: 'Профиль кота'},
        medical: {et: 'Tervis ja kliinikud', en: 'Medical & Clinics', ru: 'Здоровье и клиники'},
        logout: {et: "Logi välja", en: "Log out", ru: "выходить"},
        role: {
          ADMIN: {et: "Admin", en: "Admin", ru: "Админ"},
          FOSTER: {et: "Hoiukodu", en: "Fosterhome", ru: "Передержка"}
        }
    },

    // App mode
    mode: {
        foster: {et: 'Hoiukodu', en: 'Foster', ru: 'Передержка'},
        admin: {et: 'Admin', en: 'Admin', ru: 'Админ'},
    },

    // Top bar
    greeting: {et: 'Tere', en: 'Hi', ru: 'Здравствуйте'},

    // Dashboard
    dashboardTitle: {
        et: 'Tere tulemast! 🐱',
        en: 'Welcome! 🐱',
        ru: 'Добро пожаловать! 🐱'
    },
    myCats: {et: 'Minu hoiukassid', en: 'My foster cats', ru: 'Мои кошки'},
    nextTodos: {et: 'Järgmised ülesanded', en: 'Next to-dos', ru: 'Следующие задачи'},
    notifications: {et: 'Teavitused', en: 'Notifications', ru: 'Уведомления'},
    notificationInfo: {
        et: 'Meeldetuletused tulevad nii töölauale kui meilile.',
        en: 'Reminders appear on the dashboard and are also sent by email.',
        ru: 'Напоминания появляются на панели и отправляются на email.'
    },
    emailOn: {et: 'Meil sees', en: 'Email on', ru: 'Email включен'},

    // Todo filters
    allCats: {et: 'Kõik kassid', en: 'All cats', ru: 'Все кошки'},
    importantOnly: {et: 'Ainult tähtsad', en: 'Important only', ru: 'Только важные'},
    today: {et: 'Täna', en: 'Today', ru: 'Сегодня'},
    soon: {et: 'Lähipäevil', en: 'Soon', ru: 'Скоро'},
    later: {et: 'Hiljem', en: 'Later', ru: 'Позже'},

    // Todo actions
    viewGuide: {et: 'Vaata juhendit', en: 'View guide', ru: 'Смотреть инструкцию'},
    bookAppointment: {et: 'Broneeri aeg', en: 'Book appointment', ru: 'Записаться'},
    uploadPhoto: {et: 'Laadi pilt üles', en: 'Upload photo', ru: 'Загрузить фото'},
    fillForm: {et: 'Täida ankeet', en: 'Fill the form', ru: 'Заполнить'},
    addNotes: {et: 'Lisa märkmed', en: 'Add notes', ru: 'Добавить заметки'},
    markDone: {et: 'Märgi tehtuks', en: 'Mark done', ru: 'Отметить'},

    // Empty states
    noTasks: {
        et: 'Kõik korras - hetkel pole ühtegi ülesannet.',
        en: 'All good - no tasks right now.',
        ru: 'Все хорошо - сейчас задач нет.'
    },
    noVisits: {
        et: 'Pole veel ühtegi külastust',
        en: 'No visits yet',
        ru: 'Еще нет визитов'
    },

    // Cat card
    openProfile: {et: 'Ava profiil', en: 'Open profile', ru: 'Открыть профиль'},
    monthsOld: {et: 'kuud vana', en: 'months old', ru: 'месяцев'},
    yearOld: {et: 'aasta vana', en: 'year old', ru: 'год'},
    yearsOld: {et: 'aastat vana', en: 'years old', ru: 'лет'},
    male: {et: 'isane', en: 'male', ru: 'самец'},
    female: {et: 'emane', en: 'female', ru: 'самка'},

    // Status badges
    lookingForHome: {et: 'Otsib kodu', en: 'Looking for home', ru: 'Ищет дом'},
    notListed: {et: 'Pole veebis', en: 'Not listed', ru: 'Не опубликован'},
    reserved: {et: 'Broneeritud', en: 'Reserved', ru: 'Забронирован'},

    // Cat Profile
    baseInfo: {et: 'Põhiandmed', en: 'Base information', ru: 'Основная информация'},
    characteristics: {et: 'Iseloom ja sobivus', en: 'Personality & fit', ru: 'Характер и совместимость'},
    listingInfo: {et: 'Kuulutuse pealkiri ja tekst', en: 'Listing title and text', ru: 'Заголовок и описание'},
    photos: {et: 'Pildid', en: 'Photos', ru: 'Фотографии'},
    category: {et: 'Kategooria', en: 'Category', ru: 'Категория'},

    // Form fields
    rescueId: {et: 'Päästenumber', en: 'Rescue ID', ru: 'ID спасения'},
    location: {et: 'Asukoht', en: 'Location', ru: 'Местоположение'},
    birthDate: {et: 'Sünniaeg', en: 'Birth date', ru: 'Дата рождения'},
    gender: {et: 'Sugu', en: 'Gender', ru: 'Пол'},
    color: {et: 'Värv', en: 'Color', ru: 'Цвет'},
    furLength: {et: 'Karva pikkus', en: 'Fur length', ru: 'Длина шерсти'},
    chipNumber: {et: 'Kiibinumber', en: 'Chip number', ru: 'Номер чипа'},
    notes: {et: 'Märkmed', en: 'Notes', ru: 'Заметки'},

    // Personality traits
    friendly: {et: 'Sõbralik', en: 'Friendly', ru: 'Дружелюбный'},
    playful: {et: 'Mänguhimuline', en: 'Playful', ru: 'Игривый'},
    calm: {et: 'Rahulik', en: 'Calm', ru: 'Спокойный'},
    energetic: {et: 'Energiline', en: 'Energetic', ru: 'Энергичный'},
    shy: {et: 'Arg', en: 'Shy', ru: 'Застенчивый'},
    independent: {et: 'Iseseisev', en: 'Independent', ru: 'Независимый'},
    affectionate: {et: 'Hellitav', en: 'Affectionate', ru: 'Ласковый'},
    vocal: {et: 'Häälitsev', en: 'Vocal', ru: 'Голосистый'},

    // Buttons
    save: {et: 'Salvesta', en: 'Save', ru: 'Сохранить'},
    cancel: {et: 'Tühista', en: 'Cancel', ru: 'Отменить'},
    saveAndUpdate: {
        et: 'Salvesta ja uuenda veebis',
        en: 'Save and update website',
        ru: 'Сохранить и обновить сайт'
    },
    submit: {et: 'Saada', en: 'Submit', ru: 'Отправить'},
    sendForConfirmation: {et: 'Saada kinnituseks', en: 'Send for confirmation', ru: 'Отправить на подтверждение'},
    markAsReserved: {et: 'Märgi broneerituks', en: 'Mark as reserved', ru: 'Отметить как забронировано'},

    // Success messages
    updateSuccess: {
        et: 'Valmis! Muudatused kajastuvad veebilehel.',
        en: 'Done! Updates are reflected on the website.',
        ru: 'Готово! Изменения отображаются на сайте.'
    },
    appointmentSuccess: {
        et: 'Aitäh! Vabatahtlik kinnitab sinu visiidi. Pärast visiiti palun lisa samale lehele kokkuvõte ja soovitused.',
        en: 'Thank you! A volunteer will confirm your visit. After the visit, please add notes and recommendations on this page.',
        ru: 'Спасибо! Волонтер подтвердит визит. После визита добавьте заметки и рекомендации на этой странице.'
    },

    // Medical
    vaccination: {et: 'Vaktsineerimine', en: 'Vaccination', ru: 'Вакцинация'},
    vetVisits: {et: 'Veterinaarkülastused', en: 'Vet visits', ru: 'Посещения ветеринара'},
    lastVaccination: {et: 'Viimane vaktsineerimine', en: 'Last vaccination', ru: 'Последняя вакцинация'},
    nextVaccination: {et: 'Järgmine vaktsineerimine', en: 'Next vaccination', ru: 'Следующая вакцинация'},
    registerNextVisit: {
        et: 'Registreeri järgmine veterinaariaeg',
        en: 'Register next vet visit',
        ru: 'Зарегистрировать следующий визит'
    },
    addFirstVisit: {et: 'Lisa esimene külastus', en: 'Add first visit', ru: 'Добавить первый визит'},
    addVetVisit: {et: 'Lisa veterinaarkülastus', en: 'Add vet visit', ru: 'Добавить визит'},
    bookAndRegister: {
        et: 'Broneeri aeg ja registreeri siin',
        en: 'Book and register here',
        ru: 'Запишитесь и зарегистрируйте здесь'
    },

    // Modal fields
    clinicName: {et: 'Kliinik', en: 'Clinic name', ru: 'Название клиники'},
    visitDate: {et: 'Külastuse kuupäev', en: 'Visit date', ru: 'Дата визита'},
    visitTime: {et: 'Kellaaeg', en: 'Time', ru: 'Время'},
    reason: {et: 'Põhjus', en: 'Reason', ru: 'Причина'},
    selectCat: {et: 'Vali kass', en: 'Select cat', ru: 'Выберите кота'},

    // Misc
    you: {et: 'Sina ise', en: 'You', ru: 'Вы'},
    dueSoon: {et: 'Varsti tähtaeg', en: 'Due soon', ru: 'Скоро'},
    overdue: {et: 'Tähtaeg ületatud', en: 'Overdue', ru: 'Просрочено'},
    done: {et: 'Tehtud', en: 'Done', ru: 'Готово'},
    notDone: {et: 'Tegemata', en: 'Not done', ru: 'Не сделано'},
    needsInfo: {et: 'Vajab infot', en: 'Needs info', ru: 'Нужна информация'},
};
