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
    const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#fff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const elementCopy = element.cloneNode(true);

    elementCopy.classList.add('pdf-rendering');

    const buttons = elementCopy.querySelectorAll('.actions');
    buttons.forEach(btn => btn.style.display = 'none');

    const style = document.createElement('style');
    style.innerHTML = `
        .resume-container * {
            color: #000 !important; /* Черный цвет для всего текста */
        }
        .resume-header {
            background-color: #fff !important; /* Белый фон для заголовка */
            color: #000 !important; /* Черный текст в заголовке */
        }
        .section-title {
            color: #000 !important;
            border-bottom: 2px solid #000 !important;
        }
        .job-item, .education-item, .skills-content, .contact-info p,
        .job-description, .education-description, .skills-content li {
            color: #000 !important;
        }
        .skills-content li::before {
            color: #000 !important;
        }
    `;
    elementCopy.appendChild(style);

    document.body.appendChild(elementCopy);

    setTimeout(() => {
        html2pdf().from(elementCopy).set(opt).save();
        setTimeout(() => {
            document.body.removeChild(elementCopy);
        }, 100);
    }, 200);
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