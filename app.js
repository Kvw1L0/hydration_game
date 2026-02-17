let user = null;
let cooldownMinutes = 15;
let prizeProbability = 0.1; // 10% demo

function generateId() {
  return "SF-" + Math.floor(Math.random() * 999999);
}

function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (!name || !email) return alert("Completa los datos");

  user = {
    name,
    email,
    id: generateId(),
    hydration: 0,
    lastRefill: null
  };

  localStorage.setItem("hydrationUser", JSON.stringify(user));

  document.getElementById("registerScreen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  updateDashboard();
}

function loadUser() {
  const stored = localStorage.getItem("hydrationUser");
  if (stored) {
    user = JSON.parse(stored);
    document.getElementById("registerScreen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    updateDashboard();
  }
}

function updateDashboard() {
  document.getElementById("welcome").innerText = "Hola " + user.name;
  document.getElementById("hydrationId").innerText = user.id;

  document.getElementById("percentage").innerText = user.hydration + "%";
  document.getElementById("progressBar").style.width = user.hydration + "%";

  checkCooldown();
}

function refill() {
  const now = Date.now();

  if (user.lastRefill && now - user.lastRefill < cooldownMinutes * 60000) {
    return;
  }

  user.lastRefill = now;
  user.hydration = Math.min(user.hydration + 25, 100);

  localStorage.setItem("hydrationUser", JSON.stringify(user));

  const wonPrize = Math.random() < prizeProbability;

  if (wonPrize) {
    document.getElementById("result").innerText = "ENERGY BOOST ACTIVADO!";
  } else {
    document.getElementById("result").innerText = "Sigue hidratándote!";
  }

  updateDashboard();
}

function checkCooldown() {
  if (!user.lastRefill) return;

  const now = Date.now();
  const diff = now - user.lastRefill;
  const remaining = cooldownMinutes * 60000 - diff;

  const btn = document.getElementById("refillBtn");

  if (remaining > 0) {
    btn.disabled = true;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    document.getElementById("cooldownText").innerText =
      `Próximo refill en ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    setTimeout(checkCooldown, 1000);
  } else {
    btn.disabled = false;
    document.getElementById("cooldownText").innerText =
      "Refill disponible";
  }
}

loadUser();
