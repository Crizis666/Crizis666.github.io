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

document.fonts.ready.then(() => {
    downloadPDF();
});

async function downloadPDF() {
    const element = document.querySelector('.resume-container');
    
    // Создаем чистую копию элемента
    const elementCopy = element.cloneNode(true);
    
    // Удаляем ненужные элементы
    elementCopy.querySelector('.actions')?.remove();
    
    // Применяем абсолютные стили для PDF
    elementCopy.style.width = '800px';
    elementCopy.style.margin = '0 auto';
    elementCopy.style.padding = '20px';
    elementCopy.style.boxShadow = 'none';
    elementCopy.style.background = '#ffffff';
    
    // Принудительно устанавливаем стили для всех элементов
    const allElements = elementCopy.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.color = '#000000';
        el.style.backgroundColor = 'transparent';
        el.style.boxShadow = 'none';
        el.style.textShadow = 'none';
    });
    
    // Явно задаем стили для заголовков
    elementCopy.querySelectorAll('h1, h2, h3').forEach(el => {
        el.style.color = '#000000';
        el.style.fontWeight = 'bold';
    });
    
    // Временно добавляем в DOM
    elementCopy.style.position = 'fixed';
    elementCopy.style.left = '-9999px';
    elementCopy.style.top = '0';
    elementCopy.style.zIndex = '9999';
    document.body.appendChild(elementCopy);
    
    try {
        // Новые оптимальные настройки
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
                allowTaint: true,
                letterRendering: true,
                backgroundColor: '#ffffff',
                ignoreElements: (el) => el.classList.contains('actions')
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };
        
        // Добавляем задержку для применения стилей
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Генерация PDF
        await html2pdf().set(opt).from(elementCopy).save();
        
    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
    } finally {
        // Удаляем временный элемент
        document.body.removeChild(elementCopy);
    }
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