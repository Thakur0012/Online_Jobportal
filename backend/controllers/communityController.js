import CommunityPost from "../models/CommunityPost.js";
import CommunityComment from "../models/CommunityComment.js";

// =============================================
// PUBLIC: Get all posts (Feed)
// =============================================
export const getAllPosts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }

        const posts = await CommunityPost.find(query)
            .populate('user', 'name role')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// AUTH: Create a post
// =============================================
export const createPost = async (req, res) => {
    try {
        const { content, category, isAnonymous } = req.body;
        const userId = req.user._id;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const newPost = new CommunityPost({
            user: userId,
            content,
            category: category || 'General',
            isAnonymous: !!isAnonymous
        });

        await newPost.save();
        
        // Populate user for standard response
        const populatedPost = await CommunityPost.findById(newPost._id).populate('user', 'name role');
        
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// AUTH: Like/Unlike a post
// =============================================
export const toggleLikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await CommunityPost.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.status(200).json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// PUBLIC: Get comments for a post
// =============================================
export const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await CommunityComment.find({ post: id })
            .populate('user', 'name role')
            .sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// AUTH: Add a comment
// =============================================
export const addComment = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const { content } = req.body;
        const userId = req.user._id;

        if (!content) return res.status(400).json({ message: "Comment content is required" });

        const comment = new CommunityComment({
            post: id,
            user: userId,
            content
        });

        await comment.save();

        // Increment comment count on post
        await CommunityPost.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });

        const populatedComment = await CommunityComment.findById(comment._id).populate('user', 'name role');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// AUTH: Delete post
// =============================================
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await CommunityPost.findById(id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check ownership or admin
        if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await post.deleteOne();
        await CommunityComment.deleteMany({ post: id });

        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
