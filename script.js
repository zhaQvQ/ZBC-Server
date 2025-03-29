// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // ==================== 预加载动画 ====================
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }, 1000);

    // ==================== 粒子效果 ====================
    function createParticles() {
        const particlesContainer = document.getElementById('particles-js');
        const particleCount = 50;
        const colors = ['#9153F4', '#00E0FF', '#FF6B6B', '#FFD166'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';

            // 随机属性
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            // 设置样式
            Object.assign(particle.style, {
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                backgroundColor: randomColor
            });

            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ==================== 导航栏滚动效果 ====================
    const header = document.querySelector('header');
    function handleScroll() {
        header.classList.toggle('scrolled', window.scrollY > 100);
    }
    window.addEventListener('scroll', handleScroll);

    // ==================== 返回顶部按钮 ====================
    const backToTop = document.querySelector('.back-to-top');
    function handleBackToTop() {
        backToTop.classList.toggle('active', window.scrollY > 500);
    }
    window.addEventListener('scroll', handleBackToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== 平滑滚动 ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }

            // 移动端点击后收起菜单
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        });
    });

    // ==================== 移动端菜单 ====================
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');

    mobileMenu.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    // ==================== 响应式导航 ====================
    function handleResize() {
        navMenu.style.display = window.innerWidth > 992 ? 'flex' : 'none';
    }
    window.addEventListener('resize', handleResize);

    // ==================== FAQ手风琴效果 ====================
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // 关闭其他项
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // 切换当前项
            item.classList.toggle('active');
            const content = item.querySelector('.accordion-content');
            content.style.maxHeight = item.classList.contains('active')
                ? content.scrollHeight + 'px'
                : null;
        });
    });

    // ==================== 复制服务器地址 ====================
    const copyButtons = document.querySelectorAll('#copy-address, #copy-port, #copy-address-2');
    copyButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const textToCopy = this.id === 'copy-port' ? '15001' : 'zbc.eo.mk';

            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalContent = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => this.innerHTML = originalContent, 2000);
            } catch (error) {
                console.error('复制失败:', error);
            }
        });
    });

    // ==================== 服务器状态查询 ====================
    async function fetchServerStatus() {
        const statusDot = document.getElementById('server-status-dot');
        const statusText = document.getElementById('server-status');
        const playerCount = document.getElementById('player-count');
        const playerMax = document.getElementById('player-max');

        try {
            const response = await fetch('https://api.mcstatus.io/v2/status/bedrock/zbc.eo.mk:15001');
            const data = await response.json();

            if (data.online) {
                // 服务器在线
                statusDot.className = 'status-dot online';
                statusText.textContent = '在线';
                playerCount.textContent = data.players?.online ?? '?';
                playerMax.textContent = data.players?.max ?? '2024';

                // 可选：显示MOTD和版本信息
                updateServerInfo(data.motd?.clean, 'server-motd');
                updateServerInfo(data.version?.name, 'server-version');
            } else {
                // 服务器离线
                setServerOffline();
            }
        } catch (error) {
            console.error('获取服务器状态时出错:', error);
            setServerOffline();
        }
    }

    function setServerOffline() {
        document.getElementById('server-status-dot').className = 'status-dot offline';
        document.getElementById('server-status').textContent = '维护中';
        document.getElementById('player-count').textContent = '0';
        document.getElementById('player-max').textContent = '2024';
    }

    function updateServerInfo(info, elementId) {
        const element = document.getElementById(elementId);
        if (element && info) {
            element.textContent = info.replace('\\n', ' ');
        }
    }

    // 初始获取服务器状态并设置定时器
    fetchServerStatus();
    setInterval(fetchServerStatus, 30000);

    // ==================== 统计数据动画 ====================
    function animateStats() {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const finalValue = stat.textContent;
            const value = parseInt(finalValue.replace(/\D/g, ''));
            const suffix = finalValue.includes('+') ? '+' : '';
            let startValue = 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime < duration) {
                    const progress = elapsedTime / duration;
                    const currentValue = Math.floor(value * progress);
                    stat.textContent = currentValue.toLocaleString() + suffix;
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = finalValue;
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    // ==================== 滚动动画触发器 ====================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('stats-container')) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) observer.observe(statsContainer);
});