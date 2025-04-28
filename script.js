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

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  generateBtn.addEventListener("click", generatePDF);
});

function downloadPDF() {
    const element = document.querySelector('.resume-container');
    
    // Создаем копию с принудительными стилями для PDF
    const elementCopy = element.cloneNode(true);
    
    // Удаляем кнопки
    elementCopy.querySelector('.actions')?.remove();
    
    // Применяем абсолютно черный цвет ко ВСЕМУ тексту
    const allElements = elementCopy.querySelectorAll('*');
    allElements.forEach(el => {
        // Сохраняем только подчеркивание для ссылок
        if (el.tagName !== 'A') {
            el.style.color = '#000000'; // Черный цвет
            el.style.backgroundColor = 'transparent';
        }
    });
    
    // Явно устанавливаем стили для заголовков
    elementCopy.querySelectorAll('h1, h2, h3, .section-title').forEach(el => {
        el.style.color = '#000000'; // Черный цвет для заголовков тоже
    });
    
    // Временно добавляем в DOM
    elementCopy.style.position = 'fixed';
    elementCopy.style.left = '-9999px';
    elementCopy.style.width = '800px';
    document.body.appendChild(elementCopy);
    
    // Настройки для PDF с улучшенной обработкой цветов
    const opt = {
        margin: 10,
        filename: 'resume.pdf',
        html2canvas: {
            scale: 2,
            logging: true,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#FFFFFF', // Белый фон
            ignoreElements: (el) => el.classList.contains('actions')
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };
    
    // Генерация с увеличенной задержкой
    setTimeout(() => {
        html2pdf()
            .set(opt)
            .from(elementCopy)
            .save()
            .finally(() => {
                document.body.removeChild(elementCopy);
            });
    }, 1500); // Увеличенная задержка
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