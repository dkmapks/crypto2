// Kursy startowe
let kursy = {
  dcoin: 1.0,
  branzo: 0.10,
  bbcoin: 0.01,
};

// Salda portfela
let portfel = {
  pln: 0,
  dcoin: 0,
  branzo: 0,
  bbcoin: 0,
};

// Admin panel
const ADMIN_CODE = "7432";

// Tryb admina
let adminLogged = false;

// Flaga czy kursy są ustalone ręcznie (true) czy losowe (false)
let kursManualny = false;

// Funkcja losująca kurs w okolicy domyślnej wartości +/- 10%
function losujKurs(klucz) {
  const base = {
    dcoin: 1.0,
    branzo: 0.10,
    bbcoin: 0.01,
  }[klucz];
  const changePercent = (Math.random() * 0.2) - 0.1; // -10% do +10%
  return Number((base * (1 + changePercent)).toFixed(4));
}

// Aktualizuj kursy (losowo jeśli nie ustalone ręcznie)
function aktualizujKursy() {
  if (!kursManualny) {
    kursy.dcoin = losujKurs("dcoin");
    kursy.branzo = losujKurs("branzo");
    kursy.bbcoin = losujKurs("bbcoin");
  }
  // Aktualizuj wyświetlanie i portfel
  pokazPortfel();
  pokazAdminSaldo();
}

// Pokazuje stan portfela w HTML
function pokazPortfel() {
  document.getElementById("saldo-pln").textContent = portfel.pln.toFixed(2);
  document.getElementById("saldo-dcoin").textContent = portfel.dcoin;
  document.getElementById("saldo-branzo").textContent = portfel.branzo;
  document.getElementById("saldo-bbcoin").textContent = portfel.bbcoin;

  document.getElementById("val-dcoin").textContent = (portfel.dcoin * kursy.dcoin).toFixed(2);
  document.getElementById("val-branzo").textContent = (portfel.branzo * kursy.branzo).toFixed(2);
  document.getElementById("val-bbcoin").textContent = (portfel.bbcoin * kursy.bbcoin).toFixed(2);

  const totalValue =
    portfel.pln +
    portfel.dcoin * kursy.dcoin +
    portfel.branzo * kursy.branzo +
    portfel.bbcoin * kursy.bbcoin;
  document.getElementById("total-value").textContent = totalValue.toFixed(2);
}

// Pokazuje saldo w panelu admina
function pokazAdminSaldo() {
  if (!adminLogged) return;
  document.getElementById("admin-saldo-pln").textContent = portfel.pln.toFixed(2);
  document.getElementById("admin-saldo-dcoin").textContent = portfel.dcoin;
  document.getElementById("admin-saldo-branzo").textContent = portfel.branzo;
  document.getElementById("admin-saldo-bbcoin").textContent = portfel.bbcoin;
}

// Obsługa kodów promocyjnych
function applyPromoCode() {
  const code = document.getElementById("promo-code").value.trim().toUpperCase();
  const msgEl = document.getElementById("promo-msg");

  switch (code) {
    case "BRANZO":
      portfel.dcoin += 100;
      msgEl.textContent = "Dodano 100 DCoinów!";
      msgEl.className = "success";
      break;
    case "BB":
      portfel.bbcoin += 1000;
      msgEl.textContent = "Dodano 1000 BBCoinów!";
      msgEl.className = "success";
      break;
    case "AMAM":
      portfel.branzo += 1000;
      msgEl.textContent = "Dodano 1000 Branzo!";
      msgEl.className = "success";
      break;
    default:
      msgEl.textContent = "Nieznany kod promocyjny.";
      msgEl.className = "";
      return;
  }
  pokazPortfel();
  document.getElementById("promo-code").value = "";
}

// Symulacja wysyłania kryptowalut (tylko odejmuje z portfela)
function sendCrypto() {
  const coin = document.getElementById("send-coin").value;
  const amount = Number(document.getElementById("send-amount").value);
  const msgEl = document.getElementById("send-msg");

  if (!amount || amount <= 0) {
    msgEl.textContent = "Podaj poprawną ilość.";
    msgEl.className = "";
    return;
  }
  if (portfel[coin] < amount) {
    msgEl.textContent = `Masz za mało ${coin.toUpperCase()}.`;
    msgEl.className = "";
    return;
  }
  portfel[coin] -= amount;
  msgEl.textContent = `Wysłano ${amount} ${coin.toUpperCase()}.`;
  msgEl.className = "success";
  pokazPortfel();
  document.getElementById("send-amount").value = "";
}

// Doładowanie PLN
function depositPLN() {
  const amount = Number(document.getElementById("deposit-amount").value);
  const msgEl = document.getElementById("deposit-msg");

  if (!amount || amount <= 0) {
    msgEl.textContent = "Podaj poprawną kwotę do doładowania.";
    msgEl.className = "";
    return;
  }
  portfel.pln += amount;
  msgEl.textContent = `Doładowano saldo PLN o ${amount.toFixed(2)} zł.`;
  msgEl.className = "success";
  pokazPortfel();
  document.getElementById("deposit-amount").value = "";
}

// Panel admina: logowanie
function adminLogin() {
  const pass = document.getElementById("admin-password").value;
  const msgEl = document.getElementById("admin-login-msg");
  if (pass === ADMIN_CODE) {
    adminLogged = true;
    msgEl.textContent = "Zalogowano pomyślnie.";
    msgEl.className = "success";
    document.getElementById("admin-password").value = "";
    document.getElementById("admin-content").classList.remove("hidden");
  } else {
    msgEl.textContent = "Nieprawidłowy kod admina.";
    msgEl.className = "";
  }
}

// Panel admina: zapis kursów
function saveRates() {
  const dcoinRate = parseFloat(document.getElementById("kurs-dcoin").value);
  const branzoRate = parseFloat(document.getElementById("kurs-branzo").value);
  const bbcoinRate = parseFloat(document.getElementById("kurs-bbcoin").value);

  if (
    isNaN(dcoinRate) ||
    dcoinRate <= 0 ||
    isNaN(branzoRate) ||
    branzoRate <= 0 ||
    isNaN(bbcoinRate) ||
    bbcoinRate <= 0
  ) {
    alert("Podaj poprawne wartości kursów (większe od 0)");
    return;
  }

  kursy.dcoin = dcoinRate;
  kursy.branzo = branzoRate;
  kursy.bbcoin = bbcoinRate;
  kursManualny = true;
  pokazPortfel();
  pokazAdminSaldo();
  alert("Kursy zapisane i ustawione ręcznie.");
}

// Panel admina toggle
function toggleAdminPanel() {
  const panel = document.getElementById("admin-panel");
  if (panel.classList.contains("hidden")) {
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
}

// Aktualizacja kursów co 10 sekund jeśli nie ustawione ręcznie
setInterval(() => {
  if (!adminLogged || !kursManualny) {
    aktualizujKursy();
  }
}, 10000);

// Obsługa zdarzeń
document.getElementById("apply-code").addEventListener("click", applyPromoCode);
document.getElementById("send-btn").addEventListener("click", sendCrypto);
document.getElementById("deposit-btn").addEventListener("click", depositPLN);
document.getElementById("admin-login-btn").addEventListener("click", adminLogin);
document.getElementById("save-rates-btn").addEventListener("click", saveRates);
document.getElementById("admin-toggle").addEventListener("click", toggleAdminPanel);

// Przy starcie pokaz portfela i kursów
aktualizujKursy();
