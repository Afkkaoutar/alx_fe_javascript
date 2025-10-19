let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Your limitation—it's only your imagination.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Wisdom" }
  ];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categoryFilter = document.getElementById("categoryFilter");
  const syncStatus = document.getElementById("syncStatus");
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  
    const lastFilter = localStorage.getItem("lastFilter");
    if (lastFilter) categoryFilter.value = lastFilter;
  }
  
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category.";
      return;
    }
  
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  }
  
  function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (!newText || !newCategory) {
      alert("Please enter both a quote and a category.");
      return;
    }
  
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
    postQuoteToServer(newQuote);
    syncQuotes();
  }
  
  function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");
  
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
    addButton.textContent = "Add Quote";
    formContainer.appendChild(addButton);
  
    addButton.addEventListener("click", addQuote);
  }
  
  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("lastFilter", selectedCategory);
    showRandomQuote();
  }
  
  function restoreLastSession() {
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }
  }
  
  // ==================== SERVER SYNC ====================
  
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      const data = await response.json();
      return data.map(post => ({ text: post.title, category: "Server" }));
    } catch (error) {
      console.error("Server fetch failed:", error);
      return [];
    }
  }
  
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quote)
      });
      const result = await response.json();
      console.log("Quote posted to server:", result);
    } catch (error) {
      console.error("Error posting quote:", error);
    }
  }
  
  async function syncQuotes() {
    syncStatus.textContent = "Syncing with server...";
    const serverQuotes = await fetchQuotesFromServer();
  
    let mergedQuotes = [...quotes];
    let conflicts = 0;
  
    serverQuotes.forEach(serverQuote => {
      const exists = mergedQuotes.some(q => q.text === serverQuote.text);
      if (!exists) mergedQuotes.push(serverQuote);
      else conflicts++;
    });
  
    if (conflicts > 0) syncStatus.textContent = `Conflicts detected: ${conflicts}. Server version kept.`;
    else syncStatus.textContent = "Sync completed successfully.";
  
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
  
    setTimeout(() => { syncStatus.textContent = ""; }, 3000);
  }
  
  setInterval(syncQuotes, 30000);
  
  // ==================== INIT ====================
  
  newQuoteBtn.addEventListener("click", showRandomQuote);
  populateCategories();
  createAddQuoteForm();
  filterQuotes();
  restoreLastSession();
  syncQuotes();
  