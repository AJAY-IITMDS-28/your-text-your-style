import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [guidance, setGuidance] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setDownloadUrl('');
    const formData = new FormData();
    formData.append('text', text);
    formData.append('guidance', guidance);
    formData.append('api_key', apiKey);
    formData.append('template', file);
    try {
      const response = await axios.post('https://your-text-your-style.onrender.com/api/generate', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (err) {
      setError('Failed to generate presentation.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center">Your Text, Your Style</Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Auto-generate a PowerPoint presentation from your text and template
        </Typography>
      </Box>
      <TextField
        label="Paste your text or markdown"
        multiline
        rows={8}
        fullWidth
        margin="normal"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <TextField
        label="Guidance (optional)"
        fullWidth
        margin="normal"
        value={guidance}
        onChange={e => setGuidance(e.target.value)}
        placeholder="e.g. turn into an investor pitch deck"
      />
      <TextField
        label="LLM API Key"
        fullWidth
        margin="normal"
        type="password"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">🔑</InputAdornment>,
        }}
      />
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 2, mb: 2 }}
        fullWidth
      >
        Upload PowerPoint Template
        <input type="file" accept=".pptx,.potx" hidden onChange={handleFileChange} />
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || !text || !apiKey || !file}
      >
        {loading ? 'Generating...' : 'Generate Presentation'}
      </Button>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
      {downloadUrl && (
        <Box mt={2}>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            href={downloadUrl}
            download="generated_presentation.pptx"
          >
            Download Presentation
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
