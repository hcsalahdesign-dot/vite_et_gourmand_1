
console.log("auth.js chargé");

function estConnecte() {
  return localStorage.getItem("currentUser") !== null;
}

function updateHeaderAuthState() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // =========================
  // AUTH MOBILE
  // =========================

  const mobileAuth = document.querySelector(".mobile-auth-link");

  if (mobileAuth) {

    const mobileLabel = mobileAuth.querySelector("span");

    if (!user) {

      mobileLabel.textContent = "Connexion";

      mobileAuth.setAttribute("data-nav", "connexion");

      mobileAuth.onclick = null;

    } else {

      mobileLabel.textContent = "Déconnexion";

      mobileAuth.removeAttribute("data-nav");

      mobileAuth.onclick = (e) => {
        e.preventDefault();
        logout();
      };
    }
  }


  const accountButtons = document.querySelectorAll(".bouton-mon-compte");
  const cartButton = document.getElementById("cartButton");

  accountButtons.forEach((accountButton) => {
    const label = accountButton.querySelector("span");
    if (!label) return;

    if (!user) {
      label.textContent = "Mon compte/s’inscrire";
      accountButton.setAttribute("data-nav", "connexion");
      return;
    }

    label.textContent = "Déconnexion";
    accountButton.removeAttribute("data-nav");

    accountButton.onclick = () => {
      logout();
    };
  });

  if (!cartButton) return;

  if (!user) {
    cartButton.style.display = "none";
    return;
  }

  if (user.role === "client") {
    cartButton.style.display = "inline-flex";
    cartButton.setAttribute("data-nav", "profilClient");
  } else {
    cartButton.style.display = "none";
  }
}

document.querySelectorAll(".bouton-mon-compte").forEach(btn => {
  btn.addEventListener("click", () => {
    if (estConnecte()) logout();
  });
});



function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("user_id");

  // redirection propre Docker
  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeaderAuthState();

  const accountButton = document.querySelector(".bouton-mon-compte");
  if (accountButton) {
    accountButton.addEventListener("click", () => {
      if (estConnecte()) {
        logout();
      }
    });
  }

  // =========================
  // INITIALISATION USERS
  // =========================

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const defaultUsers = [
    {
      email: "admin@viteetgourmand.fr",
      password: "1234",
      role: "admin"
    },
    {
      email: "employe@viteetgourmand.fr",
      password: "1234",
      role: "employe"
    }
  ];

  defaultUsers.forEach((defaultUser) => {
    const exists = users.find((u) => u.email === defaultUser.email);
    if (!exists) users.push(defaultUser);
  });

  localStorage.setItem("users", JSON.stringify(users));

  // =========================
  // HELPERS
  // =========================

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // =========================
  // REGISTER
  // =========================

  window.register = function (email, password, role = "client") {
    let users = getUsers();

    const exists = users.find((u) => u.email === email);

    if (exists) {
      alert("Compte déjà existant");
      return;
    }

    users.push({ email, password, role });

    saveUsers(users);

    alert("Compte créé !");
  };

  // =========================
  // LOGIN
  // =========================

  window.login = async function (email, password) {
    try {
      const response = await fetch("/backend/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!result.success) {
        alert("Identifiants incorrects");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(result.user));

      // ✅ Fusion panier guest → panier connecté
      const panierGuest = JSON.parse(localStorage.getItem("panier_guest")) || [];
      if (panierGuest.length > 0) {
        const panierKey = "panier_" + result.user.email;
        const panierExistant = JSON.parse(localStorage.getItem(panierKey)) || [];
        const panierFusionne = [...panierExistant, ...panierGuest];
        localStorage.setItem(panierKey, JSON.stringify(panierFusionne));
        localStorage.removeItem("panier_guest");
      }

      redirectByRole(result.user);

    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  };

  // =========================
  // REDIRECTION PAR RÔLE
  // =========================

 function redirectByRole(user) {
    // Si une redirection était prévue (ex: après ajout panier)
    const redirect = localStorage.getItem("redirectAfterLogin");
    if (redirect && user.role === "client") {
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirect;
        return;
    }

    // Sinon redirection par défaut selon le rôle
    const routes = {
        client: "/",                                      // ✅ accueil pour le client
        admin: "/pages/profil-admin-desktop.html",
        employe: "/pages/profil-employe-desktop.html"
    };

    window.location.href = routes[user.role];
}

  // =========================
  // PROTECTION DES PAGES
  // =========================

  function protectPage() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

   const protectedPages = [
  "/pages/profil-admin-desktop.html",
  "/pages/profil-employe-desktop.html"
  ];


    const currentPage = window.location.pathname;

    if (!user && protectedPages.includes(currentPage)) {
      window.location.href = "/pages/connexion-desktop.html";
    }
  }

  protectPage();

  // =========================
  // FORM LOGIN
  // =========================

  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      login(email, password);
    });
  }

  // =========================
  // FORM INSCRIPTION
  // =========================

  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirm = document.getElementById("signupConfirmPassword").value;

      if (password !== confirm) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }

      register(email, password, "client");

      alert("Compte créé avec succès !");

      window.location.href = "/pages/connexion-desktop.html";
    });
  }

  // =========================
  // ADMIN - AFFICHAGE EMPLOYÉS
  // =========================

  function renderEmployees() {
    const users = getUsers();
    const employees = users.filter((u) => u.role === "employe");

    const container = document.getElementById("employeesContainer");
    if (!container) return;

    container.innerHTML = "";

    const MIN_ROWS = 8;
    const data = [...employees];

    while (data.length < MIN_ROWS) {
      data.push(null);
    }

    data.forEach((emp, index) => {
      const row = document.createElement("div");

      row.classList.add("client-table__row");
      row.classList.add(
        index % 2 === 0
          ? "client-table__row--light"
          : "client-table__row--dark"
      );

      if (emp) {
        row.innerHTML = `
          <span>${emp.email.split("@")[0]}</span>
          <span>${emp.email}</span>
          <span>${emp.role}</span>
          <span>Actif</span>
          <span class="actions">
            <button class="icon-btn edit">✏️</button>
            <button class="icon-btn delete">🗑️</button>
          </span>
        `;
      } else {
        row.innerHTML = `
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        `;
        row.style.opacity = "1";
      }

      container.appendChild(row);
    });
  }

  // =========================
  // INIT ADMIN PANEL
  // =========================

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user && user.role === "admin") {
    renderEmployees();
  }
});
