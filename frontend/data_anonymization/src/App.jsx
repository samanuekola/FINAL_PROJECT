import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Add this if you are using an external CSS file

function App() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [anonymizedFileUrl, setAnonymizedFileUrl] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://127.0.0.1:5000/upload', formData)
      .then(response => {
        setColumns(response.data.columns);
      })
      .catch(error => {
        console.error('There was an error uploading the file!', error);
      });
  };

  const handleColumnSelect = (event) => {
    const value = event.target.value;
    setSelectedColumns(
      selectedColumns.includes(value) ? 
      selectedColumns.filter(c => c !== value) : 
      [...selectedColumns, value]
    );
  };

  const handleAnonymize = () => {
    const formData = new FormData();
    formData.append('file', file);
    selectedColumns.forEach(col => formData.append('columns[]', col));

    axios.post('http://127.0.0.1:5000/anonymize', formData, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setAnonymizedFileUrl(url);
      })
      .catch(error => {
        console.error('There was an error anonymizing the file!', error);
      });
  };

  return (
    <div className="app-container" style={styles.appContainer}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Data Anonymization</h1>
        <div className="file-upload-container" style={styles.uploadContainer}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="file-input"
            style={styles.fileInput}
          />
          <button 
            onClick={handleUpload} 
            className="upload-btn" 
            style={styles.button}>
            Upload
          </button>
        </div>

        {columns.length > 0 && (
          <div className="columns-section" style={styles.columnsSection}>
            <h3>Select Columns to Anonymize</h3>
            <div className="columns-list" style={styles.columnsList}>
              {columns.map((col, index) => (
                <div key={index} className="column-checkbox" style={styles.columnCheckbox}>
                  <input 
                    type="checkbox" 
                    value={col} 
                    onChange={handleColumnSelect} 
                    checked={selectedColumns.includes(col)} 
                    style={styles.checkbox}
                  />
                  <label>{col}</label>
                </div>
              ))}
            </div>
            <button 
              onClick={handleAnonymize} 
              className="anonymize-btn" 
              style={styles.button}>
              Anonymize
            </button>
          </div>
        )}

        {anonymizedFileUrl && (
          <div className="download-section" style={styles.downloadSection}>
            <h3>Download Anonymized File</h3>
            <a 
              href={anonymizedFileUrl} 
              download="anonymized.csv"
              className="download-link"
              style={styles.downloadLink}>
              Download CSV
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  card: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '400px',
  },
  heading: {
    color: '#4CAF50',
    marginBottom: '20px',
  },
  uploadContainer: {
    marginBottom: '20px',
  },
  fileInput: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  columnsSection: {
    marginTop: '20px',
  },
  columnsList: {
    marginBottom: '20px',
  },
  columnCheckbox: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '10px',
  },
  downloadSection: {
    marginTop: '20px',
  },
  downloadLink: {
    color: '#FF5722',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default App;
