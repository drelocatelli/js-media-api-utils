class VideoRecorder {
    constructor() {
        this.videoURL = null;
        this.isRecording = false;
        this.isStopped = false;
        this.recorder = null;
        this.stream = null;
        
        // Callback para quando o vídeo final estiver pronto
        this.onVideoReady = null;
    }

    async startRecording() {
        try {
            // Solicita áudio e vídeo
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.recorder = new MediaRecorder(this.stream);

            this.recorder.addEventListener('dataavailable', (e) => {
                if (e.data.size > 0) {
                    this.videoURL = URL.createObjectURL(e.data);
                    if (this.onVideoReady) {
                        this.onVideoReady(this.videoURL);
                    }
                }
            });

            this.recorder.start();
            this.isRecording = true;
            this.isStopped = false;
        } catch (err) {
            console.error("Erro ao iniciar gravação de vídeo:", err);
        }
    }

    stopRecording() {
        if (this.recorder && this.isRecording) {
            this.recorder.stop();
            this.isRecording = false;
            this.isStopped = true;

            // Para todos os tracks (câmera e microfone)
            this.stream.getTracks().forEach(track => track.stop());
        }
    }

    // Exibe o que a câmera está vendo em um elemento <video>
    async showPreview(videoElement) {
        try {
            if (!this.stream || !this.stream.active) {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            }
            videoElement.muted = true; // Evita eco durante o preview
            videoElement.srcObject = this.stream;
            videoElement.play();
        } catch (err) {
            console.error("Erro ao mostrar preview:", err);
        }
    }
}