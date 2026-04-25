console.log("auth.js chargé");

document.addEventListener("DOMContentLoaded", () => {

  // récupérer users UNE SEULE FOIS
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

    const userExists = users.find(u => u.email === email);

    if (userExists) {
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

    if (user.role === "client") {
      window.location.href = "/pages/profil-client-desktop.html";
    }

    if (user.role === "admin") {
      window.location.href = "/pages/profil-admin-desktop.html";
    }

    if (user.role === "employe") {
      window.location.href = "/pages/profil-employe-desktop.html";
    }
  };



  ///=============authentification sécurisation des pages profil================///

  function protectPage() {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  // récupérer la page actuelle
  const currentPage = window.location.pathname;

  const protectedPages = [
    "/pages/profil-client-desktop.html",
    "/pages/profil-admin-desktop.html",
    "/pages/profil-employe-desktop.html"
  ];

  if (!user && protectedPages.includes(currentPage)) {
    window.location.href = "/pages/connexion-desktop.html";
  }
}

// protectPage();

 protectPage();


 //==========================authentification du formulaire de connexion================//

 const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}


//==========================authentification du formulaire d'inscription================//

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    register(email, password, "client");

    alert("Compte créé avec succès !");

    window.location.href = "/pages/connexion-desktop.html";
  });
}

});