import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import Note from "./models/note.model.js";

const app = express();


// --------------------------------------------------
// Path configuration
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());
app.use(express.json());


// Serve frontend files
app.use(express.static(path.join(__dirname, "../front-end")));


// --------------------------------------------------
// Home page
// --------------------------------------------------

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../front-end/home-page.html")
    );
});


// --------------------------------------------------
// CREATE NOTE
// --------------------------------------------------

app.post("/api/notes", async (req, res) => {

    try {

        const note = await Note.create({
            title: req.body.title,
            content: req.body.content
        });

        res.status(201).json(note);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// --------------------------------------------------
// GET NOTES
// --------------------------------------------------

app.get("/api/notes", async (req, res) => {

    try {

        const notes = await Note.find().sort({
            createdAt: 1
        });

        res.status(200).json(notes);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// --------------------------------------------------
// UPDATE NOTE
// --------------------------------------------------

app.put("/api/notes/:id", async (req, res) => {

    try {

        const updateNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                new: true
            }
        );

        if (!updateNote) {

            return res.status(404).json({
                message: "Note not found"
            });

        }

        res.status(200).json(updateNote);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// --------------------------------------------------
// DELETE NOTE
// --------------------------------------------------

app.delete("/api/notes/:id", async (req, res) => {

    try {

        const deletedNote = await Note.findByIdAndDelete(
            req.params.id
        );

        if (!deletedNote) {

            return res.status(404).json({
                message: "Note not found"
            });

        }

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// --------------------------------------------------
// MONGODB CONNECTION
// --------------------------------------------------

const MONGO_URI = "mongodb+srv://sourav2005:Sou05d@nodejslearningbackend.czwwj9g.mongodb.net/Notes-Database?appName=NodeJsLearningBackend";

mongoose
    .connect(MONGO_URI)
    .then(() => {

        console.log("Connected to MongoDB");

        const dbName = mongoose.connection.name;

        console.log("Data-Base: " + dbName);


        // Use Render/Vercel provided port
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, "0.0.0.0", () => {

            console.log(
                `Server running on port ${PORT}`
            );

        });

    })
    .catch((error) => {

        console.log(
            "MongoDB connection failed:",
            error
        );

    });