const Like = require("../models/Like");

exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingLike = await Like.findOne({
      user: userId,
      post: postId
    });

    let liked = false;
    if (existingLike) {
      await existingLike.deleteOne();
    } else {
      await Like.create({
        user: userId,
        post: postId
      });
      liked = true;
    }

    // Get updated like count
    const likeCount = await Like.countDocuments({ post: postId });

    return res.json({ 
      liked, 
      likeCount 
    });

  } catch (error) {
    console.error("Error toggling like:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};