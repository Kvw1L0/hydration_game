
let user = null;
let cooldown = 15 * 60 * 1000;
let prizeChance = 0.15;
let circumference = 2 * Math.PI * 85;

function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  if (!name || !email) return;

  user = {
    name,
    email,
    id: "SF-" + Math.floor(Math.random()*999999),
    hydration: 0,
    lastRefill: null
  };

  document.getElementById("screen-register").classList.remove("active");
  document.getElementById("screen-dashboard").classList.add("active");

  document.getElementById("userName").innerText = name;
  document.getElementById("userId").innerText = user.id;

  updateUI();
}

function updateUI() {
  const percent = user.hydration;
  const offset = circumference - (percent / 100) * circumference;
  const ring = document.getElementById("ring");

  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;
  ring.style.transition = "stroke-dashoffset 0.8s ease";

  document.getElementById("percent").innerText = percent + "%";
}

function refill() {
  const now = Date.now();

  if (user.lastRefill && now - user.lastRefill < cooldown) {
    document.getElementById("message").innerText = "⏳ Espera tu próximo refill";
    return;
  }

  user.lastRefill = now;
  user.hydration = Math.min(user.hydration + 25, 100);

  if (navigator.vibrate) navigator.vibrate(100);

  if (Math.random() < prizeChance) {
    document.getElementById("message").innerText = "⚡ ENERGY BOOST!";
    confetti({ particleCount: 120, spread: 90 });
  } else {
    document.getElementById("message").innerText = "Sigue hidratándote 💪";
  }

  updateUI();
}
