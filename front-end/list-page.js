const notesContainer = document.getElementById("notes-container");

const individualNote = document.getElementById("individual-note");

const individualTitle = document.getElementById("individual-title");

const individualContent = document.getElementById("individual-content");

const closeNote = document.getElementById("close-note");

const editNote = document.getElementById("edit-note");

const saveNote = document.getElementById("save-note");

const deleteNote = document.getElementById("delete-note");

let selectedNoteId = null;

let selectedNote = null;


/* =========================
   GET ALL NOTES
========================= */

async function getNotes() {

    try {

        const response = await fetch(
            "https://noteculture.onrender.com/api/notes"
        );

        const notes = await response.json();

        console.log(notes);


        if (!response.ok) {

            console.log("Failed to retrieve notes");

            return;

        }


        // Clear existing notes

        notesContainer.innerHTML = "";


        // Display every note

        notes.forEach((note) => {

            const noteCard =
                document.createElement("div");


            noteCard.classList.add("note-card");


            // Store MongoDB ID

            noteCard.dataset.id = note._id;


            // Display note

            noteCard.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
            `;


            /* =========================
               OPEN INDIVIDUAL NOTE
            ========================= */

            noteCard.addEventListener("click", () => {

                // Store selected note

                selectedNoteId = note._id;

                selectedNote = note;


                // Put note data into input fields

                individualTitle.value =
                    note.title;

                individualContent.value =
                    note.content;


                // Make fields read-only

                individualTitle.readOnly = true;

                individualContent.readOnly = true;


                // Show individual note

                individualNote.style.display =
                    "block";

            });


            // Add card to page

            notesContainer.appendChild(noteCard);

        });


    } catch (error) {

        console.error(
            "Error retrieving notes:",
            error
        );

    }

}


/* =========================
   EDIT NOTE
========================= */

editNote.addEventListener("click", () => {

    // Enable editing

    individualTitle.readOnly = false;

    individualContent.readOnly = false;


    // Put cursor in title

    individualTitle.focus();

});


/* =========================
   SAVE UPDATED NOTE
========================= */

saveNote.addEventListener("click", async () => {

    // Get updated values

    const updatedTitle =
        individualTitle.value.trim();

    const updatedContent =
        individualContent.value.trim();


    // Don't allow empty values

    if (
        updatedTitle === "" ||
        updatedContent === ""
    ) {

        return;

    }


    try {

        // Send PUT request

        const response = await fetch(
            `https://noteculture.onrender.com/api/notes/${selectedNoteId}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    title: updatedTitle,

                    content: updatedContent

                })

            }
        );


        if (response.ok) {


            /* =========================
               UPDATE JAVASCRIPT OBJECT
            ========================= */

            selectedNote.title =
                updatedTitle;

            selectedNote.content =
                updatedContent;


            /* =========================
               UPDATE INDIVIDUAL NOTE
            ========================= */

            individualTitle.value =
                updatedTitle;

            individualContent.value =
                updatedContent;


            /* =========================
               MAKE READ-ONLY AGAIN
            ========================= */

            individualTitle.readOnly = true;

            individualContent.readOnly = true;


            /* =========================
               UPDATE NOTE CARD
            ========================= */

            const noteCard =
                document.querySelector(
                    `.note-card[data-id="${selectedNoteId}"]`
                );


            if (noteCard) {

                noteCard.querySelector("h2").textContent =
                    updatedTitle;

                noteCard.querySelector("p").textContent =
                    updatedContent;

            }


        } else {

            console.error(
                "Failed to update note."
            );

        }


    } catch (error) {

        console.error(
            "Update error:",
            error
        );

    }

});

/* =========================
   DELETE NOTE
========================= */

deleteNote.addEventListener("click", async () => {

    if (!selectedNoteId) {

        return;

    }


    try {

        const response = await fetch(
            `https://noteculture.onrender.com/api/notes/${selectedNoteId}`,
            {
                method: "DELETE"
            }
        );


        if (response.ok) {


            /*
                Remove the note card
                from the webpage
            */

            const noteCard =
                document.querySelector(
                    `.note-card[data-id="${selectedNoteId}"]`
                );


            if (noteCard) {

                noteCard.remove();

            }


            /*
                Close individual note
            */

            individualNote.style.display =
                "none";


            /*
                Clear selected note
            */

            selectedNoteId = null;

            selectedNote = null;

        } else {

            console.error(
                "Failed to delete note."
            );

        }


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

    }

});


/* =========================
   CLOSE BUTTON
========================= */

closeNote.addEventListener("click", () => {

    individualNote.style.display =
        "none";

});


/* =========================
   CLICK OUTSIDE TO CLOSE
========================= */

document.addEventListener("click", (event) => {

    if (

        individualNote.style.display ===
        "block"

        &&

        !individualNote.contains(
            event.target
        )

        &&

        !event.target.closest(
            ".note-card"
        )

    ) {

        individualNote.style.display =
            "none";

    }

});


/* =========================
   LOAD NOTES
========================= */

getNotes();