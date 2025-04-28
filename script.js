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
    const elementCopy = element.cloneNode(true);
    
    // Удаляем кнопки
    elementCopy.querySelector('.actions')?.remove();
    
    // Применяем черный цвет с !important ко всем элементам
    const allElements = elementCopy.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.setProperty('color', '#000000', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
    });
    
    // Особые стили для заголовков (если нужно сохранить их цвет)
    elementCopy.querySelectorAll('h1, h2, h3, .section-title').forEach(el => {
        el.style.setProperty('color', '#000000', 'important'); // Или другой цвет для заголовков
    });
    
    // Временное добавление в DOM
    elementCopy.style.position = 'fixed';
    elementCopy.style.left = '-9999px';
    document.body.appendChild(elementCopy);
    
    // Настройки PDF
    const opt = {
        html2canvas: {
            scale: 2,
            backgroundColor: '#FFFFFF',
            ignoreElements: (el) => el.classList.contains('actions')
        },
        jsPDF: { format: 'a4' }
    };
    
    setTimeout(() => {
        html2pdf()
            .set(opt)
            .from(elementCopy)
            .save()
            .finally(() => {
                document.body.removeChild(elementCopy);
            });
    }, 1500);
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