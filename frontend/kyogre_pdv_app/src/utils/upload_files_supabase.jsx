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
            console.log("Enviando arquivo para o Supabase via API...");
            const response = await axios.post('https://raichu-server.up.railway.app/api/storage/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Atualiza o estado com a URL da imagem retornada pela API
            setImageUrl(response.data.url);
            onUploadSuccess(response.data.url); // Passa a URL para o componente pai
            console.log("Resposta da API:", response.data);
        } catch (error) {
            setMessage('Erro ao enviar a imagem.'); // Atualiza a mensagem de erro
            console.error("Erro ao enviar a imagem:", error);
        }
    };

    return (
        <div style={{ margin: "10px 50px 20px 0" }}>
            <h2>Upload de Imagem</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <br />
            <br />
            <Button type="button" onClick={handleUpload} variant="contained" color="primary">
                Salvar Foto
            </Button>
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