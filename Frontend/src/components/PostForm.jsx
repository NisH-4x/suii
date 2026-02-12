import React, { useState } from "react";
import API from "../api/Api";
import Container from "./Container";
import Card from "./Card";
import Button from "./Button";
import CharacterCounter from "./CharacterCounter";

function PostForm({ onAddPost }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const res = await API.post("/posts", { content });

      onAddPost({
        ...res.data,
        likeCount: 0,
        isLiked: false,
      });

      setContent("");
    } catch (error) {
      console.log("Create post failed:", error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create Post
          </h2>

          <textarea
            maxLength={280}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full min-h-[120px] p-4 border border-gray-300 rounded-xl text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            resize-none break-words whitespace-pre-wrap transition-all"
          />

          <div className="flex items-center justify-between mt-5">
            <CharacterCounter current={content.length} max={280} />
            <Button disabled={loading} variant="publish">
              {loading ? "Posting..." : "Publish"}
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default PostForm;
