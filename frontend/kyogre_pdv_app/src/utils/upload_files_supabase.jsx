import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const UploadImage = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

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
            // Corrected URL: Added /api prefix
            const response = await axios.post('https://docker-raichu.onrender.com/api/storage/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Imagem enviada com sucesso!'); // Use setMessage to update the message
            setImageUrl(response.data.url);
            onUploadSuccess(response.data.url); // Pass the URL to the parent component
            console.log(response.data);
        } catch (error) {
            alert('Erro ao enviar a imagem.'); // Use setMessage to update the message
            console.error(error);
        }
    };

    return (
        <div style={{ 
            //coloque margem
            margin: "10px 50px 20px 0"
         }}>
            <h2>Upload de Imagem</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <br></br>
            <br></br>
            
            <Button type="button" onClick={handleUpload} variant="contained" color="primary">Salvar Foto</Button>
            {message && <p>{message}</p>}
            {imageUrl && (
                <div>
                    <p>Imagem carregada:</p>
                    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100px' }} />
                </div>
            )}
        </div>
    );
};

export default UploadImage;
