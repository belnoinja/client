'use client';
import * as React from 'react';
import { Upload, XCircle, Loader2 } from 'lucide-react';

const FileUploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadComplete, setUploadComplete] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadComplete(false);

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/upload/pdf`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload');
      setUploadComplete(true);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex flex-col gap-4 items-center p-6 rounded-lg border-white border-2 w-full max-w-xl mx-auto">
      {/* Hidden Input */}
      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {!selectedFile && (
        <div onClick={handleFileUploadButtonClick} className="flex flex-col items-center cursor-pointer">
          <h3 className="text-lg mb-2">Upload PDF File</h3>
          <Upload size={32} />
        </div>
      )}

      {previewUrl && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold">Preview</h3>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
              <XCircle size={24} />
            </button>
          </div>
          <embed src={previewUrl} type="application/pdf" width="100%" height="400px" className="rounded-md border" />
        </div>
      )}

      {selectedFile && !isUploading && !uploadComplete && (
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white mt-4"
        >
          Upload
        </button>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-blue-400">
          <Loader2 className="animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {uploadComplete && (
        <div className="text-green-400 font-semibold">Upload Complete!</div>
      )}
    </div>
  );
};

export default FileUploadComponent;
