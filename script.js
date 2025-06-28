document.addEventListener('DOMContentLoaded', async function() {
  // Загрузка данных из JSON
  let arcanaData = [];
  try {
    const response = await fetch('arcana.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    arcanaData = data.arcana;
    
    // Проверка, что данные загрузились
    if (!arcanaData || !arcanaData.length) {
      throw new Error('No arcana data loaded');
    }
  } catch (error) {
    console.error('Ошибка загрузки arcana.json:', error);
    // Fallback на статические данные
    arcanaData = Object.entries(majorArcana).map(([id, card]) => ({
      id: parseInt(id),
      name: card.name,
      meanings: {
        individual: card.special,
        shadow: card.shadow,
        karma: "Описание кармического аспекта"
      }
    }));
  }

  // Функция отображения результата с учетом выбранного расклада
  function showResult(elementId, cardNum, posNum) {
    const card = arcanaData.find(c => c.id === cardNum);
    if (!card) return;
    
    const spreadType = document.querySelector('.spread-card.active')?.getAttribute('data-spread') || 'individual';
    const meaning = card.meanings[spreadType] || card.meanings.individual;
    
    const html = `
      <h4>${card.name} <span class="arcana-number">${cardNum}</span></h4>
      <p class="arcana-meaning"><strong>${meaning}</strong></p>
      ${spreadType === 'shadow' || posNum === 6 || posNum === 11 ? 
        `<p class="shadow-aspect"><em>Теневая сторона: ${card.meanings.shadow || 'нет информации'}</em></p>` : ''}
    `;
    
    document.getElementById(elementId).innerHTML = html;
  }

  // Остальной код (инициализация календаря, расчет позиций и т.д.) остается без изменений
  // ...
});
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация календаря с маской ввода
    const datePicker = flatpickr("#birthDate", {
        dateFormat: "d.m.Y",
        maxDate: "today",
        locale: "ru",
        allowInput: true,
        clickOpens: true,
        onReady: function(selectedDates, dateStr, instance) {
            instance.input.removeAttribute('readonly');
            
            instance.input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^\d]/g, '');
                
                let formatted = '';
                for (let i = 0; i < value.length; i++) {
                    if (i === 2 || i === 4) formatted += '.';
                    formatted += value[i];
                    if (formatted.length >= 10) break;
                }
                
                e.target.value = formatted;
                
                if (formatted.length === 10 && !isValidDate(formatted)) {
                    e.target.classList.add('error');
                } else {
                    e.target.classList.remove('error');
                }
            });
        }
    });

    // Функция проверки даты
    function isValidDate(dateString) {
        const parts = dateString.split('.');
        if (parts.length !== 3) return false;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
        if (year < 1900 || year > new Date().getFullYear()) return false;
        if (month < 1 || month > 12) return false;
        
        const date = new Date(year, month - 1, day);
        return date.getDate() === day && 
               date.getMonth() === month - 1 && 
               date.getFullYear() === year;
    }


    // База арканов с тенями
    const majorArcana = {
        0: { name: "Шут", meaning: "Начало пути, спонтанность", special: "Свободолюбивая натура и нестандартный подход к жизни.", shadow: "Безответственность, инфантильность" },
        1: { name: "Маг", meaning: "Воля, концентрация", special: "Усиливает интеллектуальные способности и предприимчивость.", shadow: "Манипуляции, обман" },
        2: { name: "Верховная Жрица", meaning: "Интуиция, тайна", special: "Глубокая интуиция и связь с подсознанием.", shadow: "Пассивность, загадочность" },
        3: { name: "Императрица", meaning: "Изобилие, плодородие", special: "Творческая энергия и способность к созиданию.", shadow: "Избалованность, лень" },
        4: { name: "Император", meaning: "Контроль, структура", special: "Организаторские способности и лидерские качества.", shadow: "Тирания, жесткость" },
        5: { name: "Иерофант", meaning: "Традиции, духовность", special: "Мудрость и связь с духовными ценностями.", shadow: "Догматизм, лицемерие" },
        6: { name: "Влюблённые", meaning: "Выбор, гармония", special: "Важность отношений и эмоциональных связей.", shadow: "Неуверенность, зависимость" },
        7: { name: "Колесница", meaning: "Победа, контроль", special: "Движение вперед и преодоление препятствий.", shadow: "Агрессия, нетерпимость" },
        8: { name: "Сила", meaning: "Энергия, страсть", special: "Внутренняя сила и способность к трансформации.", shadow: "Гнев, подавление" },
        9: { name: "Отшельник", meaning: "Созерцание, поиск истины", special: "Глубокий самоанализ и мудрость одиночества.", shadow: "Изоляция, отчуждение" },
        10: { name: "Колесо Фортуны", meaning: "Судьба, перемены", special: "Цикличность жизни и важность изменений.", shadow: "Фатализм, нестабильность" },
        11: { name: "Справедливость", meaning: "Баланс, карма", special: "Закон причинно-следственных связей.", shadow: "Черствость, холодность" },
        12: { name: "Повешенный", meaning: "Жертва, новый взгляд", special: "Необходимость смены перспективы.", shadow: "Мученичество, пассивность" },
        13: { name: "Смерть", meaning: "Трансформация, конец цикла", special: "Кардинальные изменения и перерождение.", shadow: "Разрушение, страх перемен" },
        14: { name: "Умеренность", meaning: "Гармония, равновесие", special: "Баланс между противоположностями.", shadow: "Компромисс, пассивность" },
        15: { name: "Дьявол", meaning: "Иллюзии, зависимость", special: "Испытания соблазнами и страстями.", shadow: "Порабощение, манипуляции" },
        16: { name: "Башня", meaning: "Крах, изменения", special: "Неожиданные перемены и разрушение иллюзий.", shadow: "Катастрофы, кризисы" },
        17: { name: "Звезда", meaning: "Надежда, вдохновение", special: "Духовное руководство и вера в лучшее.", shadow: "Разочарование, иллюзии" },
        18: { name: "Луна", meaning: "Подсознание, иллюзии", special: "Работа с подсознанием и страхами.", shadow: "Обман, тревожность" },
        19: { name: "Солнце", meaning: "Радость, успех", special: "Ясность, жизненная энергия и успех.", shadow: "Наивность, эгоцентризм" },
        20: { name: "Суд", meaning: "Возрождение, призыв", special: "Духовное пробуждение и новый этап.", shadow: "Критика, неприятие" },
        21: { name: "Мир", meaning: "Завершение, целостность", special: "Гармоничное завершение циклов.", shadow: "Застой, самодовольство" }
    };

    // Функция расчета всех позиций
    function calculateAllPositions(day, month, year) {
        const positions = [];
        
        // Основные позиции
        positions[1] = calculateCard(day);
        positions[2] = calculateCard(month);
        const yearSum = String(year).split('').reduce((sum, d) => sum + Number(d), 0);
        positions[3] = calculateCard(yearSum);
        
        // Дополнительные позиции
        positions[4] = calculateCard(day + month);
        positions[5] = calculateCard(month + yearSum);
        positions[6] = calculateCard(day + yearSum);
        positions[7] = calculateCard(day + month + yearSum);
        positions[8] = calculateCard(Math.abs(day - month));
        positions[9] = calculateCard(Math.abs(month - yearSum));
        positions[10] = calculateCard(Math.abs(day - yearSum));
        positions[11] = calculateCard(day * month);
        positions[12] = calculateCard(day * month * yearSum);
        positions[13] = calculateCard(day + month * yearSum);
        positions[14] = calculateCard(day * month + yearSum);
        
        return positions;
    }

    // Функция расчета карты
    function calculateCard(num) {
        // Приводим к числу от 0 до 21
        let result = num % 22;
        if (isNaN(result) || !isFinite(result)) return 0;
        return result;
    }

    // Функция расчета портрета
    function calculatePortrait() {
        const btn = document.getElementById('calculateBtn');
        btn.classList.add('loading');
        
        setTimeout(() => {
            try {
                const dateStr = document.getElementById('birthDate').value;
                if (!dateStr) {
                    alert('Введите дату рождения');
                    return;
                }

                if (!isValidDate(dateStr)) {
                    alert('Некорректная дата! Проверьте формат: ДД.ММ.ГГГГ');
                    return;
                }

                const [day, month, year] = dateStr.split('.').map(Number);
                
                // Расчет всех позиций
                const positions = calculateAllPositions(day, month, year);

                // Отображение результатов для всех позиций
                for (let i = 1; i <= 14; i++) {
                    showResult(`pos${i}-result`, positions[i], i);
                }

            } catch (error) {
                console.error(error);
                alert('Ошибка расчета');
            } finally {
                btn.classList.remove('loading');
            }
        }, 800);
    }

    // Функция отображения результата
    function showResult(elementId, cardNum, posNum) {
        const card = majorArcana[cardNum];
        if (!card) return;
        
        const html = `
            <h4>${card.name} <span class="arcana-number">${cardNum}</span></h4>
            <p class="arcana-meaning"><strong>${card.meaning}</strong></p>
            <p>${card.special || ''}</p>
            ${posNum === 6 || posNum === 11 ? `<p class="shadow-aspect"><em>Теневая сторона: ${card.shadow || 'нет информации'}</em></p>` : ''}
        `;
        
        document.getElementById(elementId).innerHTML = html;
    }

    // Переключение описаний карточек
document.querySelectorAll('.toggle-description').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.card');
        const description = card.querySelector('.full-description');
        
        // Переключаем классы
        if (description.classList.contains('hidden')) {
            description.classList.remove('hidden');
            description.classList.add('show');
            this.textContent = 'Скрыть описание';
        } else {
            description.classList.remove('show');
            description.classList.add('hidden');
            this.textContent = 'Показать описание';
        }
    });
});

    // Инициализация кнопки расчета
    document.getElementById('calculateBtn').addEventListener('click', calculatePortrait);

    // Обработка Enter
    document.getElementById('birthDate').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculatePortrait();
        }
    });

       // Переключение между раскладами
    document.querySelectorAll('.spread-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.spread-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Здесь можно добавить логику переключения раскладов
            const spreadType = this.getAttribute('data-spread');
            console.log('Выбран расклад:', spreadType);
        });
    });

});
document.addEventListener('DOMContentLoaded', function() {
  // Расширенный набор символов (120 элементов)
  const symbols = [
    "ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚻ", 
    "ᚾ", "ᚿ", "ᛁ", "ᛂ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛋ",
    "ᛌ", "ᛍ", "ᛎ", "ᛏ", "ᛐ", "ᛑ", "ᛒ", "ᛓ", "ᛔ", "ᛕ",
    "☉", "☿", "♀", "♁", "♂", "♃", "♄", "♅", "♆", "♇",
    "🜀", "🜁", "🜂", "🜃", "🜄", "🜅", "🜆", "🜇", "🜈", "🜉",
    "𓀀", "𓀁", "𓀂", "𓀃", "𓀄", "𓀅", "𓀆", "𓀇", "𓀈", "𓀉",
    "☥", "𓂀", "☤", "⚚", "🕉", "ॐ", "✡", "☯", "☮", "☸",
    "꧁", "꧂", "✺", "✹", "✸", "✷", "✶", "✵", "✴", "✳",
    "✲", "✱", "✰", "✦", "✧", "✩", "✪", "✫", "✬", "✭",
    "⚕", "⚖", "⚗", "⚘", "⚙", "⚚", "⚛", "⚜", "⚝", "⚞",
    "⚟", "⚠", "⚡", "⚢", "⚣", "⚤", "⚥", "⚦", "⚧", "⚨",
    "⚩", "⚪", "⚫", "⚬", "⚭", "⚮", "⚯", "⚰", "⚱", "⚲"
  ];

  const colors = [
    "#20c20e", "#ff0000", "#00a2ff", "#ffffff", 
    "#ffd700", "#9400d3", "#ff00ff", "#00ffff",
    "#4b0082", "#ff8c00", "#7cfc00", "#ff1493"
  ];

  const container = document.querySelector('.matrix-background');
  let symbolsCount = 0;
  const maxSymbols = 150;

  function createSymbol() {
    if (symbolsCount >= maxSymbols) return;
    
    const symbol = document.createElement('div');
    symbol.className = 'matrix-symbol';
    
    // Рандомные параметры
    const baseSize = 16;
    const sizeMultiplier = 0.5 + Math.random() * 4.5;
    const size = Math.round(baseSize * sizeMultiplier);
    const opacity = 0.6 + Math.random() * 0.4;
    
    // Начальная позиция (со всех сторон)
    const side = Math.floor(Math.random() * 4);
    let startX, startY;
    const padding = 50;
    
    switch(side) {
      case 0: // сверху
        startX = Math.random() * window.innerWidth;
        startY = -padding;
        break;
      case 1: // справа
        startX = window.innerWidth + padding;
        startY = Math.random() * window.innerHeight;
        break;
      case 2: // снизу
        startX = Math.random() * window.innerWidth;
        startY = window.innerHeight + padding;
        break;
      case 3: // слева
        startX = -padding;
        startY = Math.random() * window.innerHeight;
        break;
    }
    
    // Конечная позиция
    const endX = startX + (Math.random() - 0.5) * 300;
    const endY = startY + (Math.random() * 400 + 100);
    
    // Вращение
    const startRotation = Math.random() * 360;
    const endRotation = startRotation + (Math.random() * 180 - 90);
    
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    symbol.style.setProperty('--symbol-size', `${size}px`);
    symbol.style.setProperty('--start-x', `${startX}px`);
    symbol.style.setProperty('--start-y', `${startY}px`);
    symbol.style.setProperty('--end-x', `${endX}px`);
    symbol.style.setProperty('--end-y', `${endY}px`);
    symbol.style.setProperty('--start-rotation', `${startRotation}deg`);
    symbol.style.setProperty('--end-rotation', `${endRotation}deg`);
    symbol.style.setProperty('--max-opacity', opacity);
    symbol.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(symbol);
    symbolsCount++;
    
    // Автоматическое удаление после анимации
    setTimeout(() => {
      createParticles(symbol);
      symbol.remove();
      symbolsCount--;
    }, 7000);
  }

  function createParticles(symbol) {
    const rect = symbol.getBoundingClientRect();
    const color = getComputedStyle(symbol).color;
    
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = 1 + Math.random() * 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${rect.left + rect.width/2}px`;
      particle.style.top = `${rect.top + rect.height/2}px`;
      particle.style.color = color;
      particle.style.setProperty('--p-dx', (Math.random() - 0.5) * 2);
      particle.style.setProperty('--p-dy', (Math.random() - 0.5) * 2);
      
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  // Запуск анимации
  for (let i = 0; i < 50; i++) createSymbol();
  const spawnInterval = setInterval(createSymbol, 100);
  
  // Оптимизация для ресайза
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      clearInterval(spawnInterval);
      document.querySelectorAll('.matrix-symbol, .particle').forEach(el => el.remove());
      symbolsCount = 0;
      for (let i = 0; i < 50; i++) createSymbol();
      setInterval(createSymbol, 100);
    }, 200);
  });
});
