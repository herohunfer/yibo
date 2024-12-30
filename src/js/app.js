class NewsFeed {
    constructor() {
        this.newsFeed = document.getElementById('news-feed');
        this.pullToRefreshElement = document.getElementById('pull-to-refresh');
        this.isLoading = false;
        this.isDragging = false;
        this.startY = 0;
        this.currentY = 0;
        
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

    // ... 其他现有方法保持不变 ...
} 