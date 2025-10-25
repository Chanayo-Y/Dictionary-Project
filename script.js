const searchBtn = document.getElementById("searchBtn"); //connects to search button in app.html
const wordInput = document.getElementById("wordInput"); //connects to input field in app.html
const clearInputBtn = document.getElementById("clearInputBtn"); //connects to clear button in app.html
const resultDiv = document.getElementById("resultCard"); //connects to result display area in app.html

// Function to search for a word using the Dictionary API
function searchWord() {
  let word = wordInput.value.trim().toLowerCase(); // Convert to lower case for API
  
  //if empty input
  if (word === "") {
    resultDiv.innerHTML = `<p>Enter a word to search.</p>`;
    return;
  }

  //display loading message
  resultDiv.innerHTML = `<p>⏳ Searching for "<b>${word}</b>"...</p>`;

  // Fetch data from Dictionary API
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json()) //parse JSON response
    .then(data => {
      // Handle "No Definitions Found" or generic API error
      if (Array.isArray(data) === false) {
        resultDiv.innerHTML = `<p>No results found for "<b>${word}</b>". Try another word.</p>`;
        return;
      }
  
      const entry = data[0]; // Take the first entry from the results
      // Find the first phonetic text or use an empty string
      const phonetic = entry.phonetics.find(p => p.text)?.text || "";
      // Find the first audio URL
      const audioUrl = entry.phonetics.find(p => p.audio)?.audio;
      const meanings = entry.meanings;// Get meanings array

      // Build the output HTML
      let output = `
        <h3>
          ${entry.word} 
          <small>${phonetic}</small>
          ${audioUrl ? `<audio class="pronunciation-audio" controls src="${audioUrl}" aria-label="Pronunciation audio"></audio>` : ''}
        </h3>
        <hr>
      `;

      // Display definitions for each part of speech
      meanings.forEach(m => {
        output += `<p><b>${m.partOfSpeech}</b></p>`;
        
        // Display up to 3 definitions 
        m.definitions.slice(0, 3).forEach((def, i) => {
          output += `<p>${i + 1}. ${def.definition}</p>`;
        });
        
        // Display synonyms if they exist
        if (m.synonyms && m.synonyms.length) {
          output += `<p><b>Synonyms:</b> ${m.synonyms.slice(0, 5).join(", ")}</p>`;
        }
        // Display antonyms if they exist
        if (m.antonyms && m.antonyms.length) {
          output += `<p><b>Antonyms:</b> ${m.antonyms.slice(0, 5).join(", ")}</p>`;
        }
        // Separator between different parts of speech
        output += `<hr>`;
      });

      resultDiv.innerHTML = output;// Set the result HTML
    })
    .catch(error => {
      // Generic network or processing error
      resultDiv.innerHTML = `<p>⚠️ Error fetching data. Please check your network or try again later.</p>`;
      console.error("Dictionary API Error:", error);
    });
}

// Event Listeners
searchBtn.addEventListener("click", searchWord);
wordInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") searchWord();
});

clearInputBtn.addEventListener("click", () => {
    wordInput.value = ""; // Clear the input field
    wordInput.focus(); // Keep focus for easy new search
});