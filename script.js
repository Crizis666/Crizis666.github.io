document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.addEventListener('click', addClickAnimation);
    });
    
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
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
        html2canvas: { 
            scale: 2,
            logging: true,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#FFFFFF',
            ignoreElements: (element) => {
                // Игнорируем только кнопки действий
                return element.classList.contains('actions');
            }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Создаем копию с исправленными стилями
    const elementCopy = element.cloneNode(true);
    
    // Применяем стили для PDF
    elementCopy.querySelectorAll('*').forEach(el => {
        el.style.color = '#000000';
        el.style.backgroundColor = 'transparent';
    });
    
    // Устанавливаем специфичные стили для заголовков
    elementCopy.querySelectorAll('.section-title').forEach(el => {
        el.style.color = '#4285f4';
        el.style.borderBottom = '2px solid #f1f1f1';
    });
    
    // Устанавливаем стили для опыта работы
    elementCopy.querySelectorAll('.job-item h3').forEach(el => {
        el.style.color = '#4285f4';
        el.style.marginBottom = '5px';
    });
    
    elementCopy.querySelectorAll('.job-period').forEach(el => {
        el.style.color = '#777';
        el.style.fontStyle = 'italic';
        el.style.marginBottom = '10px';
    });

    // Временно добавляем в DOM
    elementCopy.style.position = 'fixed';
    elementCopy.style.left = '-9999px';
    elementCopy.style.width = '800px';
    document.body.appendChild(elementCopy);

    // Генерация PDF
    setTimeout(() => {
        html2pdf()
            .set(opt)
            .from(elementCopy)
            .save()
            .then(() => {
                document.body.removeChild(elementCopy);
            });
    }, 500);
}

function saveData() {
    const resumeData = {};
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach((element, index) => {
        resumeData[`editable-${index}`] = element.innerHTML;
    });
    
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    
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