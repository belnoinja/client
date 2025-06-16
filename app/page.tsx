'use client';

import FileUploadComponent from './components/file-upload';
import ChatComponent from './components/chat';
import { UserButton, useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen w-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Global App Header */}
      <header className="w-full px-6 py-4 bg-white shadow-md border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">📄 DocChat AI</h1>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-gray-600">Hello, {user.firstName}</span>}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        {/* Sidebar - File Upload */}
        <div className="w-[30vw] min-h-full p-6 border-r bg-white shadow-inner flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center">Upload Your File</h2>
            <FileUploadComponent />
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-[70vw] min-h-full flex flex-col">
          <div className="p-6 border-b bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Chat Assistant</h2>
            <p className="text-sm text-gray-500">Ask questions based on your uploaded document.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <ChatComponent />
          </div>
        </div>
      </main>
    </div>
  );
}
