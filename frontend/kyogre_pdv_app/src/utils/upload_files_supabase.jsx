import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Por favor, selecione um arquivo de imagem.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/produtos/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Imagem enviada com sucesso!');
            console.log(response.data);
        } catch (error) {
            setMessage('Erro ao enviar a imagem.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Upload de Imagem</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Enviar</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadImage;