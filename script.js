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
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Создаем копию элемента для PDF
    const elementCopy = element.cloneNode(true);

    // Скрываем кнопки
    const buttons = elementCopy.querySelectorAll('.actions');
    buttons.forEach(btn => btn.style.display = 'none');

    // Применяем стили для PDF
    function setStylesRecursively(node) {
        if (node.nodeType === 1) {
            node.style.color = '#000';
            node.style.backgroundColor = 'transparent';
            if (node.classList.contains('resume-header')) {
                node.style.backgroundColor = '#fff';
            }
            if (node.classList.contains('section-title')) {
                node.style.borderBottom = '2px solid #000';
            }
        }
        node.childNodes.forEach(child => setStylesRecursively(child));
    }

    setStylesRecursively(elementCopy);

    // Добавляем копию в DOM для рендеринга
    document.body.appendChild(elementCopy);

    // Рендерим содержимое как изображение с помощью html2canvas
    setTimeout(() => {
        html2canvas(elementCopy, { scale: 2, useCORS: true, backgroundColor: '#fff' }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 190; // Ширина изображения в PDF
            const pageHeight = 297; // Высота страницы A4
            const margin = 10;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Добавляем изображение на первую страницу
            pdf.addImage(imgData, 'JPEG', margin, position + margin, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Добавляем дополнительные страницы, если изображение слишком длинное
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', margin, position + margin, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Сохраняем PDF как Blob и инициируем скачивание
            const pdfBlob = pdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Удаляем временную копию элемента
            document.body.removeChild(elementCopy);
        }).catch(error => {
            console.error('Ошибка при рендеринге PDF:', error);
            alert('Произошла ошибка при создании PDF. Пожалуйста, попробуйте снова.');
            document.body.removeChild(elementCopy);
        });
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