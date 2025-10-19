let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Your limitation—it's only your imagination.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Wisdom" }
  ];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const showLastBtn = document.getElementById("showLast");
  const categorySelect = document.getElementById("categorySelect");
  const formContainer = document.getElementById("formContainer");
  const exportBtn = document.getElementById("exportBtn");
  const importFile = document.getElementById("importFile");
  const clearStorageBtn = document.getElementById("clearStorageBtn");
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  function loadQuotes() {
    const raw = localStorage.getItem("quotes");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        quotes = parsed.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
      }
    } catch (e) {
    }
  }
  
  function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categorySelect.innerHTML = '<option value="all">All</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }
  
  function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category.";
      return;
    }
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
  }
  
  function showLastViewedQuote() {
    const raw = sessionStorage.getItem("lastViewedQuote");
    if (!raw) {
      alert("No last viewed quote in this session.");
      return;
    }
    try {
      const q = JSON.parse(raw);
      if (q && q.text) {
        quoteDisplay.textContent = `"${q.text}" — ${q.category || "Unknown"}`;
      } else {
        alert("No valid last viewed quote found.");
      }
    } catch (e) {
      alert("Error reading last viewed quote.");
    }
  }
  
  function addQuote() {
    const newTextElem = document.getElementById("newQuoteText");
    const newCategoryElem = document.getElementById("newQuoteCategory");
    const newText = newTextElem.value.trim();
    const newCategory = newCategoryElem.value.trim();
    if (!newText || !newCategory) {
      alert("Please enter both a quote and a category.");
      return;
    }
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();
    newTextElem.value = "";
    newCategoryElem.value = "";
    alert("Quote added successfully! You can now find it in the dropdown.");
  }
  
  function createAddQuoteForm() {
    formContainer.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = "Add a new quote";
    formContainer.appendChild(title);
    const inputQuote = document.createElement("input");
    inputQuote.id = "newQuoteText";
    inputQuote.type = "text";
    inputQuote.placeholder = "Enter a new quote";
    formContainer.appendChild(inputQuote);
    const inputCategory = document.createElement("input");
    inputCategory.id = "newQuoteCategory";
    inputCategory.type = "text";
    inputCategory.placeholder = "Enter quote category";
    formContainer.appendChild(inputCategory);
    const addButton = document.createElement("button");
    addButton.id = "addQuoteBtn";
    addButton.textContent = "Add Quote";
    formContainer.appendChild(addButton);
    addButton.addEventListener("click", addQuote);
  }
  
  function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const now = new Date();
    const filename = `quotes_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}.json`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  
  function importFromJsonFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          alert("Imported file must contain an array of quotes");
          return;
        }
        const valid = imported.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
        if (valid.length === 0) {
          alert("No valid quotes found in file.");
          return;
        }
        quotes.push(...valid);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } catch (err) {
        alert("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  }
  
  function clearSavedQuotes() {
    if (!confirm("This will remove all saved quotes from local storage. Continue?")) return;
    localStorage.removeItem("quotes");
    loadQuotes();
    populateCategories();
    alert("Saved quotes cleared.");
  }
  
  newQuoteBtn.addEventListener("click", showRandomQuote);
  showLastBtn.addEventListener("click", showLastViewedQuote);
  exportBtn.addEventListener("click", exportToJson);
  importFile.addEventListener("change", function (e) {
    const file = e.target.files && e.target.files[0];
    importFromJsonFile(file);
  });
  clearStorageBtn.addEventListener("click", clearSavedQuotes);
  categorySelect.addEventListener("change", showRandomQuote);
  
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  