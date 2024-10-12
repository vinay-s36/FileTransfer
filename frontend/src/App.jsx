import { useState } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://filetransfer-111n.onrender.com'

function App() {
  const [files, setFiles] = useState([]);
  const [emails, setEmails] = useState('');
  const [password, setPassword] = useState('');
  const [option, setOption] = useState('mail');
  const [shortUrl, setShortUrl] = useState('');

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleEmailsChange = (event) => {
    setEmails(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleOptionChange = (event) => {
    setOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    if (option === 'mail') {
      const emailArray = emails.split(',').map(email => email.trim());
      formData.append('emails', JSON.stringify(emailArray));
      formData.append('password', password);
    }

    try {
      const endpoint = option === 'mail' ? '/upload' : '/upload-file';
      const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message || 'Operation successful');
      
      if (response.data.shortUrl) {
        setShortUrl(response.data.shortUrl);
      } else {
        setShortUrl('');
      }

      setFiles([]);
      setEmails('');
      setPassword('');
      event.target.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred. Please try again later.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Link copied to clipboard!');
    window.location.reload();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>V-TECH</h1>
      </header>
      <div className="upload-container"> {/* File upload container */}
        <h1 className="app-title">Upload Files</h1>
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="option-select">
            <label>
              <input
                type="radio"
                value="mail"
                checked={option === 'mail'}
                onChange={handleOptionChange}
              />
              Send via Mail
            </label>
            <label>
              <input
                type="radio"
                value="link"
                checked={option === 'link'}
                onChange={handleOptionChange}
              />
              Create Shareable Link
            </label>
          </div>
          <input
            type="file"
            className="input-file"
            onChange={handleFileChange}
            multiple
            required
          />
          {option === 'mail' && (
            <>
              <input
                type="text"
                className="input-email"
                placeholder="Enter email addresses, separated by commas"
                value={emails}
                onChange={handleEmailsChange}
                required
              />
              <input
                type="password"
                className="input-password"
                placeholder="File password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </>
          )}
          <button type="submit" className="submit-button">Upload Files</button>
        </form>
        {shortUrl && (
          <div className="short-url-container">
            <p>Shareable Link: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
            <button onClick={handleCopy} className="copy-button">Copy Link</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
