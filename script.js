document.addEventListener('DOMContentLoaded', function() {
    // Загрузка сохраненных данных
    loadSavedData();
    
    // Обработчики кнопок
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
    document.getElementById('saveBtn').addEventListener('click', saveData);
    
    // Добавляем анимацию клика для редактируемых элементов
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.addEventListener('click', function() {
            this.classList.add('click-animation');
            setTimeout(() => {
                this.classList.remove('click-animation');
            }, 300);
        });
    });
});

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
    
    // Устанавливаем цвета для PDF
    const allElements = elementCopy.querySelectorAll('*');
    allElements.forEach(el => {
        // Сохраняем оригинальные цвета заголовков
        if (el.classList.contains('resume-header') || 
            el.classList.contains('section-title') || 
            el.tagName === 'H1' || 
            el.tagName === 'H2' || 
            el.tagName === 'H3') {
            el.style.color = window.getComputedStyle(el).color;
        } else {
            el.style.color = '#000000';
        }
        
        el.style.backgroundColor = 'transparent';
    });
    
    // Временно добавляем копию в DOM
    elementCopy.style.position = 'fixed';
    elementCopy.style.left = '-9999px';
    elementCopy.style.top = '0';
    document.body.appendChild(elementCopy);
    
    // Настройки для PDF
    const opt = {
        margin: 10,
        filename: 'resume_ilya_zharikov.pdf',
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
    
    // Анимация сохранения
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