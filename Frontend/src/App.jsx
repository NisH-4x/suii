import React, { useEffect, useState, useRef } from "react";
import API from "./api/Api";
import PostForm from "./components/PostForm";
import PostCard from "./components/postCard";
import Container from "./components/Container";

function App() {
  const [posts, setPosts] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState({});
  const likeTimeoutRef = useRef({});

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error(
        "Error fetching posts:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(likeTimeoutRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Add new post
  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Toggle like with debouncing and optimistic UI
  const handleLike = async (postId) => {
    // Prevent rapid repeated clicks
    if (likeTimeoutRef.current[postId]) {
      return;
    }

    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    // Optimistic update (instant UI feedback)
    const optimisticIsLiked = !post.isLiked;
    const optimisticLikeCount = optimisticIsLiked
      ? post.likeCount + 1
      : post.likeCount - 1;

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p._id === postId
          ? {
              ...p,
              isLiked: optimisticIsLiked,
              likeCount: optimisticLikeCount,
            }
          : p
      )
    );

    setLoadingLikes((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await API.post(`/posts/${postId}/like`);

      // Update with server response
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: res.data.liked,
                likeCount: res.data.likeCount,
              }
            : p
        )
      );
    } catch (error) {
      console.error(
        "Error toggling like:",
        error.response?.status,
        error.response?.data || error.message
      );
      // Revert optimistic update on error
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: post.isLiked,
                likeCount: post.likeCount,
              }
            : p
        )
      );
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
      
      // Debounce: prevent another like click for 500ms
      likeTimeoutRef.current[postId] = setTimeout(() => {
        delete likeTimeoutRef.current[postId];
      }, 500);
    }
  };

  return (
    <Container>
      <h2 className="text-center font-bold text-3xl my-5 drop-shadow-md">
        Mini Social App
      </h2>
      <PostForm onAddPost={handleAddPost} />
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={handleLike}
          loading={loadingLikes[post._id] || false}
        />
      ))}
    </Container>
  );
}

export default App;
