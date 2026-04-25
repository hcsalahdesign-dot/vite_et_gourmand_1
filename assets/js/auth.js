function register(email, password, role) {

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(u => u.email === email);

  if (userExists) {
    alert("Compte déjà existant");
    return;
  }

  const newUser = {
    email,
    password,
    role
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Compte créé !");
}