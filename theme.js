// Создаем класс для управления темой
class ThemeManager {
    constructor() {
        // Кэшируем DOM элементы
        this.elements = {
            themeToggle: document.getElementById('themeToggle'),
            html: document.documentElement,
            transition: document.querySelector('.theme-transition')
        };
        
        // Используем один обработчик событий
        this.init();
    }

    init() {
        // Инициализация темы
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        
        // Делегирование событий
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.elements.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.elements.html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Добавляем в конец файла
class ScrollToTop {
    constructor() {
        this.button = document.querySelector('.scroll-to-top');
        this.scrollThreshold = 400; // Показывать кнопку после прокрутки на 400px
        
        // Привязываем обработчики
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
        
        // Начальное состояние
        this.toggleVisibility();
    }
    
    toggleVisibility() {
        if (window.scrollY > this.scrollThreshold) {
            this.button.classList.add('visible');
            // Добавляем пульсацию при первом появлении
            if (!this.button.classList.contains('has-pulsed')) {
                this.button.classList.add('pulse');
                this.button.classList.add('has-pulsed');
                setTimeout(() => {
                    this.button.classList.remove('pulse');
                }, 2000);
            }
        } else {
            this.button.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Оптимизированная загрузка изображений
const lazyLoadImages = () => {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback с IntersectionObserver
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// Добавляем в конец файла
class MobileMenu {
    constructor() {
        this.burger = document.querySelector('.burger-menu');
        this.menu = document.querySelector('.menu');
        this.menuItems = document.querySelectorAll('.menu-item');
        
        this.burger.addEventListener('click', () => this.toggleMenu());
    }

    toggleMenu() {
        this.burger.classList.toggle('active');
        this.menu.classList.toggle('active');
        
        // Анимация пунктов меню
        this.menuItems.forEach((item, index) => {
            if (this.menu.classList.contains('active')) {
                setTimeout(() => {
                    item.style.animation = `menuItemFadeIn 0.3s ease forwards ${index * 0.1}s`;
                }, 0);
            } else {
                item.style.animation = '';
            }
        });
    }
}

// Добавляем класс для управления производительностью
class PerformanceManager {
    constructor() {
        this.checkDeviceCapabilities();
    }
    
    checkDeviceCapabilities() {
        // Проверяем производительность устройства
        const performanceAPI = window.performance;
        const memory = performanceAPI?.memory;
        const isLowEndDevice = memory && memory.jsHeapSizeLimit < 2048 * 1024 * 1024;
        
        // Адаптируем функционал для слабых устройств
        if (isLowEndDevice) {
            document.body.classList.add('reduce-animations');
            this.loadLightweightVersion();
        }
    }
    
    loadLightweightVersion() {
        // Отключаем тяжелые анимации
        document.querySelectorAll('.floating-shapes, .theme-transition').forEach(el => {
            el.style.display = 'none';
        });
        
        // Упрощаем градиенты
        document.body.classList.add('simple-gradients');
        
        // Отключаем эффекты при наведении
        document.body.classList.add('simple-hover');
    }
}

// Инициализируем менеджер темы после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем темную тему до создания ThemeManager
    document.documentElement.setAttribute('data-theme', 'dark');
    
    const themeManager = new ThemeManager();
    const scrollToTop = new ScrollToTop();
    const mobileMenu = new MobileMenu();
    const performanceManager = new PerformanceManager();

    // Анимация при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.header, .exam-instructions, .screenshots, .favorite-description, .favorite-window, .hide-instructions');
    animatedElements.forEach(el => observer.observe(el));

    lazyLoadImages();

    // Обновленная обработка двойного клика
    const codeBlock = document.querySelector('.code-block');
    const copyText = document.getElementById('copyText');

    if (codeBlock && copyText) {
        codeBlock.addEventListener('dblclick', async (e) => {
            e.preventDefault();
            const textToCopy = 'j' + copyText.textContent;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                // Визуальный эффект
                codeBlock.classList.add('copied');
                copyText.classList.add('text-copied');
                
                showNotification('Код скопирован!');
                
                setTimeout(() => {
                    codeBlock.classList.remove('copied');
                    copyText.classList.remove('text-copied');
                }, 1000);
            } catch (err) {
                // Fallback для старых браузеров
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showNotification('Код скопирован!');
                } catch (err) {
                    showNotification('Ошибка копирования');
                }
                document.body.removeChild(textarea);
            }
        });
    }

    // Функция для показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Удаляем уведомление через 2 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}); 