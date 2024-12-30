class NewsFeed {
    constructor() {
        this.newsFeed = document.getElementById('news-feed');
        this.lastScrollY = 0;
        this.isLoading = false;
        this.apiEndpoint = 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID'; // 示例使用JSONBin
        this.newsPool = this.getNewsPool(); // 存储所有新闻
        this.lastUpdateTime = null;
        this.setupPullToRefresh();
        this.loadInitialNews();
        this.repoOwner = 'your-username';
        this.repoName = 'your-repo';
        this.gistId = 'YOUR_GIST_ID';
    }

    async getNewsPool() {
        try {
            const response = await fetch(
                `https://api.github.com/gists/${this.gistId}`
            );
            const gist = await response.json();
            const content = gist.files['news.json'].content;
            return JSON.parse(content);
        } catch (error) {
            console.error('获取新闻失败:', error);
            return this.getFallbackNews();
        }
    }

    extractImageUrl(body) {
        // 从issue内容中提取图片URL的逻辑
        const match = body.match(/!\[.*?\]\((.*?)\)/);
        return match ? match[1] : null;
    }

    getTodayNews() {
        const today = new Date().toLocaleDateString();
        return this.newsPool.filter(news => news.date === today);
    }

    async loadInitialNews() {
        const news = [
            {
                title: '王一博 X FILA 2024春季大片',
                content: '穿搭运动装，尽显活力青春。展现运动与时尚的完美结合，诠释当代年轻人的生活态度。',
                image: 'https://wx1.sinaimg.cn/large/005ZZktely1hj8x2f4n66j31hc0u07wh.jpg',
                date: '2024-03-20'
            },
            {
                title: '《长相思》热播',
                content: '由王一博主演的仙侠剧《长相思》持续热播中，饰演的相柳获得观众好评。剧中古装造型英气逼人，演技获得突破。',
                image: 'https://wx1.sinaimg.cn/large/005ZZktely1hj8x2f4n66j31hc0u07wh.jpg',
                date: '2024-03-19'
            },
            {
                title: '王一博出席品牌活动',
                content: '身着黑色西装亮相活动现场，尽显成熟稳重。与粉丝互动环节妙语连珠，展现亲和力。',
                image: 'https://wx1.sinaimg.cn/large/005ZZktely1hj8x2f4n66j31hc0u07wh.jpg',
                date: '2024-03-18'
            }
        ];

        this.renderNews(news);
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

    setupPullToRefresh() {
        let touchStart = 0;
        let touchY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].pageY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            touchY = e.touches[0].pageY;
            const pullDistance = touchY - touchStart;
            
            if (window.scrollY === 0 && pullDistance > 0) {
                document.getElementById('pull-to-refresh').style.display = 'block';
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (window.scrollY === 0 && touchY - touchStart > 50) {
                this.refreshNews();
            }
            document.getElementById('pull-to-refresh').style.display = 'none';
        });
    }

    async refreshNews() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const currentTime = new Date();
        
        // 如果距离上次更新不到1分钟，显示提示
        if (this.lastUpdateTime && (currentTime - this.lastUpdateTime) < 60000) {
            alert('请稍后再试！每分钟只能刷新一次。');
            this.isLoading = false;
            return;
        }

        const todayNews = this.getTodayNews();
        
        if (todayNews.length > 0) {
            this.newsFeed.innerHTML = '';
            this.renderNews(todayNews);
            this.lastUpdateTime = currentTime;
        } else {
            this.newsFeed.innerHTML = `
                <div class="news-item">
                    <h3>暂无今日更新</h3>
                    <p>今天暂时还没有王一博的新动态，请稍后再来查看！</p>
                    <div class="date">${new Date().toLocaleDateString()}</div>
                </div>
            `;
        }
        
        this.isLoading = false;
    }
}

// 初始化新闻订阅
document.addEventListener('DOMContentLoaded', () => {
    new NewsFeed();
}); 