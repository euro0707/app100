// Portfolio website functionality
class Portfolio {
    constructor() {
        this.apps = [];
        this.startDate = new Date('2025-07-27');
        this.init();
    }

    init() {
        this.loadApps();
        this.renderApps();
        this.renderTimeline();
        this.updateStats();
        this.setupEventListeners();
        this.animateProgressRing();
    }

    loadApps() {
        // Current apps data
        this.apps = [
            {
                id: '001',
                title: '数のお勉強アプリ',
                description: '子ども向けの数の概念を学ぶ教育アプリ。親が設定した数だけアイテムを表示し、カウンティングゲームで学習できます。',
                category: 'education',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'データ保存'],
                liveUrl: 'https://euro0707.github.io/app100/apps/001-number-learning/',
                githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/001-number-learning',
                completedDate: '2025-07-27',
                features: ['数の表示', 'カウンティングゲーム', '学習記録', '進捗統計'],
                image: null,
                status: 'completed'
            },
            {
                id: '002',
                title: '動物と食べ物マッチングゲーム',
                description: '4〜6歳の子ども向けの教育的マッチングゲーム。動物とその食べ物を正しくペアにすることで学習します。',
                category: 'game',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'レスポンシブ'],
                liveUrl: 'https://euro0707.github.io/app100/apps/002-animal-food-matching/',
                githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/002-animal-food-matching',
                completedDate: '2025-07-27',
                features: ['動的ヒントシステム', '段階的進行', '学習統計', 'レスポンシブデザイン'],
                image: null,
                status: 'completed'
            },
            {
                id: '003',
                title: '色と形の記憶ゲーム',
                description: '4〜6歳の子ども向けの記憶力向上ゲーム。色々な形が順番に表示され、覚えた順番でタップして遊びます。',
                category: 'education',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'アニメーション'],
                liveUrl: 'https://euro0707.github.io/app100/apps/003-memory-game/',
                githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/003-memory-game',
                completedDate: '2025-07-27',
                features: ['段階的難易度', '親向けヒント', '視覚的フィードバック', '記憶力トレーニング'],
                image: null,
                status: 'completed'
            },
            {
                id: '004',
                title: '乗り物パズル',
                description: '4〜6歳の子ども向けドラッグ&ドロップパズルゲーム。車、電車、飛行機の3段階難易度で空間認識力を育みます。',
                category: 'game',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'ドラッグ操作'],
                liveUrl: 'https://euro0707.github.io/app100/apps/004-vehicle-puzzle/',
                githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/004-vehicle-puzzle',
                completedDate: '2025-07-29',
                features: ['3段階難易度', 'ドラッグ&ドロップ操作', 'プレースホルダー表示', '正解フィードバック'],
                image: null,
                status: 'completed'
            },
            {
                id: '005',
                title: 'これなーんだ？おえかきクイズ',
                description: '4〜6歳の子ども向けの知育アプリ。ヒントをもとに自由にお絵描きして、AIが答えを当ててくれるインタラクティブなクイズゲーム。',
                category: 'education',
                technologies: ['Canvas', 'CSS3', 'JavaScript', 'タッチ操作'],
                liveUrl: 'https://euro0707.github.io/app100/apps/005-orekuna-quiz/',
                githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/005-orekuna-quiz',
                completedDate: '2025-08-08',
                features: ['Canvas描画機能', 'AI風判定演出', '褒めるフィードバック', 'モバイル対応'],
                image: null,
                status: 'completed'
            },
            {
                id: '006',
                title: 'さんすうアドベンチャー',
                description: '小学校低学年向けRPG風計算ゲーム。足し算・引き算・かけ算の問題を解いて敵を倒し、レベルアップして強くなろう！',
                category: 'education',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'RPGシステム'],
                liveUrl: 'https://euro0707.github.io/app100/apps/006-math-adventure/',
                githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/006-math-adventure',
                completedDate: '2025-08-09',
                features: ['RPG風バトル', '段階的問題難易度', 'プレイヤー進行システム', 'セーブ機能'],
                image: null,
                status: 'completed'
            }
            // 他のアプリは順次追加
        ];

        // 残り94個のプレースホルダー
        for (let i = 7; i <= 100; i++) {
            this.apps.push({
                id: String(i).padStart(3, '0'),
                title: `アプリ #${i}`,
                description: '近日公開予定...',
                category: 'upcoming',
                technologies: [],
                liveUrl: null,
                githubUrl: null,
                completedDate: null,
                features: [],
                image: null,
                status: 'upcoming'
            });
        }
    }

    renderApps(filter = 'all', searchTerm = '') {
        const grid = document.getElementById('appsGrid');
        if (!grid) return;

        const filteredApps = this.apps.filter(app => {
            const matchesFilter = filter === 'all' || app.category === filter || (filter === 'completed' && app.status === 'completed');
            const matchesSearch = searchTerm === '' || 
                app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        grid.innerHTML = filteredApps.map(app => this.createAppCard(app)).join('');
    }

    createAppCard(app) {
        if (app.status === 'upcoming') {
            return `
                <div class="app-card upcoming" data-category="${app.category}">
                    <div class="app-header">
                        <div class="app-number">${app.id}</div>
                        <div class="app-title">
                            <h4>${app.title}</h4>
                            <span class="app-category upcoming">準備中</span>
                        </div>
                    </div>
                    <div class="app-description">
                        ${app.description}
                    </div>
                    <div class="app-tech">
                        <span class="tech-tag">Coming Soon</span>
                    </div>
                    <div class="app-actions">
                        <button class="btn btn-secondary" disabled>
                            開発中...
                        </button>
                    </div>
                </div>
            `;
        }

        const categoryLabels = {
            education: '教育',
            game: 'ゲーム',
            utility: 'ユーティリティ',
            creative: 'クリエイティブ'
        };

        return `
            <div class="app-card" data-category="${app.category}">
                <div class="app-header">
                    <div class="app-number">${app.id}</div>
                    <div class="app-title">
                        <h4>${app.title}</h4>
                        <span class="app-category ${app.category}">${categoryLabels[app.category] || app.category}</span>
                    </div>
                </div>
                <div class="app-description">
                    ${app.description}
                </div>
                <div class="app-tech">
                    ${app.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="app-actions">
                    ${app.liveUrl ? `<a href="${app.liveUrl}" class="btn btn-primary" target="_blank">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15,3 21,3 21,9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        試してみる
                    </a>` : ''}
                    ${app.githubUrl ? `<a href="${app.githubUrl}" class="btn btn-secondary" target="_blank">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        コード
                    </a>` : ''}
                </div>
            </div>
        `;
    }

    renderTimeline() {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        const completedApps = this.apps.filter(app => app.status === 'completed');
        
        const timelineItems = completedApps.map(app => `
            <div class="timeline-item">
                <div class="timeline-marker">${app.id}</div>
                <div class="timeline-content">
                    <div class="timeline-date">${this.formatDate(app.completedDate)}</div>
                    <div class="timeline-title">${app.title}</div>
                    <div class="timeline-description">${app.description}</div>
                </div>
            </div>
        `).join('');

        timeline.innerHTML = timelineItems;
    }

    updateStats() {
        const completedApps = this.apps.filter(app => app.status === 'completed').length;
        const progressPercent = Math.round((completedApps / 100) * 100);
        const daysSince = Math.floor((new Date() - this.startDate) / (1000 * 60 * 60 * 24)) + 1;

        // Update hero stats
        const elements = {
            completedApps: document.getElementById('completedApps'),
            progressPercent: document.getElementById('progressPercent'),
            daysSince: document.getElementById('daysSince'),
            lastUpdate: document.getElementById('lastUpdate')
        };

        if (elements.completedApps) elements.completedApps.textContent = completedApps;
        if (elements.progressPercent) elements.progressPercent.textContent = `${progressPercent}%`;
        if (elements.daysSince) elements.daysSince.textContent = daysSince;
        if (elements.lastUpdate) elements.lastUpdate.textContent = this.formatDate(new Date().toISOString());

        // Update progress ring
        this.updateProgressRing(progressPercent);
    }

    updateProgressRing(percent) {
        const progressBar = document.querySelector('.progress-bar');
        const progressNumber = document.querySelector('.progress-number');
        
        if (progressBar && progressNumber) {
            const circumference = 2 * Math.PI * 90; // r=90
            const offset = circumference - (percent / 100) * circumference;
            
            progressBar.style.strokeDashoffset = offset;
            progressNumber.textContent = Math.round((percent / 100) * 100);
        }
    }

    animateProgressRing() {
        // アニメーション効果を追加
        setTimeout(() => {
            this.updateStats();
        }, 500);
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                const searchTerm = document.getElementById('searchInput')?.value || '';
                this.renderApps(filter, searchTerm);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
                this.renderApps(activeFilter, e.target.value);
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.querySelectorAll('.app-card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Method to add new app (for future use)
    addApp(appData) {
        this.apps.unshift(appData);
        this.renderApps();
        this.renderTimeline();
        this.updateStats();
    }

    // Method to update app status
    updateAppStatus(appId, status, data = {}) {
        const app = this.apps.find(a => a.id === appId);
        if (app) {
            app.status = status;
            Object.assign(app, data);
            this.renderApps();
            this.renderTimeline();
            this.updateStats();
        }
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
    
    // Make portfolio instance available globally for debugging
    window.portfolio = portfolio;
    
    // Auto-refresh stats every minute
    setInterval(() => {
        portfolio.updateStats();
    }, 60000);
});

// Service Worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}