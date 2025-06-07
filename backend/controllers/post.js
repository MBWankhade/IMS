import Post from "../models/post.js";

export const createPost = async (req, res) => { 
  try {
    const newPost = new Post({
      user: req.user._id,
      ...req.body, // Directly use postData from frontend
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};


export const getAllPosts=async (req, res) => {
    try {
      const posts = await Post.find().populate("user", "name email profilePicture").sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error getting posts", error });
    }
} 


export const searchPosts = async (req, res) => {
  try {
    let { company, role, placementType, page = 1, limit = 5 } = req.query;

    // Convert page and limit to numbers
    page = Math.max(parseInt(page) || 1, 1); // Ensure page is at least 1
    limit = Math.max(parseInt(limit) || 5, 1); // Ensure limit is at least 1

    // Build the filter object only if values are provided
    const filters = {};
    if (company && company.trim()) filters.company = new RegExp(company.trim(), "i");
    if (role && role.trim()) filters.role = new RegExp(role.trim(), "i");
    
    // ✅ Fix for Placement Type (Use exact match)
    if (placementType && placementType.trim()) {
      filters.placementType = placementType.trim(); // Direct match instead of regex
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Fetch paginated posts
    const posts = await Post.find(filters)
      .populate("user", "name email profilePicture") // Populate user details
      .sort({ createdAt: -1 }) // Sort latest first
      .skip(skip)
      .limit(limit);

    // Count total matching posts
    const totalPosts = await Post.countDocuments(filters);
    const totalPages = Math.max(Math.ceil(totalPosts / limit), 1); // Ensure at least 1 page exists

    res.status(200).json({
      posts,
      totalPages,
      currentPage: page,
      totalPosts,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Error searching posts", error });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err });
  } 
}