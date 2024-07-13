import '@/App.css';

import axios from 'axios';
import React, { useState } from 'react';

function App() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
        setResult(null);
        setErrorMessage(null);
    };

    const handleAnalyze = async () => {
        if (!image) {
            alert('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setLoading(true);

        try {
            const response = await axios.post(
                'https://5001-idx-geminihackathon-1720848122962.cluster-bec2e4635ng44w7ed22sa22hes.cloudworkstations.dev/jocodinghackathon/us-central1/analyzeImage',
                formData,
                { withCredentials: true }
            );

            setResult(response.data);
        } catch (err) {
            console.error('Error:', err);
            setErrorMessage(`An error occurred while analyzing the image: ${  err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Image Analysis</h1>
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            <button type="button" onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
            {loading && <div id="loading">Analyzing...</div>}
            {result && (
                <div id="result">
                    <h3>Analysis Result:</h3>
                    <p>Score: {result.score}</p>
                    <p>Reason: {result.reason}</p>
                </div>
            )}
            {errorMessage && <div id="result">{errorMessage}</div>}
        </div>
    );
}

export default App;
