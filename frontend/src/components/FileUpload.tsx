import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File as FileIcon, X } from 'lucide-react';

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

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
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
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-copper bg-copper/5 scale-[1.02]' : 'border-gray-300 hover:border-copper hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="bg-copper/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="h-8 w-8 text-copper" />
        </div>
        {isDragActive ? (
          <p className="text-copper font-semibold">Drop the PDF here...</p>
        ) : (
          <div>
            <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-400 mt-2">Only PDF files (max 5MB)</p>
          </div>
        )}
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-2 text-xs text-red-500">
          {fileRejections.map(({ file: rejectedFile, errors }) => (
            <div key={rejectedFile.name}>
              {errors.map(e => (
                <p key={e.code}>{e.code === 'file-invalid-type' ? 'Only PDF files are allowed.' : e.message}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <FileIcon className="h-5 w-5 text-copper mr-2" />
            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
          <button
            type="button"
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
          type="button"
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
