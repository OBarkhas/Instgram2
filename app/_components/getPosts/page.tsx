"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  images: string;
  createdAt: string;
};

export default function GetPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/getPosts");
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Loading</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Posts</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>{post.content}</p>
          {post.images && (
            <img
              src={post.images}
              alt="post"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
