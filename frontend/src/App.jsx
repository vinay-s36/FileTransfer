import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [emails, setEmails] = useState('');

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleEmailsChange = (event) => {
    setEmails(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // Convert emails string to an array
    const emailArray = emails.split(',').map(email => email.trim());
    formData.append('emails', JSON.stringify(emailArray));

    try {
      const response = await axios.post('https://filetransfer-111n.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message);
      setFiles([]);
      setEmails('');
      event.target.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred. Please try again later.');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Upload Files</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="file"
          className="input-file"
          onChange={handleFileChange}
          multiple
          required
        />
        <input
          type="text"
          className="input-email"
          placeholder="Enter email addresses, separated by commas"
          value={emails}
          onChange={handleEmailsChange}
          required
        />
        <button type="submit" className="submit-button">Upload Files</button>
      </form>
    </div>
  );
}

export default App;
