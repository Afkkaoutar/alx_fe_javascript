const quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Your limitation—it's only your imagination.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Wisdom" }
  ];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categorySelect = document.getElementById("categorySelect");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  
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
    const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category.";
      return;
    }
  
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
  }
  
  function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (!newText || !newCategory) {
      alert("Please enter both a quote and a category.");
      return;
    }
  
    quotes.push({ text: newText, category: newCategory });
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    console.log("✅ New quote added:", quotes[quotes.length - 1]);
    console.log("📚 All quotes now:", quotes);
    alert("Quote added successfully! You can now find it in the dropdown.");
  }
  
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  categorySelect.addEventListener("change", showRandomQuote);
  
  populateCategories();
  