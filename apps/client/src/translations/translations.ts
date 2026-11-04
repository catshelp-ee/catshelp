export const translations = {
    // Navigation
    nav: {
        title: {
            et: 'Cats Help Hoiukoduportaal',
            en: 'Cats Help Foster Home Portal',
            ru: 'Cats Help Портал передержки',
        },
        titleAdmin: {
            et: 'Loomade varjupaiga haldussüsteem',
            en: 'Animal Shelter Management System',
            ru: 'Система управления приютом для животных',
        },
        dashboard: { et: 'Töölaud', en: 'Dashboard', ru: 'Панель' },
        catProfile: { et: 'Kassi profiil', en: 'Cat Profile', ru: 'Профиль кота' },
        medical: {
            et: 'Tervis ja kliinikud',
            en: 'Medical & Clinics',
            ru: 'Здоровье и клиники',
        },
        logout: { et: 'Logi välja', en: 'Log out', ru: 'выходить' },
        role: {
            ADMIN: { et: 'Admin', en: 'Admin', ru: 'Админ' },
            FOSTER: { et: 'Hoiukodu', en: 'Fosterhome', ru: 'Передержка' },
        },
    },

    // App mode
    mode: {
        foster: { et: 'Hoiukodu', en: 'Foster', ru: 'Передержка' },
        admin: { et: 'Admin', en: 'Admin', ru: 'Админ' },
    },

    // Top bar
    greeting: { et: 'Tere', en: 'Hi', ru: 'Здравствуйте' },

    // Dashboard
    dashboardTitle: {
        et: 'Tere tulemast! 🐱',
        en: 'Welcome! 🐱',
        ru: 'Добро пожаловать! 🐱',
    },
    myCats: { et: 'Minu hoiukassid', en: 'My foster cats', ru: 'Мои кошки' },
    nextTodos: {
        et: 'Järgmised ülesanded',
        en: 'Next to-dos',
        ru: 'Следующие задачи',
    },
    notifications: { et: 'Teavitused', en: 'Notifications', ru: 'Уведомления' },
    notificationInfo: {
        et: 'Meeldetuletused tulevad nii töölauale kui meilile.',
        en: 'Reminders appear on the dashboard and are also sent by email.',
        ru: 'Напоминания появляются на панели и отправляются на email.',
    },
    emailOn: { et: 'Meil sees', en: 'Email on', ru: 'Email включен' },

    // Todo filters
    allCats: { et: 'Kõik kassid', en: 'All cats', ru: 'Все кошки' },
    importantOnly: {
        et: 'Ainult tähtsad',
        en: 'Important only',
        ru: 'Только важные',
    },
    today: { et: 'Täna', en: 'Today', ru: 'Сегодня' },
    soon: { et: 'Lähipäevil', en: 'Soon', ru: 'Скоро' },
    later: { et: 'Hiljem', en: 'Later', ru: 'Позже' },

    // Todo actions
    viewGuide: {
        et: 'Vaata juhendit',
        en: 'View guide',
        ru: 'Смотреть инструкцию',
    },
    bookAppointment: {
        et: 'Broneeri aeg',
        en: 'Book appointment',
        ru: 'Записаться',
    },
    uploadPhoto: {
        et: 'Laadi pilt üles',
        en: 'Upload photo',
        ru: 'Загрузить фото',
    },
    fillForm: { et: 'Täida ankeet', en: 'Fill the form', ru: 'Заполнить' },
    addNotes: { et: 'Lisa märkmed', en: 'Add notes', ru: 'Добавить заметки' },
    markDone: { et: 'Märgi tehtuks', en: 'Mark done', ru: 'Отметить' },

    // Empty states
    noTasks: {
        et: 'Kõik korras - hetkel pole ühtegi ülesannet.',
        en: 'All good - no tasks right now.',
        ru: 'Все хорошо - сейчас задач нет.',
    },
    noVisits: {
        et: 'Pole veel ühtegi külastust',
        en: 'No visits yet',
        ru: 'Еще нет визитов',
    },

    // Cat card
    openProfile: { et: 'Ava profiil', en: 'Open profile', ru: 'Открыть профиль' },
    months: { et: 'kuud', en: 'months', ru: 'месяцев' },
    conj: { et: 'ja', en: 'and', ru: 'и'},
    years: { et: 'aastat', en: 'years', ru: 'лет' },
    MALE: { et: 'isane', en: 'male', ru: 'самец' },
    FEMALE: { et: 'emane', en: 'female', ru: 'самка' },

    // Status badges
    lookingForHome: { et: 'Otsib kodu', en: 'Looking for home', ru: 'Ищет дом' },
    notListed: { et: 'Pole veebis', en: 'Not listed', ru: 'Не опубликован' },
    reserved: { et: 'Broneeritud', en: 'Reserved', ru: 'Забронирован' },

    // Buttons
    save: { et: 'Salvesta', en: 'Save', ru: 'Сохранить' },
    cancel: { et: 'Tühista', en: 'Cancel', ru: 'Отменить' },
    saveAndUpdate: {
        et: 'Salvesta ja uuenda veebis',
        en: 'Save and update website',
        ru: 'Сохранить и обновить сайт',
    },
    submit: { et: 'Saada', en: 'Submit', ru: 'Отправить' },
    sendForConfirmation: {
        et: 'Saada kinnituseks',
        en: 'Send for confirmation',
        ru: 'Отправить на подтверждение',
    },
    markAsReserved: {
        et: 'Märgi broneerituks',
        en: 'Mark as reserved',
        ru: 'Отметить как забронировано',
    },

    // Success messages
    updateSuccess: {
        et: 'Valmis! Muudatused kajastuvad veebilehel.',
        en: 'Done! Updates are reflected on the website.',
        ru: 'Готово! Изменения отображаются на сайте.',
    },
    appointmentSuccess: {
        et: 'Aitäh! Vabatahtlik kinnitab sinu visiidi. Pärast visiiti palun lisa samale lehele kokkuvõte ja soovitused.',
        en: 'Thank you! A volunteer will confirm your visit. After the visit, please add notes and recommendations on this page.',
        ru: 'Спасибо! Волонтер подтвердит визит. После визита добавьте заметки и рекомендации на этой странице.',
    },

    // Medical
    vaccination: { et: 'Vaktsineerimine', en: 'Vaccination', ru: 'Вакцинация' },
    vetVisits: {
        et: 'Veterinaarkülastused',
        en: 'Vet visits',
        ru: 'Посещения ветеринара',
    },
    lastVaccination: {
        et: 'Viimane vaktsineerimine',
        en: 'Last vaccination',
        ru: 'Последняя вакцинация',
    },
    nextVaccination: {
        et: 'Järgmine vaktsineerimine',
        en: 'Next vaccination',
        ru: 'Следующая вакцинация',
    },
    registerNextVisit: {
        et: 'Registreeri järgmine veterinaariaeg',
        en: 'Register next vet visit',
        ru: 'Зарегистрировать следующий визит',
    },
    addFirstVisit: {
        et: 'Lisa esimene külastus',
        en: 'Add first visit',
        ru: 'Добавить первый визит',
    },
    addVetVisit: {
        et: 'Lisa veterinaarkülastus',
        en: 'Add vet visit',
        ru: 'Добавить визит',
    },
    bookAndRegister: {
        et: 'Broneeri aeg ja registreeri siin',
        en: 'Book and register here',
        ru: 'Запишитесь и зарегистрируйте здесь',
    },

    // Modal fields
    clinicName: { et: 'Kliinik', en: 'Clinic name', ru: 'Название клиники' },
    visitDate: { et: 'Külastuse kuupäev', en: 'Visit date', ru: 'Дата визита' },
    visitTime: { et: 'Kellaaeg', en: 'Time', ru: 'Время' },
    reason: { et: 'Põhjus', en: 'Reason', ru: 'Причина' },
    selectCat: { et: 'Vali kass', en: 'Select cat', ru: 'Выберите кота' },

    // Misc
    you: { et: 'Sina ise', en: 'You', ru: 'Вы' },
    dueSoon: { et: 'Varsti tähtaeg', en: 'Due soon', ru: 'Скоро' },
    overdue: { et: 'Tähtaeg ületatud', en: 'Overdue', ru: 'Просрочено' },
    done: { et: 'Tehtud', en: 'Done', ru: 'Готово' },
    notDone: { et: 'Tegemata', en: 'Not done', ru: 'Не сделано' },
    needsInfo: { et: 'Vajab infot', en: 'Needs info', ru: 'Нужна информация' },

    catDetails: {
        baseInfo: {
            et: 'Põhiandmed',
            en: 'Base information',
            ru: 'Основная информация',
        },
        characteristics: {
            et: 'Iseloom ja sobivus',
            en: 'Personality & fit',
            ru: 'Характер и совместимость',
        },
        listingInfo: {
            et: 'Kuulutuse pealkiri ja tekst',
            en: 'Listing title and text',
            ru: 'Заголовок и описание',
        },
        photos: { et: 'Pildid', en: 'Photos', ru: 'Фотографии' },
        category: { et: 'Kategooria', en: 'Category', ru: 'Категория' },

        // Form fields
        rescueId: { et: 'Päästenumber', en: 'Rescue ID', ru: 'ID спасения' },
        location: { et: 'Asukoht', en: 'Location', ru: 'Местоположение' },
        birthDate: { et: 'Sünniaeg', en: 'Birth date', ru: 'Дата рождения' },
        gender: { et: 'Sugu', en: 'Gender', ru: 'Пол' },
        color: { et: 'Värv', en: 'Color', ru: 'Цвет' },
        furLength: { et: 'Karva pikkus', en: 'Fur length', ru: 'Длина шерсти' },
        chipNumber: { et: 'Kiibinumber', en: 'Chip number', ru: 'Номер чипа' },
        notes: { et: 'Märkmed', en: 'Notes', ru: 'Заметки' },
        timeInCare: { et: 'Aeg hoolduses', en: 'Time in care', ru: 'Время в уходе' },
        timeInCarePlaceholder: { et: 'Nt 3 kuud, 1 aasta', en: 'E.g., 3 months, 1 year', ru: 'Например, 3 месяца, 1 год' },
        chronicIllness: { et: 'Krooniline haigus', en: 'Chronic illness', ru: 'Хроническое заболевание' },
        chronicIllnessPlaceholder: { et: 'Kui pole, jäta tühjaks', en: 'If none, leave blank', ru: 'Если нет, оставьте пустым' },
        notesPlaceholder: { et: 'Täiendavad märkmed', en: 'Additional notes', ru: 'Дополнительные заметки' },
        rescueStory: { et: 'Päästmise lugu', en: 'Rescue story', ru: 'История спасения' },
        rescueStoryPlaceholder: { et: 'Kirjelda, kuidas kass meie MTÜ hoole alla sattus', en: 'Describe how the cat came under our NGO\'s care', ru: 'Опишите, как кошка попала под опеку нашей НКО' },

        habitsOptions: {
            title: {
                et: 'Harjumused ja käitumine',
                en: 'Habits and behavior',
                ru: 'Привычки и поведение',
            },
            usesLitterbox: {
                et: 'Kasutab liivakasti hästi',
                en: 'Uses litter box well',
                ru: 'Хорошо использует лоток',
            },
            usesScratchingpost: {
                et: 'Kasutab kratsimispuud hästi',
                en: 'Uses scratching post well',
                ru: 'Хорошо использует когтеточку',
            },
            selectiveWithFood: {
                et: 'On valikuline toiduga, pirtsutab',
                en: 'Picky with food, splashes',
                ru: 'Привередлив с едой, разбрасывает',
            },
            adaptable: {
                et: 'Harjub kiirelt uue kohaga',
                en: 'Adapts quickly to new place',
                ru: 'Быстро привыкает к новому месту',
            },
            scratchesFurniture: {
                et: 'Kipub kratsima muud mööblit',
                en: 'Tends to scratch other furniture',
                ru: 'Склонен царапать другую мебель',
            },
            trusting: {
                et: 'Usaldab inimesi kiiresti',
                en: 'Trusts people quickly',
                ru: 'Быстро доверяет людям',
            },
        },
        likesOptions: {
            title: { et: 'Kassile meeldib', ru: 'Кошке нравится', en: 'Cat likes' },
            beingOnLap: { et: 'Süles olla', en: 'Being on lap', ru: 'Сидеть на коленях' },
            sleepsCuddling: {
                et: 'Kaisus magada',
                en: 'Sleep cuddling',
                ru: 'Спать в обнимку',
            },
            likesPetting: { et: 'Pai saada', en: 'Getting petted', ru: 'Получать ласку' },
            likesAttention: {
                et: 'Palju tähelepanu',
                en: 'Lots of attention',
                ru: 'Много внимания',
            },
            likesPlayingWithPeople: {
                et: 'Mängida mänguasjadega inimesega',
                en: 'Play with toys with human',
                ru: 'Играть с игрушками с человеком',
            },
            likesPlayingAlone: {
                et: 'Mängida mänguasjadega üksinda',
                en: 'Play with toys alone',
                ru: 'Играть с игрушками одна',
            },
        },
        personalityOptions: {
            title: { et: 'Iseloomujooned', ru: 'Черты характера', en: 'Personality traits' },
            bold: { et: 'Julge', en: 'Bold', ru: 'Смелый' },
            shy: { et: 'Arg', en: 'Shy', ru: 'Застенчивый' },
            active: { et: 'Aktiivne', en: 'Active', ru: 'Активный' },
            veryActive: { et: 'Väga aktiivne', en: 'Very active', ru: 'Очень активный' },
            calm: { et: 'Rahulik', en: 'Calm', ru: 'Спокойный' },
            friendly: { et: 'Sõbralik', en: 'Friendly', ru: 'Дружелюбный' },
            grumpy: { et: 'Pahur', en: 'Grumpy', ru: 'Ворчливый' },
            vocal: { et: 'Hellik', en: 'Vocal', ru: 'Разговорчивый' },
            dislikesTouching: {
                et: 'Ei lase puudutada ennast',
                en: "Doesn't allow touching",
                ru: 'Не позволяет прикасаться',
            },
            sociable: { et: 'Seltsiv', en: 'Sociable', ru: 'Общительный' },
            aloof: { et: 'Omaette hoidev', en: 'Aloof', ru: 'Отстраненный' },
            goodAppetite: { et: 'Hea isuga', en: 'Good appetite', ru: 'Хороший аппетит' },
            curious: { et: 'Uudishimulik', en: 'Curious', ru: 'Любопытный' },
            playful: { et: 'Mänguline', en: 'Playful', ru: 'Игривый' },
            stressed: { et: 'Stressis', en: 'Stressed', ru: 'В стрессе' },
            sensitive: { et: 'Õrnahingeline', en: 'Sensitive', ru: 'Чувствительный' },
            peaceful: { et: 'Rahumeelne', en: 'Peaceful', ru: 'Миролюбивый' },
            selfish: { et: 'Isekas', en: 'Selfish', ru: 'Эгоистичный' },
            hisses: { et: 'Sisiseb palju', en: 'Purrs a lot', ru: 'Много мурлычет' },
        },
        personalityAndCompatibility: {
            et: 'Iseloom ja sobivus',
            ru: 'Характер и Совместимость',
            en: 'Personality and Compatibility',
        },
        dailyDescription: {
            et: 'Kirjelda kassi mõne iseloomustava lausega',
            ru: 'Опишите кота несколькими характерными фразами',
            en: 'Describe the cat with a few characteristic sentences'
        },
        dailyDescriptionPlaceholder: {
            et: 'Nt milline on kiisu argipäev',
            ru: 'Например, как проходит обычный день кота',
            en: 'E.g. what is the cat\'s daily routine like'
        },
        specialRequirements: {
            et: 'Erisoovid uuele perele',
            ru: 'Особые требования к новой семье',
            en: 'Special requirements for new home'
        },
        specialRequirementsPlaceholder: {
            et: 'Nt vajab kõrvale kassi, ilma lasteta pere, rahulikuma eluviisiga pere, kass vajab suurt tähelepanu jne',
            ru: 'Например, нужен другой кот рядом, семья без детей, спокойная семья, кот требует много внимания и т.д.',
            en: 'E.g. needs another cat, no kids, calm family, needs lots of attention, etc.'
        }
    },
    photoGallery: {
        title: {
            et: 'Pildid',
            en: 'Photos',
            ru: 'Фотографии'
        },
        profilePic: {
            et: 'Profiilipilt',
            en: 'Profile picture',
            ru: 'Фото профиля'
        },
        delete: {
            et: 'Kustuta',
            en: 'Delete',
            ru: 'Удалить'
        },
        setAsProfile: {
            et: 'Profiilipilt',
            en: 'Profile pic',
            ru: 'Фото профиля'
        },
        dragDrop: {
            et: 'Lohista pildid siia või',
            en: 'Drag photos here or',
            ru: 'Перетащите фото сюда или'
        },
        browse: {
            et: 'vali failid',
            en: 'browse files',
            ru: 'выберите файлы'
        },
        maxFiles: {
            et: (n: number) => `Maksimaalselt ${n} pilti. JPG, PNG, WebP`,
            en: (n: number) => `Max ${n} photos. JPG, PNG, WebP`,
            ru: (n: number) => `Максимум ${n} фото. JPG, PNG, WebP`
        },
        noPhotos: {
            et: 'Pilte pole lisatud',
            en: 'No photos added',
            ru: 'Фотографии не добавлены'
        }
    },
    saveSuccess: {
        et: 'Andmed uuendatud!',
        en: 'Data updated!',
        ru: 'Данные обновлены!'
    },
    saveError: {
        et: 'Andmete uuendamine ebaõnnestus',
        en: 'Failed to update data',
        ru: 'Не удалось обновить данные'
    }

};
