import React from "react";
import Container from "./Container";
import Card from "./Card";
import Button from "./Button";

function PostCard({ post, onLike, loading }) {
  return (
    <Container>
      <Card>
        <p className="text-gray-800 text-[15px] leading-relaxed mb-6 break-words whitespace-pre-wrap">
          {post.content}
        </p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-5">
          <Button
            onClick={() => onLike(post._id)}
            disabled={loading}
            variant={post.isLiked ? "liked" : "like"}
          >
            {post.isLiked ? "Unlike" : "Like"}
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-red-500 text-base"></span>
            <span className="font-semibold text-gray-800">
              {post.likeCount}
            </span>
            <span className="text-gray-500">Likes</span>
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default PostCard;