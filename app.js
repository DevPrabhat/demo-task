document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const loadMoreButton = document.getElementById("load-more");
  const searchBar = document.getElementById("search-bar");
  const filterCategory = document.getElementById("filter-category");
  const sortPrice = document.getElementById("sort-price");
  const loadingIndicator = document.getElementById("loading-indicator");
  const errorMessage = document.getElementById("error-message");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuClose = document.getElementById("close-button");
  const clearFilterButton = document.getElementById("clear-filter");

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("open");
    mobileMenu.classList.remove("close");
  });

  menuClose.addEventListener("click", () => {
    mobileMenu.classList.add("close");
    mobileMenu.classList.remove("open");
  });

  // Event listener for Clear Filters button
  clearFilterButton.addEventListener("click", () => {
    resetFilters();
    resetDisplay();
  });

  let products = [];
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      showLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("https://fakestoreapi.com/products"),
        fetch("https://fakestoreapi.com/products/categories"),
      ]);
      products = await productsResponse.json();
      const categories = await categoriesResponse.json();
      populateCategories(categories);
      filteredProducts = products;
      displayProducts();
    } catch (error) {
      showError(true);
    } finally {
      showLoading(false);
    }
  };

  // Populate categories in the filter dropdown
  const populateCategories = (categories) => {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      filterCategory.appendChild(option);
    });
  };

  // Display products on the page
  const displayProducts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentProducts = filteredProducts.slice(start, end);

    currentProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
          <img src="${product.image}" alt="${product.title}" />
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p>$${product.price}</p>
        `;
      productList.appendChild(productCard);
    });

    if (end >= filteredProducts.length) {
      loadMoreButton.style.display = "none";
    } else {
      loadMoreButton.style.display = "block";
    }
  };

  // Load more products on button click
  loadMoreButton.addEventListener("click", () => {
    currentPage++;
    displayProducts();
  });

  // Search functionality
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    resetDisplay();
  });

  // Filter functionality
  filterCategory.addEventListener("change", (e) => {
    const category = e.target.value;
    if (category) {
      filteredProducts = products.filter(
        (product) => product.category === category
      );
    } else {
      filteredProducts = products;
    }
    resetDisplay();
  });

  // Sort functionality
  sortPrice.addEventListener("change", (e) => {
    const sortOrder = e.target.value;
    filteredProducts.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
    resetDisplay();
  });

  // Show loading indicator
  const showLoading = (isLoading) => {
    loadingIndicator.style.display = isLoading ? "block" : "none";
  };

  // Show error message
  const showError = (isError) => {
    errorMessage.style.display = isError ? "block" : "none";
  };

  // Reset product display
  const resetDisplay = () => {
    productList.innerHTML = "";
    currentPage = 1;
    displayProducts();
    loadMoreButton.style.display =
      filteredProducts.length > itemsPerPage ? "block" : "none";
  };

  // Reset filters
  const resetFilters = () => {
    searchBar.value = "";
    filterCategory.value = "";
    sortPrice.value = "default";
    filteredProducts = [...products]; // Reset filtered products to all products
  };

  // Initial fetch
  fetchProducts();
});
