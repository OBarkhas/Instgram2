"use client";

import { useState, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

interface BlobResponse {
  url: string;
}

export default function CreatePost() {
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Choose a photo!");
      return;
    }

    try {
      setLoading(true);

      const urls: string[] = await Promise.all(
        files.map(async (file: File) => {
          const uniqueName = `${uuidv4()}-${file.name}`;
          const blob: BlobResponse = await put(uniqueName, file, {
            access: "public",
            token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
          });
          return blob.url;
        }),
      );

      setUploadedUrls((prev) => [...prev, ...urls]);

      toast.success("Image(s) uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("Upload error!");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (uploadedUrls.length === 0) {
      toast.error("First upload a photo!");
      return;
    }

    try {
      const response = await fetch("/api/postPosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          images: uploadedUrls,
          ownerId: "1234",
        }),
      });

      const data: { error?: string } | { id: string } = await response.json();

      if (!response.ok) {
        throw new Error(
          "error" in data
            ? data.error
            : "Something went wrong while creating post",
        );
      }

      toast.success("Post created successfully!");
      setContent("");
      setUploadedUrls([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "error";
      toast.error(message);
      console.error(error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Create Post</h2>

      <textarea
        className="w-full p-2 border rounded mb-3"
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        className="w-full mb-3"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className="w-full bg-yellow-500 text-white p-2 rounded mb-3"
      >
        {loading ? "Uploading..." : "Upload Images"}
      </button>

      <button
        onClick={handleCreatePost}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Create Post
      </button>

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Uploaded Images:</h3>
          <div className="flex flex-wrap gap-2">
            {uploadedUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded ${index}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
