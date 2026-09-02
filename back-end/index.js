import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Note from "./models/note.model.js";

const app = express();

app.use(cors());
app.use(express.json());

//create the note api
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

//get the note api
app.get("/api/notes", async (req, res) => {

    try {

        const notes = await Note.find().sort({ createdAt: 1 });

        res.status(200).json(notes);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

//update the note
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

//delete a note
// DELETE NOTE
app.delete("/api/notes/:id", async (req, res) => {

    try {

        const deletedNote =
            await Note.findByIdAndDelete(
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

//mongodb connection
const MONGO_URI = "mongodb+srv://sd6879777_db_user:1lYtEWCzAFYLq5jf@nodejslearningbackend.czwwj9g.mongodb.net/Notes-Database?appName=NodeJsLearningBackend";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        const dbName = mongoose.connection.name;
        console.log("Data-Base: " + dbName);
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });