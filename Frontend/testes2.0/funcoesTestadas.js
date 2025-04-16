


async function fetchRequest(endpoint, requestType, body = null) {
  const baseUrl = "http://localhost:8080/sequeira-proj4/rest";
  const url = `${baseUrl}${endpoint}`;
  const token = sessionStorage.getItem("token");
  let headers = {};
  if (sessionStorage.getItem("token")) {
    headers = {
      "Content-Type": "application/json",
      token: `${token}`,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }
  const options = {
    method: requestType,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      // No JSON body; return an empty object or response text (optional)
      return null;
    }
  } catch (error) {
    console.error("Fetch request errorFailed:", error);
    throw error;
  }
}

function openRegistry() {
  const modalRegister = document.getElementById("modal-register");
  modalRegister.style.display = "flex";
}

function inicializarBotoesAsideUser() {
    const myProductsBtn = document.getElementById("myProductsBtn");
    myProductsBtn.addEventListener("click", () => {
      document.getElementById("produtos").style.display = "contents";
      showSection("produtos");
    });
  
    const myReviewsBtn = document.getElementById("myReviewsBtn");
    myReviewsBtn.addEventListener("click", () => {
      document.getElementById("produtos").style.display = "none";
      showSection("avaliacoes");
    });
  
    const myInfoBtn = document.getElementById("myInfoBtn");
    myInfoBtn.addEventListener("click", function () {
      document.getElementById("produtos").style.display = "none";
      showSection("informacoes");
    });
  
  }


function showSection(sectionId) {
    // Hide all sections
    document
      .querySelectorAll(".profile-section, #produtos")
      .forEach((section) => {
        section.style.display = "none";
      });
  
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
      selectedSection.style.display = "block";
    }
  
    // Special handling for profile sections
    if (sectionId !== "produtos") {
      document.querySelectorAll(".profile-section").forEach((section) => {
        section.classList.remove("active-section");
      });
      selectedSection.classList.add("active-section");
    }
  
    // Load content if needed
    if (sectionId === "avaliacoes") loadUserReviews();
  }

module.exports = {
  fetchRequest,
  openRegistry,
  inicializarBotoesAsideUser,
    showSection,
};
