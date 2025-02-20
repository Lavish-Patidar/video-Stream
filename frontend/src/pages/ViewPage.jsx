import { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewPage.css';



const ViewPage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/videos/list');
                setVideos(response.data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleEditVideo = async () => {
        try {
            await axios.put(`http://localhost:3000/api/videos/${selectedVideo._id}`, {
                title: editTitle
            });
            const updatedVideos = videos.map(v =>
                v._id === selectedVideo._id ? { ...v, title: editTitle } : v
            );
            setVideos(updatedVideos);
            alert('Edited SuccessFully')
            setEditModalVisible(false);
        } catch (error) {
            console.error('Error updating video:', error);
        }
    };

    const handleDeleteVideo = async (id) => {
        try {
            axios.delete(`http://localhost:3000/api/videos/${id}`);
            const updatedVideos = videos.filter(v => v._id !== id);
            setVideos(updatedVideos);
            alert('Video deleted successfully!');
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Failed to delete video. Please try again.');
        }
    };


    return (
        <>
            <div className="view-container">
                <h1>View Videos</h1>
                {loading ? (
                    <p>Loading videos...</p>
                ) : videos.length > 0 ? (
                    <div className="video-grid">
                        {videos.map((video) => (
                            <div key={video._id} className="video-card">
                                <h3>{video.title}</h3>
                                <video controls>
                                    <source
                                        src={`http://localhost:3000/api/videos/stream/${video.filename}`}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>

                                <div className="video-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => {
                                            setSelectedVideo(video);
                                            setEditTitle(video.title);
                                            setEditModalVisible(true);
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteVideo(video._id)}
                                    >
                                        🗑️ Delete
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No videos available</p>
                )}
            </div>

            {editModalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Video</h2>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Video title"
                        />
                        <div className="modal-actions">
                            <button onClick={handleEditVideo}>Save</button>
                            <button onClick={() => setEditModalVisible(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default ViewPage;
