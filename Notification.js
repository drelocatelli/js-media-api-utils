class NotificationHandler {
    constructor() {
        // Verifica se o navegador suporta notificações
        this.isSupported = 'Notification' in window;
    }

    async requestNotifications() {
        if (!this.isSupported) return 'denied';

        const permission = await Notification.requestPermission();
        return permission; // 'granted', 'denied', ou 'default'
    }

    async sendNotification(text, options = {}) {
        if (!this.isSupported) {
            console.error("Este navegador não suporta notificações.");
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(text, options);
        } else if (Notification.permission !== 'denied') {
            // Se ainda não foi solicitado ou está em default, solicita primeiro
            const permission = await this.requestNotifications();
            if (permission === 'granted') {
                new Notification(text, options);
            }
        } else {
            console.warn("Permissão de notificação negada pelo usuário.");
        }
    }
}