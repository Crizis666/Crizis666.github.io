document.addEventListener('DOMContentLoaded', function() {
    // Загрузка сохраненных данных
    loadSavedData();
    
    // Добавление ripple эффекта к кнопкам
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Добавление анимации клика к редактируемым элементам
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.addEventListener('click', addClickAnimation);
    });
    
    // Обработчик кнопки скачивания
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
    
    // Обработчик кнопки сохранения
    document.getElementById('saveBtn').addEventListener('click', saveData);
});

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

function addClickAnimation(event) {
    const element = event.currentTarget;
    element.classList.add('click-effect');
    setTimeout(() => {
        element.classList.remove('click-effect');
    }, 400);
}

function downloadPDF() {
    const element = document.querySelector('.resume-container');
    
    // Создаем копию элемента
    const elementCopy = element.cloneNode(true);
    
    // Удаляем кнопки действий
    const actions = elementCopy.querySelector('.actions');
    if (actions) actions.remove();
    
    // Применяем стили для PDF
    elementCopy.style.width = '800px';
    elementCopy.style.margin = '0 auto';
    elementCopy.style.padding = '0';
    elementCopy.style.boxShadow = 'none';
    
    // Принудительно устанавливаем черный цвет для всего текста
    const allTextElements = elementCopy.querySelectorAll('*');
    allTextElements.forEach(el => {
        el.style.color = '#000000'; // Черный цвет
        el.style.backgroundColor = 'transparent';
    });
    
    // Сохраняем синий цвет только для заголовков
    const headers = elementCopy.querySelectorAll('h1, h2, h3, .section-title');
    headers.forEach(header => {
        header.style.color = '#4285f4'; // Синий цвет для заголовков
    });
    
    // Стили для периодов работы (серый курсив)
    const periods = elementCopy.querySelectorAll('.job-period, .education-period');
    periods.forEach(period => {
        period.style.color = '#777777';
        period.style.fontStyle = 'italic';
    });
    
    // Временно добавляем копию в DOM
    elementCopy.style.position = 'fixed';
    elementCopy.style.left = '-9999px';
    elementCopy.style.top = '0';
    document.body.appendChild(elementCopy);
    
    // Настройки для PDF
    const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { 
            type: 'jpeg', 
            quality: 1 
        },
        html2canvas: { 
            scale: 2,
            logging: true,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#FFFFFF',
            ignoreElements: (el) => el.classList.contains('actions')
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Генерация PDF с задержкой
    setTimeout(() => {
        html2pdf()
            .set(opt)
            .from(elementCopy)
            .save()
            .then(() => {
                document.body.removeChild(elementCopy);
            })
            .catch(err => {
                console.error('Ошибка генерации PDF:', err);
                document.body.removeChild(elementCopy);
            });
    }, 1000);
}

function saveData() {
    const resumeData = {};
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach((element, index) => {
        resumeData[`editable-${index}`] = element.innerHTML;
    });
    
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    
    // Анимация подтверждения сохранения
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.textContent = 'Сохранено!';
    saveBtn.style.backgroundColor = '#0f9d58';
    
    setTimeout(() => {
        saveBtn.textContent = 'Сохранить изменения';
        saveBtn.style.backgroundColor = '#4285f4';
    }, 2000);
}

function loadSavedData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        const resumeData = JSON.parse(savedData);
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        
        editableElements.forEach((element, index) => {
            const key = `editable-${index}`;
            if (resumeData[key]) {
                element.innerHTML = resumeData[key];
            }
        });
    }
}