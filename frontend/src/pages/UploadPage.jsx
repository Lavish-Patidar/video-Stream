import { useState } from 'react';
import axios from 'axios';
import './UploadPage.css';

const UploadPage = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });


    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);

        try {
            const response = await axios.post('http://localhost:3000/api/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ type: 'success', text: 'Video uploaded successfully!' });
            setUploading(false);
            setTitle('');

        } catch (error) {
            setMessage({ type: 'error', text: 'Error uploading video' });

            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h1>Upload Video</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Video Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="video">Select Video</label>
                    <input
                        type="file"
                        className='file-input'
                        id="video"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit" className='upload-button' disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {message.text && (
                    <p className={`message ${message.type}`}>
                        {message.text}
                    </p>
                )}

            </form>
        </div>
    );
};

export default UploadPage;
