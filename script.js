const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const word = input.value.trim();

    if (!word) {
        displayError("Please enter a word.");
        return;
    }

    fetchWord(word);
});

async function fetchWord(word) {
    results.innerHTML = "Loading...";

    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();
        displayWord(data[0]);

    } catch (error) {
        displayError("Sorry, no results found for that word.");
    }
}

function displayWord(data) {
    const phonetic = data.phonetics.find(p => p.text) || {};
    const audio = data.phonetics.find(p => p.audio) || {};
    const meaning = data.meanings[0];
    const definition = meaning.definitions[0];

    results.innerHTML = `
        <div class="word-header">
            <h2>${data.word}</h2>
            <span>${phonetic.text || ""}</span>
        </div>

        ${audio.audio ? `
            <audio controls>
                <source src="${audio.audio}">
            </audio>
        ` : ""}

        <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
        <p><strong>Definition:</strong> ${definition.definition}</p>
        <p><strong>Example:</strong> ${definition.example || "No example available."}</p>
        <p><strong>Synonyms:</strong> ${
            definition.synonyms && definition.synonyms.length
                ? definition.synonyms.join(", ")
                : "No synonyms available."
        }</p>
    `;
}

function displayError(message) {
    results.innerHTML = `<p class="error">${message}</p>`;
}
