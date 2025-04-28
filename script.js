// Функция для сохранения текста в localStorage
function saveContent() {
    document.querySelectorAll('.editable').forEach(element => {
      const key = element.getAttribute('data-key');
      localStorage.setItem(key, element.innerHTML);
    });
  }
  
  // Функция для загрузки текста из localStorage
  function loadContent() {
    document.querySelectorAll('.editable').forEach(element => {
      const key = element.getAttribute('data-key');
      const savedContent = localStorage.getItem(key);
      if (savedContent) {
        element.innerHTML = savedContent;
      }
    });
  }
  
  // Инициализация при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    loadContent();
  
    document.querySelectorAll('.editable').forEach(element => {
      element.addEventListener('input', () => {
        saveContent();
  
        // Анимация при редактировании
        element.classList.add('clicked');
        setTimeout(() => element.classList.remove('clicked'), 300);
      });
    });
  
    // Кнопка скачивания PDF
    document.getElementById('download').addEventListener('click', () => {
      const resume = document.getElementById('resume');
      html2pdf()
        .from(resume)
        .set({
          margin: 0.5,
          filename: 'Resume.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait' }
        })
        .save();
    });
  });