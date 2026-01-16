import { useState, useRef } from 'react';
import SousChargement from '../SousChargement/SousChargement';
import './ImageUpload.css';

export async function uploadImageFile(file, token, apiBaseUrl = 'http://localhost:8000') {
  const validateImage = (file) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedMimes.includes(file.type)) {
      throw new Error('Format non autorisé (JPEG, PNG, GIF, WebP)');
    }
    if (file.size > maxSize) {
      throw new Error('Fichier trop volumineux (max 5MB)');
    }
    return true;
  };

  validateImage(file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('alt', file.name);

  const response = await fetch(`${apiBaseUrl}/api/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.status === 401) {
    localStorage.removeItem('jwt');
    throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const data = JSON.parse(errorText);
      throw new Error(data.error || data.message || `Erreur ${response.status}`);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(`Erreur ${response.status}: ${errorText.substring(0, 100)}`);
      }
      throw e;
    }
  }

  const data = await response.json();
  return data;
}

export default function ImageUpload({ onImageUploaded, maxFiles = 1, theme = '' }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const instanceId = useRef(`upload-${Date.now()}-${Math.random()}`);
  const fileCounterRef = useRef(0);

  const validateImage = (file) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedMimes.includes(file.type)) {
      throw new Error('Format non autorisé (JPEG, PNG, GIF, WebP)');
    }
    if (file.size > maxSize) {
      throw new Error('Fichier trop volumineux (max 5MB)');
    }
    return true;
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

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

  const processFiles = (selectedFiles) => {
    setError(null);
    const newFiles = [];
    const newPreviews = [];

    const filesToProcess = selectedFiles.slice(0, maxFiles - files.length);

    for (const file of filesToProcess) {
      try {
        validateImage(file);
        newFiles.push(file);

        fileCounterRef.current += 1;
        const fileId = `${instanceId.current}-${fileCounterRef.current}`;

        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            id: fileId,
            src: e.target.result,
            name: file.name,
            size: file.size,
          });
          if (newPreviews.length === newFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
            autoUploadFiles(newFiles);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err.message);
      }
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const autoUploadFiles = async (filesToUpload) => {
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const token = await getToken();
      const uploadedImages = [];

      for (const file of filesToUpload) {
        const data = await uploadImageFile(file, token, 'http://localhost:8000');
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

  const removeFile = (id) => {
    const index = previews.findIndex((p) => p.id === id);
    if (index > -1) {
      setPreviews((prev) => prev.filter((_, i) => i !== index));
      setFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

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
        const data = await uploadImageFile(file, token, 'http://localhost:8000');
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
    <div className={`upload-sections ${theme}_subbtle-background ${theme}_Border`}>
      <div className={`upload-box ${theme}_Border`}>
        {uploading && <SousChargement />}
        
        {error && <div className="error-message">{error}</div>}

        <div
          className={`upload-zone ${dragActive ? 'active' : ''} ${theme}_subbtle-background ${theme}_Border`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={`file-input-${instanceId.current}`}
            multiple={maxFiles > 1}
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          <label htmlFor={`file-input-${instanceId.current}`}>
            <div className="upload-prompt">
              <p className={`${theme}_subbtle-texte`}>📁 Glissez-déposez les images ici</p>
              <p>ou cliquez pour sélectionner</p>
              <small className={`${theme}_subbtle-texte`}>(max {maxFiles} fichier{maxFiles > 1 ? 's' : ''}, max 5MB)</small>
            </div>
          </label>
        </div>

        {uploading && (
          <div className="upload-status">
            <p>⏳ Upload en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
}