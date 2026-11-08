/*
 * Sousa Artisan — consentement aux cookies.
 * - Google Analytics n'est chargé qu'après acceptation explicite.
 * - Les boutons « Accepter » et « Refuser » ont le même poids (recommandation CNIL).
 * - Le choix est mémorisé dans le navigateur (localStorage) ; le lien
 *   « Gérer les cookies » (attribut data-cookie-settings) rouvre le bandeau.
 */
(function () {
  var KEY = "sa_cookie_consent";
  var GA_ID = "G-Q2F3CM4N0Y";
  var LEGAL_URL = "mentions-legales.html#cookies";

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  var gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* stockage indisponible */ }
  }

  if (getChoice() === "accepted") loadAnalytics();

  var css =
    ".sa-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:90;max-width:760px;margin:0 auto;" +
    "background:#141414;color:#e9e9e9;border:1px solid #2e2e2e;border-left:3px solid #e30613;border-radius:6px;" +
    "box-shadow:0 18px 40px rgba(0,0,0,.55);padding:18px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;" +
    "display:none;flex-wrap:wrap;gap:14px 20px;align-items:center}" +
    ".sa-consent.show{display:flex}" +
    ".sa-consent p{margin:0;flex:1 1 320px;color:#c9c9c9}" +
    ".sa-consent p a{color:#fff;font-weight:700}" +
    ".sa-consent .sa-consent-btns{display:flex;gap:10px;flex:none}" +
    ".sa-consent button{font:inherit;font-weight:800;font-size:14px;padding:12px 18px;border-radius:4px;cursor:pointer;border:1px solid #555;background:transparent;color:#fff;min-width:110px}" +
    ".sa-consent button.sa-accept{background:#e30613;border-color:#e30613}" +
    ".sa-consent button:hover{border-color:#fff}" +
    ".sa-consent button.sa-accept:hover{background:#b9000b;border-color:#b9000b}" +
    ".sa-consent button:focus-visible{outline:2px solid #fff;outline-offset:2px}" +
    "@media(max-width:760px){.sa-consent{bottom:84px;left:12px;right:12px}.sa-consent .sa-consent-btns{width:100%}.sa-consent button{flex:1}}";

  function buildBanner() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var box = document.createElement("div");
    box.className = "sa-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Gestion des cookies");
    box.innerHTML =
      '<p>Ce site utilise Google Analytics pour mesurer sa fréquentation, uniquement avec votre accord. ' +
      '<a href="' + LEGAL_URL + '">En savoir plus</a>.</p>' +
      '<div class="sa-consent-btns">' +
      '<button type="button" data-choice="refused">Refuser</button>' +
      '<button type="button" class="sa-accept" data-choice="accepted">Accepter</button>' +
      "</div>";
    document.body.appendChild(box);

    box.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-choice]");
      if (!btn) return;
      var choice = btn.getAttribute("data-choice");
      setChoice(choice);
      box.classList.remove("show");
      if (choice === "accepted") loadAnalytics();
    });
    return box;
  }

  function init() {
    var banner = null;
    function show() {
      if (!banner) banner = buildBanner();
      banner.classList.add("show");
    }

    if (getChoice() === null) show();

    document.querySelectorAll("[data-cookie-settings]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        show();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
