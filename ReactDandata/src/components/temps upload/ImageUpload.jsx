import { useState } from 'react';
import './ImageUpload.css';

export default function ImageUpload({ onImageUploaded, maxFiles = 1 }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Validate image file
  const validateImage = (file) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimes.includes(file.type)) {
      throw new Error('Format non autorisé (JPEG, PNG, GIF, WebP)');
    }
    if (file.size > maxSize) {
      throw new Error('Fichier trop volumineux (max 5MB)');
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  // Handle drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  // Process files for preview and validation
  const processFiles = (selectedFiles) => {
    setError(null);
    const newFiles = [];
    const newPreviews = [];

    const filesToProcess = selectedFiles.slice(0, maxFiles - files.length);

    for (const file of filesToProcess) {
      try {
        validateImage(file);
        newFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            id: Math.random(),
            src: e.target.result,
            name: file.name,
            size: file.size,
          });
          if (newPreviews.length === newFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err.message);
      }
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove a file from selection
  const removeFile = (id) => {
    const index = previews.findIndex((p) => p.id === id);
    if (index > -1) {
      setPreviews((prev) => prev.filter((_, i) => i !== index));
      setFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Auto-login if no token or if token is expired
  const getToken = async () => {
    let token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Veuillez vous connecter pour uploader des images');
    }
    return token;
  };

  const handleTokenExpired = () => {
    localStorage.removeItem('jwt');
    setError('Votre session a expiré. Veuillez vous reconnecter.');
    window.location.href = '/login';
  };

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Veuillez sélectionner au moins une image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = await getToken();
      const uploadedImages = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt', file.name);

        const response = await fetch('http://localhost:8000/api/images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        // If token expired (401), ask user to login again
        if (response.status === 401) {
          handleTokenExpired();
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          try {
            const data = JSON.parse(errorText);
            throw new Error(data.error || data.message || `Erreur ${response.status}`);
          } catch {
            throw new Error(`Erreur ${response.status}: ${errorText.substring(0, 100)}`);
          }
        }

        const data = await response.json();
        uploadedImages.push(data);
      }

      if (onImageUploaded) onImageUploaded(uploadedImages);

      setFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <h3>Ajouter des images</h3>
      {error && <div className="error-message">{error}</div>}

      {/* Drag & drop zone */}
      <div
        className={`upload-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          multiple={maxFiles > 1}
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input">
          <div className="upload-prompt">
            <p>📁 Glissez-déposez les images ici</p>
            <p>ou cliquez pour sélectionner</p>
            <small>(max {maxFiles} fichier{maxFiles > 1 ? 's' : ''}, max 5MB)</small>
          </div>
        </label>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="previews-grid">
          {previews.map((preview) => (
            <div key={preview.id} className="preview-item">
              <img src={preview.src} alt={preview.name} />
              <div className="preview-info">
                <p className="file-name">{preview.name}</p>
                <p className="file-size">({(preview.size / 1024).toFixed(2)} KB)</p>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFile(preview.id)}
                disabled={uploading}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? '⏳ Upload en cours...' : `📤 Uploader ${files.length} image${files.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  );
}
