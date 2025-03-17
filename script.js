// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 预加载动画
    setTimeout(function () {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(function () {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);

    // 生成粒子效果
    function createParticles() {
        const particlesContainer = document.getElementById('particles-js');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';

            // 随机位置和大小
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;

            // 设置样式
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;

            // 随机颜色
            const colors = ['#9153F4', '#00E0FF', '#FF6B6B', '#FFD166'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = randomColor;

            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // 导航栏滚动效果
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            // 如果是移动端，点击导航链接后收起菜单
            if (window.innerWidth <= 768) {
                const navMenu = document.querySelector('nav ul');
                navMenu.style.display = 'none';
            }
        });
    });

    // 移动端菜单
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');

    mobileMenu.addEventListener('click', function () {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
        }
    });

    // 调整窗口大小时处理导航菜单
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navMenu.style.display = 'flex';
        } else {
            navMenu.style.display = 'none';
        }
    });

    // FAQ手风琴效果
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', function () {
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

            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // 复制服务器地址
    const copyButtons = document.querySelectorAll('#copy-address, #copy-port, #copy-address-2');

    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            let textToCopy;

            if (this.id === 'copy-address' || this.id === 'copy-address-2') {
                textToCopy = 'zbc.eo.mk';
            } else if (this.id === 'copy-port') {
                textToCopy = '19132';
            }

            navigator.clipboard.writeText(textToCopy).then(() => {
                // 修改图标和文本提示已复制
                const originalContent = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';

                setTimeout(() => {
                    this.innerHTML = originalContent;
                }, 2000);
            });
        });
    });

    // 使用Bedrock Status API查询服务器状态
    async function fetchServerStatus() {
        const statusDot = document.getElementById('server-status-dot');
        const statusText = document.getElementById('server-status');
        const playerCount = document.getElementById('player-count');
        const playerMax = document.getElementById('player-max');

        try {
            // API URL - 生产环境应使用您自己的API代理或CORS解决方案
            const apiUrl = 'https://api.mcstatus.io/v2/status/bedrock/zbc.eo.mk:15001';

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.online) {
                // 服务器在线
                statusDot.className = 'status-dot online';
                statusText.textContent = '在线';

                // 显示玩家数量
                if (data.players && data.players.online !== null) {
                    playerCount.textContent = data.players.online;
                } else {
                    playerCount.textContent = '?';
                }

                // 显示最大玩家数
                if (data.players && data.players.max !== null) {
                    playerMax.textContent = data.players.max;
                } else {
                    playerMax.textContent = '2024';
                }

                // 如果有MOTD，可以显示服务器描述
                if (data.motd && data.motd.clean) {
                    // 可以添加一个元素来显示MOTD
                    const motdElement = document.getElementById('server-motd');
                    if (motdElement) {
                        motdElement.textContent = data.motd.clean.replace('\\n', ' ');
                    }
                }

                // 如果有游戏版本信息
                if (data.version && data.version.name) {
                    const versionElement = document.getElementById('server-version');
                    if (versionElement) {
                        versionElement.textContent = data.version.name;
                    }
                }
            } else {
                // 服务器离线
                statusDot.className = 'status-dot offline';
                statusText.textContent = '维护中';
                playerCount.textContent = '0';
                playerMax.textContent = '2024';
            }
        } catch (error) {
            console.error('获取服务器状态时出错:', error);

            // 出错时显示未知状态
            statusDot.className = 'status-dot offline';
            statusText.textContent = '未知';
            playerCount.textContent = '?';
            playerMax.textContent = '2024';
        }
    }

    // 初始获取服务器状态
    fetchServerStatus();

    // 每30秒更新一次服务器状态
    setInterval(fetchServerStatus, 30000);

    // 统计数据动画
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const value = parseInt(finalValue.replace(/,/g, '').replace(/\+/g, ''));
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

    // 当元素进入视口时触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats-container')) {
                    animateStats();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
});