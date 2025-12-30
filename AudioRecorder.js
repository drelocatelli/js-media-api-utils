class AudioRecorder {
    constructor() {
        this.audioURL = null;
        this.base64Audio = null;
        this.isRecording = false;
        this.isStopped = false;
        this.recorder = null;
        this.stream = null;
        
        // Callback para atualizar a UI quando os dados chegarem
        this.onDataAvailable = null;
    }

    async startRecording() {
        try {
            if (!this.recorder) {
                this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.recorder = new MediaRecorder(this.stream);

                this.recorder.addEventListener('dataavailable', async (e) => {
                    this.audioURL = URL.createObjectURL(e.data);
                    this.base64Audio = await this._blobToBase64(e.data);
                    
                    if (this.onDataAvailable) {
                        this.onDataAvailable({
                            audioURL: this.audioURL,
                            base64Audio: this.base64Audio
                        });
                    }
                });
            }

            this.recorder.start();
            this.isRecording = true;
            this.isStopped = false;
        } catch (err) {
            console.error("Erro ao acessar microfone:", err);
        }
    }

    stopRecording() {
        if (this.recorder && this.isRecording) {
            this.recorder.stop();
            this.isRecording = false;
            
            // Para o stream para desligar o ícone de microfone do navegador
            this.stream.getTracks().forEach(track => track.stop());
            this.recorder = null; 

            setTimeout(() => {
                this.isStopped = true;
            }, 100);
        }
    }

    _blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
}