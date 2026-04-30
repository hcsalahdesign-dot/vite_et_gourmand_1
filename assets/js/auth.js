console.log("auth.js chargé");


function estConnecte() {
  return localStorage.getItem("user") !== null;
}



document.addEventListener("DOMContentLoaded", () => {

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

  defaultUsers.forEach(defaultUser => {
    const exists = users.find(u => u.email === defaultUser.email);
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

  window.register = function(email, password, role = "client") {

    let users = getUsers();

    const exists = users.find(u => u.email === email);

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

  window.login = function(email, password) {

    let users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Identifiants incorrects");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Connexion réussie");

    redirectByRole(user);
  };

  // =========================
  // REDIRECTION PAR RÔLE
  // =========================

  function redirectByRole(user) {

    const routes = {
      client: "/pages/profil-client-desktop.html",
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
      "/pages/profil-client-desktop.html",
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
  const employees = users.filter(u => u.role === "employe");

  const container = document.getElementById("employeesContainer");
  if (!container) return;

  container.innerHTML = "";

  const MIN_ROWS = 8; // 👈 nombre de lignes visuelles minimum

  const data = [...employees];

  // compléter avec des lignes vides si besoin
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
      row.style.opacity = "1"; //  visuel léger
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