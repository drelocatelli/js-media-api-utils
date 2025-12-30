class FileUpload {
    constructor() {
        this.fileName = null;
        this.fileUrl = null;
        this.base64File = null;
        this.fileType = null;
        this.fileExtension = null;
        
        // Callback para atualizar a UI
        this.onFileLoaded = null;
    }

    async handleFileChange(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        
        // 1. Converter para Base64
        this.base64File = await this._blobToBase64(file);

        // 2. Processar metadados e gerar URL (usando FileReader para simular seu código original)
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        
        fr.onload = () => {
            const blob = new Blob([fr.result]);
            this.fileUrl = URL.createObjectURL(blob);

            // Lógica de extração de nome, extensão e tipo
            this.fileExtension = file.name.split('.').pop();
            this.fileName = file.name.replace(/\.([^.]*)$/gm, '');
            
            const filterType = file.type.split('/')[0];
            this.fileType = (filterType === 'application') ? file.type.split('/')[1] : filterType;

            // Notifica que os dados estão prontos
            if (this.onFileLoaded) {
                this.onFileLoaded({
                    fileName: this.fileName,
                    fileUrl: this.fileUrl,
                    base64File: this.base64File,
                    fileType: this.fileType,
                    fileExtension: this.fileExtension
                });
            }
        };
    }

    resetFile() {
        this.fileName = null;
        this.fileUrl = null;
        this.base64File = null;
        this.fileType = null;
        this.fileExtension = null;
    }

    _blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
}