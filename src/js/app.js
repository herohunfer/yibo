class NewsFeed {
    constructor() {
        this.newsFeed = document.getElementById('news-feed');
        this.pullToRefreshElement = document.getElementById('pull-to-refresh');
        this.isLoading = false;
        this.isDragging = false;
        this.startY = 0;
        this.currentY = 0;
        this.newsPool = this.getNewsPool(); // 存储新闻数据
        
        this.setupPullToRefresh();
        this.loadInitialNews();
    }

    setupPullToRefresh() {
        let touchStart = 0;
        let touchY = 0;
        
        // 移动端触摸事件
        document.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientY;
            this.pullToRefreshElement.style.transition = 'none';
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            touchY = e.touches[0].clientY;
            const pullDistance = touchY - touchStart;
            this.handlePull(pullDistance);
        }, { passive: false });

        document.addEventListener('touchend', () => {
            const pullDistance = touchY - touchStart;
            this.handlePullEnd(pullDistance);
        });

        // 网页端鼠标事件
        document.addEventListener('mousedown', (e) => {
            if (window.scrollY === 0) {
                this.isDragging = true;
                this.startY = e.clientY;
                this.pullToRefreshElement.style.transition = 'none';
                document.body.style.userSelect = 'none'; // 防止拖动时选中文本
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.currentY = e.clientY;
                const pullDistance = this.currentY - this.startY;
                this.handlePull(pullDistance);
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                const pullDistance = this.currentY - this.startY;
                this.handlePullEnd(pullDistance);
                this.isDragging = false;
                document.body.style.userSelect = ''; // 恢复文本选择
            }
        });

        // 鼠标离开页面时重置状态
        document.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.handlePullEnd(0);
                this.isDragging = false;
                document.body.style.userSelect = '';
            }
        });

        // 添加滚轮事件处理
        document.addEventListener('wheel', (e) => {
            if (window.scrollY === 0 && e.deltaY < 0) { // deltaY < 0 表示向上滚动
                const pullDistance = Math.abs(e.deltaY);
                this.handlePull(pullDistance);
                
                if (pullDistance > 50) {
                    this.handlePullEnd(pullDistance);
                }
            }
        }, { passive: true });
    }

    handlePull(pullDistance) {
        if (window.scrollY === 0 && pullDistance > 0) {
            this.pullToRefreshElement.style.display = 'block';
            this.pullToRefreshElement.style.transform = `translateY(${Math.min(pullDistance * 0.5, 150)}px)`;
            
            // 添加视觉反馈
            if (pullDistance > 50) {
                this.pullToRefreshElement.innerHTML = '<i class="fas fa-sync"></i> 释放刷新';
            } else {
                this.pullToRefreshElement.innerHTML = '<i class="fas fa-sync"></i> 下拉刷新';
            }
        }
    }

    handlePullEnd(pullDistance) {
        this.pullToRefreshElement.style.transition = 'transform 0.3s ease-out';
        this.pullToRefreshElement.style.transform = 'translateY(0)';
        
        if (window.scrollY === 0 && pullDistance > 50) {
            this.refreshNews();
            this.pullToRefreshElement.innerHTML = '<i class="fas fa-sync fa-spin"></i> 刷新中...';
        }
        
        setTimeout(() => {
            this.pullToRefreshElement.style.display = 'none';
        }, 300);
    }

    // 获取新闻数据池
    getNewsPool() {
        return [
            {
                title: '王一博最新动态',
                content: '今日参加某品牌活动现场，与粉丝互动...',
                image: 'https://wx1.sinaimg.cn/large/005ZZktely1hj8x2f4n66j31hc0u07wh.jpg',
                date: new Date().toLocaleDateString()
            },
            {
                title: '王一博出席活动',
                content: '身着黑色西装亮相，展现成熟魅力...',
                image: 'https://wx1.sinaimg.cn/large/005ZZktely1hj8x2f4n66j31hc0u07wh.jpg',
                date: new Date().toLocaleDateString()
            },
            // 添加更多新闻...
        ];
    }

    async loadInitialNews() {
        const initialNews = this.newsPool.slice(0, 3); // 初始加载3条新闻
        this.renderNews(initialNews);
    }

    async refreshNews() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.pullToRefreshElement.innerHTML = '<i class="fas fa-sync fa-spin"></i> 刷新中...';

        // 模拟加载新数据
        setTimeout(() => {
            const newNews = [{
                title: `王一博最新动态 ${new Date().toLocaleTimeString()}`,
                content: '刚刚更新：王一博参加新活动，与粉丝互动热情似火...',
                image: 'https://wx1.sinaimg.cn/large/005ZZktely1hj8x2f4n66j31hc0u07wh.jpg',
                date: new Date().toLocaleDateString()
            }];
            
            // 在顶部添加新内容
            this.newsFeed.innerHTML = '';
            this.renderNews([...newNews, ...this.newsPool.slice(0, 2)]);
            
            // 更新新闻池
            this.newsPool = [...newNews, ...this.newsPool];
            
            this.isLoading = false;
            this.pullToRefreshElement.innerHTML = '<i class="fas fa-sync"></i> 刷新成功';
        }, 1000);
    }

    renderNews(newsItems) {
        newsItems.forEach(news => {
            const newsElement = document.createElement('div');
            newsElement.className = 'news-item';
            newsElement.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.content}</p>
                ${news.image ? `<img src="${news.image}" alt="${news.title}">` : ''}
                <div class="date">${news.date}</div>
            `;
            this.newsFeed.appendChild(newsElement);
        });
    }

    // ... 其他现有方法保持不变 ...
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new NewsFeed();
}); 