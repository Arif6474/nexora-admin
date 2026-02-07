/* eslint-disable no-undef */
import { useState } from 'react';
import UploadThumb from './upload.jpg';
import './ImageInput.css';

export function ImageInput({ fieldId, fieldName, state, setState, allowCreateImage, allowUpdateImage, children }) {
  // For image preview
  const [imagePreview, setImagePreview] = useState({ preview: '' });

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setState(file); // Update the state with the selected file
      setImagePreview({
        preview: URL.createObjectURL(file),
      });
    } else {
      setState(null);
      setImagePreview({ preview: '' });
    }
  };

  return (
    <>
      <label className="upload_file_wrapper" htmlFor={`fileInput${fieldId}`}>
        <span className="input_field_label">{children}</span>
        <div className="preview_image">
          {allowUpdateImage && state && (
            <img
              src={
                typeof state === 'string'
                  ? `${import.meta.env.VITE_REACT_APP_SPACES_URL}${state}` // If state is a URL (from backend)
                  : imagePreview.preview || UploadThumb // If state is a File object (new upload)
              }
              alt="thumbnail"
            
            />
          )}

          {allowCreateImage && (
            <img
              src={imagePreview.preview || UploadThumb}
              alt="default thumb"
              className="uploaded_image"
            />
          )}
        </div>
      </label>

      <input
        id={`fileInput${fieldId}`}
        type="file"
        accept="image/jpeg,image/png" // Restrict to JPEG and PNG
        className="file_upload_input"
        onChange={handleChange}
      />
    </>
  );
}