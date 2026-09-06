const noteForm = document.getElementById("noteForm");
const saveMessage = document.getElementById("save-message");

noteForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;

    console.log("Sending:", title, content);

    try {

        const response = await fetch("https://noteculture.onrender.com/api/notes", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        const data = await response.json();

        console.log("Server response:", data);

        if (response.ok) {

            noteForm.reset();

            saveMessage.textContent = "Note saved successfully!";
            saveMessage.style.display = "block";

            setTimeout(() => {
            saveMessage.style.display = "none";
            }, 5000);
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {

        console.error("Fetch error:", error);
        alert("Could not connect to the server.");

    }
});