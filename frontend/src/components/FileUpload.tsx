import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/lawyers/upload-certificate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        onUploadSuccess(data.certificateUrl);
        setFile(null);
      } else {
        onUploadError(data.message || 'Upload failed');
      }
    } catch (error) {
      onUploadError('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-copper bg-copper/5' : 'border-gray-300 hover:border-copper'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-copper font-medium">Drop the file here...</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag & drop your certificate here</p>
            <p className="text-sm text-gray-400 mt-1">PDF, PNG, or JPG (max 5MB)</p>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-5 w-5 text-copper mr-2" />
            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {file && !uploading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUpload();
          }}
          className="w-full mt-4 py-2 bg-copper text-white rounded-lg font-medium hover:bg-copper-dark transition-colors"
        >
          Confirm Upload
        </button>
      )}

      {uploading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Uploading...
        </div>
      )}
    </div>
  );
};

export default FileUpload;
