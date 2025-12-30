class GeoLocationHandler {
    constructor() {
        this.location = null;
        this.onLocationReceived = null; // Callback para a UI
    }

    requestLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.location = position;
                    
                    // Notifica a interface e passa os dados
                    if (this.onLocationReceived) {
                        this.onLocationReceived(position);
                    }
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                }
            );
        } else {
            console.error("Geolocalização não é suportada por este navegador.");
        }
    }
}