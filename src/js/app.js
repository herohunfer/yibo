setupPullToRefresh() {
    let touchStart = 0;
    let touchY = 0;
    const pullToRefreshElement = document.getElementById('pull-to-refresh');
    
    // 添加触摸开始事件监听
    document.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].clientY;
        pullToRefreshElement.style.transition = 'none';
    }, { passive: true });

    // 修改触摸移动事件处理
    document.addEventListener('touchmove', (e) => {
        touchY = e.touches[0].clientY;
        const pullDistance = touchY - touchStart;
        
        if (window.scrollY === 0 && pullDistance > 0) {
            pullToRefreshElement.style.display = 'block';
            pullToRefreshElement.style.transform = `translateY(${Math.min(pullDistance, 150)}px)`;
            e.preventDefault();
        }
    }, { passive: false });

    // 修改触摸结束事件处理
    document.addEventListener('touchend', () => {
        const pullDistance = touchY - touchStart;
        pullToRefreshElement.style.transition = 'transform 0.3s ease-out';
        pullToRefreshElement.style.transform = 'translateY(0)';
        
        if (window.scrollY === 0 && pullDistance > 50) {
            this.refreshNews();
        }
        
        setTimeout(() => {
            pullToRefreshElement.style.display = 'none';
        }, 300);
    });
} 