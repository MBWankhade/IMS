import Post from "../models/post.js";
import sanitizeHtml from "sanitize-html";

export const createPost = async (req, res) => {
  try {
    const { content, company, role, placementType, title, postType } = req.body;

    // Step 1: Basic field + length validation
    if (!company || !role || !placementType || !content || content.length < 100) {
      return res.status(400).json({ message: "Please complete all required fields with meaningful content." });
    }

    // Step 2: Sanitize content
    const cleanContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "u"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height"],
      },
      allowedSchemes: ["data", "http", "https"],
      disallowedTagsMode: "discard",
    });

    // Step 3: Prepare Gemini validation prompt
    const validationPrompt = `
You are an assistant that reviews user-submitted interview experience posts for quality and usefulness.

Here are the provided post details:
- 🏢 Company: ${company}
- 🧑‍💼 Role: ${role}
- 🏷️ Placement Type: ${placementType}
- 📝 Title: ${title}

Interview Experience Content:
---
${cleanContent}
---

Check for the following:
1. Does the content clearly describe the company name, role, and placement type?
2. Is the interview experience detailed and structured (mentioning number of rounds, types of questions, duration, etc.)?
3. Does it include at least one specific question asked during the interview?
4. Are there actionable tips or reflections shared?
5. Is the content free from meaningless, spammy, or generic filler text?
6. Is the tone respectful and appropriate?

If the content is useful, reply:
✅ Content is useful and ready to publish.

Otherwise, reply in this format:
❌ Content needs improvement.
Issues:
- <List of issues found>

Suggestions:
- <Suggestions to improve each issue>

Also provide a score out of 10 based on usefulness, detail, and clarity in this format only:
Score: X.XX/10
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: validationPrompt }] }],
        }),
      }
    );

    const data = await response.json();
    const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!geminiText) {
      return res.status(500).json({ message: "Validation failed: No response from AI." });
    }

    // Step 4: Extract score
    const scoreMatch = geminiText.match(/Score:\s*(\d+(\.\d+)?)/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    if (geminiText.startsWith("❌") || !score || score < 8.0) {
      const issuesMatch = geminiText.match(/Issues:\n([\s\S]*?)\n\n/);
      const suggestionsMatch = geminiText.match(/Suggestions:\n([\s\S]*?)\n\n?/);

      const issues = issuesMatch ? issuesMatch[1].trim().split("\n").map(i => i.replace(/^[-•]\s*/, "")) : [];
      const suggestions = suggestionsMatch ? suggestionsMatch[1].trim().split("\n").map(s => s.replace(/^[-•]\s*/, "")) : [];

      return res.status(400).json({
        message: "Post did not meet minimum quality score.",
        aiFeedback: {
          score,
          issues,
          suggestions,
          raw: geminiText,
        },
      });
    }

    // Step 5: Save if passed
    const newPost = new Post({
      user: req.user._id,
      content: cleanContent,
      company,
      role,
      placementType,
      title,
      postType,
      aiScore: score, // optional field in Post schema
    });

    await newPost.save();
    return res.status(201).json({
      message: "Post created successfully.",
      aiScore: score,
      post: newPost,
    });

  } catch (error) {
    console.error("Error in createPost:", error);
    return res.status(500).json({ message: "Error creating post", error });
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
    let { query = "", page = 1, limit = 5 } = req.query;

    // Convert to numbers and sanitize
    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 5, 1);
    const skip = (page - 1) * limit;

    // If query is empty, return early with empty results
    if (!query.trim()) {
      return res.status(200).json({
        posts: [],
        totalPages: 0,
        currentPage: page,
        totalPosts: 0,
      });
    }

    // Text search filter
    const filters = { $text: { $search: query.trim() } };

    // Fetch matching posts with relevance score
    const posts = await Post.find(filters, { score: { $meta: "textScore" } })
      .populate("user", "name email profilePicture")
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total matching documents
    const totalPosts = await Post.countDocuments(filters);
    const totalPages = Math.max(Math.ceil(totalPosts / limit), 1);

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