import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

const router = express.Router();

// Public route: Create book (no authentication needed)
router.post("/", async (req, res) => {
  try {
    const { title, caption, rating, image, email } = req.body;

    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "Please provide title, caption, rating, and image" });
    }

    // Find user by email or create default user
    let userId = null;
    if (email) {
      const user = await User.findOne({ email });
      userId = user ? user._id : null;
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: userId,
    });

    await newBook.save();

    res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  }
});

// pagination => infinite loading
// Public route: allow unauthenticated access so app can load the home feed
router.get("/", async (req, res) => {
  // example call from react native - frontend
  // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 }) // desc
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all books route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all books (public endpoint)
router.get("/user", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // delete image from cloudinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
