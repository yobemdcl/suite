(function () {
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyY4en4hnSaKKcomnvLYPrCCgufqVmOQ928Dvd0Q4h4q0xpH-Tf0YfAh51Q53FpXCs/exec";

  const ASSETS = {
    miningLogo: "./assets/Logo.jpeg",
    miningLogoFallback: "./assets/icon.svg",
    dashBg: "./assets/dashboard-bg.jpg",
  };


  // =========================
  // STAFF LOGIN (4 staff)
  // =========================
  const STAFF_ACCOUNTS = {
    "1111": { name: "Adams", role: "staff" },
    "2222": { name: "Abba", role: "staff" },
    "4444": { name: "Mustapha", role: "staff" },
    "5555": { name: "Mohammed", role: "staff" },
    "3333": { name: "Executive", role: "md" },
  };

  // =========================
  // LocalStorage keys (offline-first mirror)
  // =========================
  const LS_KEYS = {
    artisans: "ysmco_artisans_v2",
    exitLogs: "ysmco_exitlogs_v2",
    staffLocs: "ysmco_stafflocs_v2",
    scanLogs: "ysmco_scanlogs_v2",
    pwaHintDismissed: "ysmco_pwa_ios_hint_dismissed_v1",
  };

  function lsGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
  function safeArray(val) {
    return Array.isArray(val) ? val : [];
  }

  // =========================
  // MINERAL PRICING (Royalty Rates as at 25 Nov 2024)
  // =========================
  const MINERAL_CATALOG = [
    { name: "Antimony Ore", price: 6000, unit: "ton" },
    { name: "Amethyst", price: 800, unit: "kg" },
    { name: "Aquamarine", price: 250, unit: "gram" },
    { name: "Barytes", price: 1500, unit: "ton" },
    { name: "Bauxite", price: 600, unit: "ton" },
    { name: "Bentonite", price: 600, unit: "ton" },
    { name: "Beryllium", price: 17500, unit: "ton" },
    { name: "Bismuth", price: 200, unit: "ton" },
    { name: "Bitumen/Tar Sand", price: 1000, unit: "ton" },
    { name: "Chalcopyrite", price: 3600, unit: "ton" },
    { name: "Chromite", price: 10000, unit: "ton" },
    { name: "Clay", price: 200, unit: "ton" },
    { name: "Coal", price: 900, unit: "ton" },
    { name: "Columbite Ore (<30% Nb2O5)", price: 180000, unit: "ton" },
    { name: "Columbite Concentrate (>30% Nb2O5)", price: 300000, unit: "ton" },
    { name: "Copper Ore", price: 3600, unit: "ton" },
    { name: "Copper Concentrate", price: 10800, unit: "ton" },
    { name: "Corundum", price: 120, unit: "gram" },
    { name: "Crystal Quartz", price: 200, unit: "kg" },
    { name: "Diatomite", price: 5000, unit: "ton" },
    { name: "Dolomite", price: 200, unit: "ton" },
    { name: "Dolomite (Pulverized)", price: 2500, unit: "ton" },
    { name: "Emerald", price: 250, unit: "gram" },
    { name: "Feldspar", price: 300, unit: "ton" },
    { name: "Flourite", price: 2300, unit: "ton" },
    { name: "Garnet", price: 12000, unit: "kg" },
    { name: "Gold Concentrate", price: 32436, unit: "ounce" },
    { name: "Granite Blocks", price: 4000, unit: "m3" },
    { name: "Granite Aggregates", price: 275, unit: "ton" },
    { name: "Granite Dust", price: 150, unit: "ton" },
    { name: "Graphite", price: 4000, unit: "ton" },
    { name: "Gypsum", price: 600, unit: "ton" },
    { name: "Ilmenite", price: 1000, unit: "ton" },
    { name: "Industrial Quartz", price: 400, unit: "ton" },
    { name: "Iron Ore", price: 240, unit: "ton" },
    { name: "Kaolin (Crude)", price: 300, unit: "ton" },
    { name: "Kaolin (Pulverized)", price: 400, unit: "ton" },
    { name: "Laterite", price: 100, unit: "ton" },
    { name: "Lead/Zinc Ore (<55% Pb, <30% Zn)", price: 3000, unit: "ton" },
    { name: "Lead/Zinc Concentrate (>55% Pb, >30% Zn)", price: 14400, unit: "ton" },
    { name: "Limestone (Crude)", price: 200, unit: "ton" },
    { name: "Lithium Ore (Lepidolite)", price: 24000, unit: "ton" },
    { name: "Lithium Ore (Kunzite)", price: 27000, unit: "ton" },
    { name: "Lithium Ore (Spodumene)", price: 10500, unit: "ton" },
    { name: "Lithium Concentrate", price: 27000, unit: "ton" },
    { name: "Lithium Carbonate", price: 570000, unit: "ton" },
    { name: "Magnesite", price: 400, unit: "ton" },
    { name: "Marble Aggregates", price: 400, unit: "ton" },
    { name: "Marble (Pulverized)", price: 3500, unit: "ton" },
    { name: "Marble Blocks", price: 3000, unit: "m3" },
    { name: "Manganese", price: 700, unit: "ton" },
    { name: "Molybdenum", price: 620, unit: "kg" },
    { name: "Monazite", price: 75000, unit: "ton" },
    { name: "Mica", price: 4000, unit: "ton" },
    { name: "Nickel", price: 10000, unit: "ton" },
    { name: "Phosphate", price: 400, unit: "ton" },
    { name: "Pyrite", price: 100, unit: "ton" },
    { name: "Ruby", price: 300, unit: "gram" },
    { name: "Rutile", price: 3000, unit: "ton" },
    { name: "Salt", price: 120, unit: "ton" },
    { name: "Sand", price: 100, unit: "ton" },
    { name: "Sapphire", price: 1000, unit: "gram" },
    { name: "Shale", price: 60, unit: "ton" },
    { name: "Silica Sand", price: 200, unit: "ton" },
    { name: "Silver Ore", price: 20, unit: "gram" },
    { name: "Soda Ash/Trona", price: 20000, unit: "ton" },
    { name: "Talc", price: 400, unit: "ton" },
    { name: "Tantalite (Crude) (<30% Ta2O5)", price: 360000, unit: "ton" },
    { name: "Tantalite Concentrate (>30% Ta2O5)", price: 1800000, unit: "ton" },
    { name: "Tin Ore (<50% Sn)", price: 120000, unit: "ton" },
    { name: "Tin Concentrate (>50% Sn)", price: 180000, unit: "ton" },
    { name: "Topaz", price: 1000, unit: "kg" },
    { name: "Tourmaline (Green)", price: 250, unit: "gram" },
    { name: "Tourmaline (Pink & Blue)", price: 300, unit: "gram" },
    { name: "Wolframite", price: 100, unit: "kg" },
    { name: "Zircon", price: 10000, unit: "kg" },
    { name: "Zircon Sand", price: 1000, unit: "ton" },
  ];
  const MINERAL_NAMES = MINERAL_CATALOG.map((m) => m.name);
  const MINERAL_MAP = MINERAL_CATALOG.reduce((acc, m) => {
    acc[m.name] = { price: m.price, unit: m.unit };
    return acc;
  }, {});

  function mineralMeta(mineral) {
    const m = String(mineral || "").trim();
    return MINERAL_MAP[m] || { price: 0, unit: "ton" };
  }
  function unitLabel(unit, qty) {
    const u = String(unit || "").toLowerCase();
    const n = Number(qty || 0);
    if (u === "ton") return n === 1 ? "Ton" : "Tons";
    if (u === "kg") return n === 1 ? "Kg" : "Kgs";
    if (u === "gram") return n === 1 ? "Gram" : "Grams";
    if (u === "ounce") return n === 1 ? "Ounce" : "Ounces";
    if (u === "m3") return "m3";
    if (u === "lb") return n === 1 ? "lb" : "lbs";
    return unit || "Unit";
  }

  const money = (n) =>
    "₦ " + Number(n || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 });
  const fmtMoney = (n) =>
    Number(n || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 });
  const fmtNum = (n) => Number(n || 0).toLocaleString("en-NG");

  // --- Face models
  let FACE_MODELS_READY = false;
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(
      "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights"
    ),
    faceapi.nets.faceLandmark68Net.loadFromUri(
      "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights"
    ),
    faceapi.nets.faceRecognitionNet.loadFromUri(
      "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights"
    ),
  ])
    .then(() => {
      FACE_MODELS_READY = true;
    })
    .catch(() => {
      FACE_MODELS_READY = false;
    });

  async function callBackend(payload) {
    if (!GOOGLE_SCRIPT_URL) return null;
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Backend Error:", error);
      return { result: "error", error: "Connection failed" };
    }
  }

  async function saveToGoogleSheet(sheetName, data, options) {
    const action = (options && options.action) || "save";
    const payload = { action, sheet: sheetName, data };
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {}
  }

  const translations = {
    en: {
      appTitle: "YOBE MINING DEVELOPMENT COMPANY",
      subtitle: "Developing State Solid Minerals & Empowering Mining Activities",
      welcome: "Welcome",
      portalEntry: "Enter Portal",
      adminLogin: "Staff Login",
      home: "Home",
      services: "Services",
      contact: "Contact",
      mdDashboard: "Executive Dashboard",
      registerArtisan: "Register as Artisan",
      idCard: "Verify / Download ID Card",
      renew: "Renew ID Card",
      formName: "Full Name",
      formPhone: "Phone Number",
      formLocation: "Mining Location / LGA",
      formMineral: "Mineral Type",
      formPhoto: "Photo (Upload or Snap)",
      snapPhoto: "Snap Photo",
      uploadPhoto: "Upload Photo",
      cameraTitle: "Snap Photo",
      cameraHint: "Position your face in the frame, then tap Capture.",
      capture: "Capture",
      retake: "Retake",
      usePhoto: "Use Photo",
      submit: "Submit",
      processing: "Processing...",
      success: "Successful!",
      downloadID: "Download ID Card",
      back: "Back",
      phoneError: "Phone number must be exactly 11 digits.",
      required: "This field is required.",
      logout: "Logout",
    },
    ha: {
      appTitle: "Kamfanin Hakar Ma'adinai na Jihar Yobe",
      subtitle: "Rungumar Ayyukan Hakar Ma'adinai",
      welcome: "Barka da zuwa",
      portalEntry: "Shiga Shafin",
      adminLogin: "Shiga na Ma'aikata",
      home: "Gida",
      services: "Ayyuka",
      contact: "Tuntube Mu",
      mdDashboard: "Babbar Allon Shugaba",
      registerArtisan: "Yi Rajistar 'Yan Haka",
      idCard: "Tabbatar / Sauke Katin ID",
      renew: "Sabunta Katin ID",
      formName: "Cikakken Suna",
      formPhone: "Lambar Waya",
      formLocation: "Wurin Haka / Karamar Hukuma",
      formMineral: "Nau'in Ma'adani",
      formPhoto: "Hoto (Saka ko Dauka)",
      snapPhoto: "Dauki Hoto",
      uploadPhoto: "Saka Hoto",
      cameraTitle: "Daukar Hoto",
      cameraHint: "Ka daidaita fuska a cikin firam, sannan ka danna Capture.",
      capture: "Capture",
      retake: "Sake Dauka",
      usePhoto: "Yi Amfani da Hoto",
      submit: "Aika",
      processing: "Ana Aiki...",
      success: "An Yi Nasara!",
      downloadID: "Sauke Katin ID",
      back: "Baya",
      phoneError: "Lambar waya dole ta kasance lamba 11.",
      required: "Ana bukatar wannan.",
      logout: "Fita",
    },
  };

  const LGAs = [
    "Damaturu",
    "Potiskum",
    "Nguru",
    "Gashua",
    "Geidam",
    "Buni Yadi",
    "Fika",
    "Nangere",
    "Jakusko",
    "Bade",
    "Bursari",
    "Fune",
    "Gulani",
    "Gujba",
    "Karasuwa",
    "Machina",
    "Tarmuwa",
    "Yusufari",
  ];

  const iso = (d) => new Date(d).toISOString().split("T")[0];
  const now = () => new Date();
  const addYears = (years) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + years);
    return d;
  };
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const todayISO = () => iso(new Date());
  const tryParseDateTime = (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };
  const hoursAgo = (d) => (Date.now() - d.getTime()) / (1000 * 60 * 60);

  let STAFF_LOCATION_INTERVAL = null;
  let MD_REFRESH_INTERVAL = null;

  // MD map instance
  let mdMap = null;
  let mdArtisanLayer = null;
  let mdStaffLayer = null;

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || "");
  const isStandalone = () =>
    window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
    window.navigator.standalone === true;

  window.state = {
    lang: "en",
    view: "landing",
    currentUserRole: null,
    isLoading: false,
    authSigningIn: false,
    error: null,
    editingId: null,

    ui: {
      mobileMenuOpen: false,
    },
    dialog: {
      open: false,
      title: "",
      message: "",
      mode: "alert",
      okText: "OK",
      cancelText: "Cancel",
      resolver: null,
    },

    pwa: {
      isIOS: isIOS(),
      isStandalone: isStandalone(),
      canInstall: false,
      iosHintDismissed: !!lsGet(LS_KEYS.pwaHintDismissed, false),
    },

    auth: { staffId: null, role: null, staffName: null, pin: null },

    staffLocStatus: {
      lastLoggedAt: null,
      lastEvent: null,
      lat: null,
      lng: null,
      accuracy: null,
      error: null,
    },

    md: {
      lastRefreshAt: null,
      artisansTotal: 0,
      scannedToday: 0,
      staffLatest: [],
      staffOnField: [],
      staffOnFieldCount: 0,
      revenueToday: 0,
      revenueLifetime: 0,
      revenueByMineral: {},
      revenueByStaff: {},
      revenueByLocation: {},
    },

    mdFilterLga: "All",
    mdSearch: "",

    exitLogModal: { open: false },
    exitForm: { id: "", quantity: "", mineral: "Gypsum" },
    qrScannerModal: { open: false },
    cameraModal: { open: false },
    cameraError: null,
    capturedPhoto: null,
    scannerContext: null,

    scannedQR: null,
    onSiteArtisans: [],

    exitLogs: [],
    staffLocations: [],
    scanLogs: [],

    adminSearch: "",
    applications: [],
    previewAppId: null,

    staffExitFilterDate: todayISO(),

    timeString: new Date().toLocaleTimeString(),

    formData: {
      name: "",
      phone: "",
      lga: LGAs[0],
      mineral: "Gypsum",
      photoURL: null,
    },

    generatedId: "",
    expiryDate: "",
    issueDate: "",
    searchResult: null,
    renewalStatus: null,
  };

  const state = window.state;
  const t = (key) =>
    (translations[state.lang] && translations[state.lang][key]) || key;
  const app = document.getElementById("app");

  // PWA install prompt (Android/Chrome) + iOS guidance.
  let deferredInstallPrompt = null;
  const escHtml = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  window.closeDialog = function (answer) {
    const resolver = state.dialog?.resolver;
    state.dialog.open = false;
    state.dialog.title = "";
    state.dialog.message = "";
    state.dialog.mode = "alert";
    state.dialog.okText = "OK";
    state.dialog.cancelText = "Cancel";
    state.dialog.resolver = null;
    render();
    if (typeof resolver === "function") resolver(!!answer);
  };

  window.showDialog = function (opts) {
    const o = opts || {};
    state.dialog.open = true;
    state.dialog.title = String(o.title || (o.mode === "confirm" ? "Confirm" : "Notice"));
    state.dialog.message = String(o.message || "");
    state.dialog.mode = o.mode === "confirm" ? "confirm" : "alert";
    state.dialog.okText = String(o.okText || "OK");
    state.dialog.cancelText = String(o.cancelText || "Cancel");
    state.dialog.resolver = typeof o.resolver === "function" ? o.resolver : null;
    render();
  };

  window.uiAlert = function (message, title) {
    window.showDialog({
      mode: "alert",
      title: title || "Notice",
      message: String(message || ""),
      okText: "OK",
    });
  };

  window.uiConfirm = function (message, title, okText, cancelText) {
    return new Promise((resolve) => {
      window.showDialog({
        mode: "confirm",
        title: title || "Confirm",
        message: String(message || ""),
        okText: okText || "Continue",
        cancelText: cancelText || "Cancel",
        resolver: resolve,
      });
    });
  };

  function refreshStandaloneFlags() {
    state.pwa.isStandalone = isStandalone();
  }

  try {
    const mm = window.matchMedia("(display-mode: standalone)");
    if (mm?.addEventListener) {
      mm.addEventListener("change", () => {
        refreshStandaloneFlags();
        render();
      });
    }
  } catch (e) {}

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    state.pwa.canInstall = true;
    render();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    state.pwa.canInstall = false;
    refreshStandaloneFlags();
    render();
  });

  window.installApp = async function () {
    refreshStandaloneFlags();
    if (state.pwa.isStandalone) return;
    if (state.ui) state.ui.mobileMenuOpen = false;

    if (state.pwa.isIOS) {
      uiAlert(
        'To install on iPhone/iPad: tap Share, then "Add to Home Screen".'
      );
      return;
    }

    if (!deferredInstallPrompt) {
      uiAlert(
        'Install prompt is not ready yet. Wait a few seconds and try again. If it still does not appear, open your browser menu and tap "Install app" or "Add to Home screen".'
      );
      return;
    }

    deferredInstallPrompt.prompt();
    try {
      await deferredInstallPrompt.userChoice;
    } catch (e) {}
    deferredInstallPrompt = null;
    state.pwa.canInstall = false;
    render();
  };

  window.dismissIOSInstallHint = function () {
    state.pwa.iosHintDismissed = true;
    lsSet(LS_KEYS.pwaHintDismissed, true);
    render();
  };

  // Live clock
  setInterval(() => {
    state.timeString = new Date().toLocaleTimeString();
    document
      .querySelectorAll(".live-time")
      .forEach((el) => (el.innerText = state.timeString));
  }, 1000);

  window.setView = function (view) {
    state.view = view;
    state.error = null;
    if (state.ui) state.ui.mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: "auto" });
    render();
  };

  window.toggleLang = function () {
    state.lang = state.lang === "en" ? "ha" : "en";
    if (state.ui) state.ui.mobileMenuOpen = false;
    render();
  };

  window.toggleMobileMenu = function (force) {
    if (!state.ui) state.ui = { mobileMenuOpen: false };
    if (typeof force === "boolean") state.ui.mobileMenuOpen = force;
    else state.ui.mobileMenuOpen = !state.ui.mobileMenuOpen;
    render();
  };

  window.scrollToContact = function () {
    if (state.ui && state.ui.mobileMenuOpen) {
      state.ui.mobileMenuOpen = false;
      render();
    }
    requestAnimationFrame(() => {
      const el = document.getElementById("contact-us");
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  };

  function normalizePhotoURL(url) {
    if (!url) return null;
    const u = String(url);
    if (u.startsWith("data:image")) return u;
    if (/^https?:\/\//i.test(u)) return u;
    if (/^[A-Za-z0-9+/=]+$/.test(u)) return "data:image/jpeg;base64," + u;
    return u;
  }

  function pickFirst(obj, keys) {
    if (!obj) return null;
    for (const k of keys || []) {
      const v = obj[k];
      if (v === undefined || v === null) continue;
      const s = String(v).trim();
      if (s) return v;
    }
    // Try case-insensitive match
    const lower = {};
    Object.keys(obj).forEach((k) => {
      lower[String(k).toLowerCase()] = k;
    });
    for (const k of keys || []) {
      const realKey = lower[String(k).toLowerCase()];
      if (!realKey) continue;
      const v = obj[realKey];
      if (v === undefined || v === null) continue;
      const s = String(v).trim();
      if (s) return v;
    }
    return null;
  }

  function normalizeDriveUrlMaybe(url) {
    const u = String(url || "").trim();
    if (!u) return "";

    // drive.google.com/file/d/<ID>/view
    const m1 = u.match(/drive\.google\.com\/file\/d\/([^/]+)\//i);
    if (m1 && m1[1]) return "https://drive.google.com/uc?export=view&id=" + m1[1];

    // drive.google.com/open?id=<ID>
    const m2 = u.match(/drive\.google\.com\/open\?id=([^&]+)/i);
    if (m2 && m2[1]) return "https://drive.google.com/uc?export=view&id=" + m2[1];

    // drive.google.com/uc?...id=<ID>
    const m3 = u.match(/drive\.google\.com\/uc\?(?:.*&)?id=([^&]+)/i);
    if (m3 && m3[1]) return "https://drive.google.com/uc?export=view&id=" + m3[1];

    // If it's already a uc link but uses export=download, prefer export=view (better for <img>)
    if (/drive\.google\.com\/uc\?/i.test(u) && /export=download/i.test(u)) {
      return u.replace(/export=download/gi, "export=view");
    }

    return u;
  }

  function resolvePhotoFromRecord(rec, fallbackUrl) {
    const raw = pickFirst(rec, [
      "photoDataUrl",
      "photoDataURL",
      "PhotoDataUrl",
      "PhotoDataURL",
      "passportDataUrl",
      "passportDataURL",
      "PassportDataUrl",
      "PassportDataURL",
      "photoThumb",
      "photoThumbnail",
      "PhotoThumb",
      "PhotoThumbnail",
      "photoURL",
      "PhotoURL",
      "photoUrl",
      "PhotoUrl",
      "photo",
      "Photo",
      "passport",
      "Passport",
      "passportPhoto",
      "PassportPhoto",
      "image",
      "Image",
      "imageUrl",
      "ImageUrl",
    ]);
    const normalized = normalizePhotoURL(normalizeDriveUrlMaybe(raw));
    return normalized || fallbackUrl || null;
  }

  function hydrateQrCodes(root) {
    const scope = root || document;
    const nodes = Array.from(scope.querySelectorAll("[data-qr-text]"));
    if (!nodes.length) return;

    // qrcodejs exposes global QRCode
    if (typeof window.QRCode !== "function") {
      nodes.forEach((el) => {
        if (el.dataset.qrReady === "1") return;
        el.dataset.qrReady = "1";
        el.innerHTML =
          '<div class="w-full h-full flex items-center justify-center text-[9px] font-mono text-gray-400">QR</div>';
      });
      return;
    }

    nodes.forEach((el) => {
      const text = String(el.dataset.qrText || "").trim();
      if (!text) return;
      if (el.dataset.qrReady === "1") return;
      el.dataset.qrReady = "1";
      el.innerHTML = "";

      try {
        // Render a small QR (no external requests => html2canvas-safe)
        // eslint-disable-next-line no-new
        new window.QRCode(el, {
          text,
          width: 56,
          height: 56,
          correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : undefined,
        });
      } catch (e) {
        el.innerHTML =
          '<div class="w-full h-full flex items-center justify-center text-[9px] font-mono text-gray-400">QR</div>';
      }
    });
  }

  async function compressPhotoDataUrl(dataUrl) {
    const src = String(dataUrl || "");
    if (!src.startsWith("data:image")) return src;

    const img = new Image();
    img.src = src;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });

    if (!img.naturalWidth || !img.naturalHeight) return src;

    const targets = [320, 280, 240, 200, 160];
    const qualities = [0.82, 0.76, 0.7];
    const maxLen = 48000; // keep under Google Sheets 50k cell limit

    for (const size of targets) {
      const scale = size / Math.max(img.naturalWidth, img.naturalHeight);
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));

      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      for (const q of qualities) {
        const out = c.toDataURL("image/jpeg", q);
        if (out.length <= maxLen) return out;
      }
    }

    // As a last resort, return original (may fail to save in Sheets if too large)
    return src;
  }

  function persistLocal() {
    lsSet(LS_KEYS.artisans, state.applications);
    lsSet(LS_KEYS.exitLogs, state.exitLogs);
    lsSet(LS_KEYS.staffLocs, state.staffLocations);
    lsSet(LS_KEYS.scanLogs, state.scanLogs);
  }

  function hydrateLocal() {
    state.applications = safeArray(lsGet(LS_KEYS.artisans, []));
    state.exitLogs = safeArray(lsGet(LS_KEYS.exitLogs, []));
    state.staffLocations = safeArray(lsGet(LS_KEYS.staffLocs, []));
    state.scanLogs = safeArray(lsGet(LS_KEYS.scanLogs, []));
  }

  // =========================
  // Load artisans (miners)
  // =========================
  async function loadApplications() {
    // Local first
    hydrateLocal();

    state.isLoading = true;
    render();

    try {
      const artisans = await callBackend({ action: "readSheet", sheet: "Artisans" });
      const raw = [];
      if (
        artisans &&
        artisans.result === "success" &&
        Array.isArray(artisans.data)
      ) {
        raw.push(
          ...artisans.data.map((d) => ({
            ...d,
            type: "Artisan",
            id: d.id || d.ID || d.Id || d.artisanId || d.ArtisanId || "",
            name: d.name || d.Full_Name || d.fullName || "—",
            phone: d.phone || d.Phone || "",
            location: d.location || d.lga || d.LGA || "—",
            mineral: d.mineral || d.Mineral || "—",
            status: d.status || d.Status || "Pending",
            paymentStatus: d.paymentStatus || d.PaymentStatus || "Unpaid",
            paidAmount: d.paidAmount || d.PaidAmount || 0,
            fee: d.fee || d.Fee || 0,
            photoURL: resolvePhotoFromRecord(d, null),
            expiryDate: d.expiryDate || d.ExpiryDate || d.expiry || null,
            issueDate: d.issueDate || d.IssueDate || null,
            lat: d.lat ?? d.Lat ?? null,
            lng: d.lng ?? d.Lng ?? d.lon ?? d.Lon ?? null,
            locationCapturedAt:
              d.locationCapturedAt || d.LocationCapturedAt || null,
          }))
        );
      }

      const cleaned = raw.filter(
        (x) => String(x.deleted || x.Deleted || "").toLowerCase() !== "true"
      );

      // merge backend into local by id
      const merged = new Map();
      safeArray(state.applications).forEach((a) => {
        if (a && a.id) merged.set(String(a.id), a);
      });
      cleaned.forEach((a) => {
        if (a && a.id) merged.set(String(a.id), a);
      });

      state.applications = Array.from(merged.values())
        .filter((x) => x && x.id)
        .sort((a, b) => {
          return b.id && a.id ? String(b.id).localeCompare(String(a.id)) : 0;
        });

      persistLocal();
      state.md.artisansTotal = state.applications.length;
    } catch (e) {
      console.error("Error loading data", e);
      state.md.artisansTotal = state.applications.length;
    }

    state.isLoading = false;
    render();
  }

  // =========================
  // Load Exit Logs
  // =========================
  async function loadExitLogs() {
    hydrateLocal();

    try {
      const exitLogs = await callBackend({ action: "readSheet", sheet: "ExitLogs" });
      const exitRows =
        exitLogs && exitLogs.result === "success" && Array.isArray(exitLogs.data)
          ? exitLogs.data
          : [];
      if (exitRows.length) {
        const existing = safeArray(state.exitLogs);
        const key = (r) => {
          const t = String(r.time || r.Time || r.timestamp || r.timeISO || r.timeLocal || "");
          const id = String(r.id || r.ID || "");
          const m = String(r.mineral || r.Mineral || "");
          const s = String(r.staffName || r.staffId || r.StaffName || r.StaffId || "");
          return [t, id, m, s].join("|");
        };
        const merged = new Map();
        existing.forEach((r) => merged.set(key(r), r));
        exitRows.forEach((r) => merged.set(key(r), r));
        state.exitLogs = Array.from(merged.values()).sort((a, b) => {
          const da = tryParseDateTime(a.time || a.Time || a.timeLocal);
          const db = tryParseDateTime(b.time || b.Time || b.timeLocal);
          return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
        });
        persistLocal();
      }
    } catch (e) {
      console.error("ExitLogs load error", e);
    }
  }

  // =========================
  // Staff location logging + persistence
  // =========================
  function getGeoPosition(options) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        return reject(new Error("Geolocation not supported"));
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        options || {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    });
  }

  async function logStaffLocation(eventType, opts) {
    const staffId = String(state.auth.staffId || "").trim() || "UNKNOWN";
    if (!staffId) return;
    const silent = !!(opts && opts.silent);

    try {
      state.staffLocStatus.error = null;

      const pos = await getGeoPosition();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;

      const payload = {
        staffId,
        staffName: state.auth.staffName || staffId,
        staffPin: state.auth.pin || "",
        role: state.auth.role || state.currentUserRole || "staff",
        event: eventType || "heartbeat",
        lat,
        lng,
        accuracy,
        time: new Date().toISOString(),
        timeLocal: new Date().toLocaleString(),
      };

      state.staffLocStatus = {
        lastLoggedAt: payload.time,
        lastEvent: payload.event,
        lat,
        lng,
        accuracy,
        error: null,
      };

      state.staffLocations = safeArray(state.staffLocations);
      state.staffLocations.push(payload);
      if (state.staffLocations.length > 2000)
        state.staffLocations = state.staffLocations.slice(-2000);

      persistLocal();
      await saveToGoogleSheet("StaffLocations", payload, { action: "append" });
      if (!silent) render();
    } catch (err) {
      console.error("Location log error:", err);
      state.staffLocStatus.error = "Location permission denied / unavailable.";
      if (!silent) render();
    }
  }

  function startStaffLocationTracking(opts) {
    stopStaffLocationTracking();
    logStaffLocation("login", opts);
    STAFF_LOCATION_INTERVAL = setInterval(
      () => logStaffLocation("heartbeat_4hr"),
      4 * 60 * 60 * 1000
    );
  }

  function stopStaffLocationTracking() {
    if (STAFF_LOCATION_INTERVAL) clearInterval(STAFF_LOCATION_INTERVAL);
    STAFF_LOCATION_INTERVAL = null;
  }

  // =========================
  // Revenue analytics
  // =========================
  function uniqTodayScanCount(scanRows) {
    const today = todayISO();
    const ids = new Set();
    (scanRows || []).forEach((r) => {
      const dt = tryParseDateTime(r.time || r.timeISO || r.timestamp || r.Time || r.timeLocal);
      if (!dt) return;
      if (iso(dt) !== today) return;
      const id = String(r.id || "").trim();
      if (id) ids.add(id);
    });
    return ids.size;
  }

  function reduceLatestStaffLocations(staffRows) {
    const latest = new Map();
    (staffRows || []).forEach((r) => {
      const staffId = String(r.staffId || r.StaffId || r.staff || "").trim();
      if (!staffId) return;
      const dt = tryParseDateTime(r.time || r.timeISO || r.timestamp || r.Time || r.timeLocal);
      if (!dt) return;

      const prev = latest.get(staffId);
      if (!prev || dt.getTime() > prev._dt.getTime()) {
        latest.set(staffId, {
          staffId,
          role: r.role || r.Role || "staff",
          lat: Number(r.lat || r.Lat || 0),
          lng: Number(r.lng || r.Lng || r.lon || r.Lon || 0),
          accuracy: Number(r.accuracy || r.Accuracy || 0),
          event: r.event || r.Event || "",
          time: r.time || r.timeISO || r.timestamp || r.Time || "",
          timeLocal: r.timeLocal || r.TimeLocal || "",
          _dt: dt,
        });
      }
    });
    return Array.from(latest.values()).sort((a, b) => b._dt.getTime() - a._dt.getTime());
  }

  function computeStaffOnField(latestArr) {
    return (latestArr || []).filter((x) => {
      const dt = x._dt || tryParseDateTime(x.time || x.timeLocal);
      return dt ? hoursAgo(dt) <= 6 : false;
    });
  }

  function getExitRevenue(r) {
    const rev = Number(r.revenue || r.Revenue || r.totalRevenue || r.TotalRevenue || 0);
    if (isFinite(rev) && rev) return rev;

    const unitPrice = Number(r.unitPrice || r.UnitPrice || 0);
    const qty = Number(r.quantity || r.Quantity || 0);
    if (unitPrice && qty) return unitPrice * qty;
    return 0;
  }

  function computeRevenueAnalytics(exitRows) {
    const today = todayISO();
    let totalToday = 0;
    let totalLifetime = 0;
    const byMineral = {};
    const byStaff = {};
    const byLocation = {};

    (exitRows || []).forEach((r) => {
      const rev = getExitRevenue(r);
      totalLifetime += rev;

      const dt = tryParseDateTime(r.time || r.timeISO || r.timestamp || r.Time || r.timeLocal);
      if (dt && iso(dt) === today) totalToday += rev;

      const mineral = String(r.mineral || r.Mineral || "Unknown").trim() || "Unknown";
      byMineral[mineral] = (byMineral[mineral] || 0) + rev;

      const staff = String(r.staffName || r.StaffName || r.staffId || r.StaffId || "Unknown").trim() || "Unknown";
      byStaff[staff] = (byStaff[staff] || 0) + rev;

      const artisanId = String(r.id || r.ID || "").trim();
      const artisan = state.applications.find((a) => a.id === artisanId);
      const location = artisan ? artisan.location || artisan.lga || "Unknown" : "Unknown";
      byLocation[location] = (byLocation[location] || 0) + rev;
    });

    return { totalToday, totalLifetime, byMineral, byStaff, byLocation };
  }

  async function loadMDData() {
    hydrateLocal();

    try {
      const [scanLogs, exitLogs, staffLocs] = await Promise.all([
        callBackend({ action: "readSheet", sheet: "ScanLogs" }),
        callBackend({ action: "readSheet", sheet: "ExitLogs" }),
        callBackend({ action: "readSheet", sheet: "StaffLocations" }),
      ]);

      const scanRows =
        scanLogs && scanLogs.result === "success" && Array.isArray(scanLogs.data)
          ? scanLogs.data
          : safeArray(state.scanLogs);
      const exitRows =
        exitLogs && exitLogs.result === "success" && Array.isArray(exitLogs.data)
          ? exitLogs.data
          : safeArray(state.exitLogs);
      const staffRows =
        staffLocs && staffLocs.result === "success" && Array.isArray(staffLocs.data)
          ? staffLocs.data
          : safeArray(state.staffLocations);

      // Merge fetched into local mirrors
      if (scanRows && scanRows.length) state.scanLogs = scanRows;
      if (exitRows && exitRows.length) state.exitLogs = exitRows;
      if (staffRows && staffRows.length) state.staffLocations = staffRows;
      persistLocal();

      state.md.artisansTotal = state.applications.length;
      state.md.scannedToday = uniqTodayScanCount(scanRows);

      const latest = reduceLatestStaffLocations(staffRows);
      state.md.staffLatest = latest;

      const onField = computeStaffOnField(latest);
      state.md.staffOnField = onField;
      state.md.staffOnFieldCount = onField.length;

      const analytics = computeRevenueAnalytics(exitRows);
      state.md.revenueToday = analytics.totalToday;
      state.md.revenueLifetime = analytics.totalLifetime;
      state.md.revenueByMineral = analytics.byMineral;
      state.md.revenueByStaff = analytics.byStaff;
      state.md.revenueByLocation = analytics.byLocation;

      state.md.lastRefreshAt = new Date().toISOString();
      render();
    } catch (e) {
      console.error("MD data load error", e);

      // fallback analytics from local
      state.md.artisansTotal = state.applications.length;
      state.md.scannedToday = uniqTodayScanCount(state.scanLogs);

      const latest = reduceLatestStaffLocations(state.staffLocations);
      state.md.staffLatest = latest;

      const onField = computeStaffOnField(latest);
      state.md.staffOnField = onField;
      state.md.staffOnFieldCount = onField.length;

      const analytics = computeRevenueAnalytics(state.exitLogs);
      state.md.revenueToday = analytics.totalToday;
      state.md.revenueLifetime = analytics.totalLifetime;
      state.md.revenueByMineral = analytics.byMineral;
      state.md.revenueByStaff = analytics.byStaff;
      state.md.revenueByLocation = analytics.byLocation;

      state.md.lastRefreshAt = new Date().toISOString();
      render();
    }
  }

  function startMDRefreshLoop() {
    stopMDRefreshLoop();
    loadMDData();
    MD_REFRESH_INTERVAL = setInterval(() => {
      if (state.currentUserRole === "md" && state.view === "md-dashboard") loadMDData();
    }, 60 * 1000);
  }
  function stopMDRefreshLoop() {
    if (MD_REFRESH_INTERVAL) clearInterval(MD_REFRESH_INTERVAL);
    MD_REFRESH_INTERVAL = null;
  }

  // =========================
  // ID / QR helpers
  // =========================
  function enforceArtisanOnly(id) {
    const cleaned = String(id || "").trim().toUpperCase();
    return cleaned.startsWith("ART-");
  }

  function extractArtisanId(raw) {
    const s = String(raw || "").trim();
    if (!s) return "";
    if (/^ART-\d{6}$/i.test(s)) return s.toUpperCase();
    const m = s.match(/ART-\d{6}/i);
    if (m && m[0]) return m[0].toUpperCase();
    const m2 = s.match(/ID:\s*(ART-\d{6})/i);
    if (m2 && m2[1]) return m2[1].toUpperCase();
    return "";
  }

  function resetForm() {
    state.formData = { name: "", phone: "", lga: LGAs[0], mineral: "Gypsum", photoURL: null };
    state.capturedPhoto = null;
    state.cameraError = null;
    state.error = null;
    state.editingId = null;
  }

  window.openRegisterMiner = function () {
    resetForm();
    state.generatedId = "";
    state.searchResult = null;
    window.setView("artisan-form");
  };

  // =========================
  // Status + Renew (kept)
  // =========================
  window.checkStatus = async function () {
    const input = document.getElementById("status-input").value.trim();
    const btn = document.getElementById("status-btn");
    const msgEl = document.getElementById("status-msg");

    if (!input) {
      msgEl.innerText = "Please enter an ID.";
      msgEl.className = "text-red-500 text-sm mt-2";
      return;
    }
    if (!enforceArtisanOnly(input)) {
      msgEl.innerText = "Only Artisan IDs (ART-xxxxxx) are supported at the moment.";
      msgEl.className = "text-red-600 text-sm mt-2 font-bold";
      return;
    }

    btn.innerText = "Checking...";
    msgEl.innerText = "";

    // Prefer local match, then backend
    const local = state.applications.find(
      (a) => String(a.id || "").toUpperCase() === input.toUpperCase()
    );
    if (local) {
      state.searchResult = local;
      state.generatedId = local.id;
      state.formData.name = local.name || "";
      state.formData.lga = local.location || local.lga || LGAs[0];
      state.formData.mineral = local.mineral || "Gypsum";
      state.formData.photoURL = resolvePhotoFromRecord(local, ASSETS.miningLogo);
      state.expiryDate = local.expiryDate ? new Date(local.expiryDate) : addYears(1);
      btn.innerText = "Check";
      window.setView("search-success");
      return;
    }

    const result = await callBackend({ action: "search", id: input });
    btn.innerText = "Check";

    if (result && result.result === "success") {
      const d = result.data || {};
      state.searchResult = d;

      state.generatedId =
        pickFirst(d, ["id", "ID", "Id"]) || input.toUpperCase();
      state.formData.name =
        pickFirst(d, ["name", "Name", "fullName", "Full_Name", "Full Name"]) || "";
      state.formData.lga =
        pickFirst(d, ["location", "Location", "lga", "LGA"]) || LGAs[0];
      state.formData.mineral =
        pickFirst(d, ["mineral", "Mineral"]) || "Gypsum";
      state.formData.photoURL = resolvePhotoFromRecord(d, ASSETS.miningLogo);
      const expRaw = pickFirst(d, ["expiryDate", "ExpiryDate", "expiry", "Expiry"]);
      state.expiryDate = expRaw ? new Date(expRaw) : addYears(1);

      window.setView("search-success");
    } else {
      msgEl.innerText = "Record not found. Please verify the ID.";
      msgEl.className = "text-red-500 text-sm mt-2 font-bold";
    }
  };

  window.checkRenew = async function () {
    const input = document.getElementById("renew-input").value.trim();
    const btn = document.getElementById("renew-btn");
    const msgEl = document.getElementById("renew-msg");

    if (!input) {
      msgEl.innerText = "Please enter ID.";
      msgEl.className = "text-red-500 text-sm mt-2";
      return;
    }
    if (!enforceArtisanOnly(input)) {
      msgEl.innerText = "Only Artisan IDs (ART-xxxxxx) can be renewed right now.";
      msgEl.className = "text-red-600 text-sm mt-2 font-bold";
      return;
    }

    btn.innerText = "Checking...";
    msgEl.innerText = "";

    const local = state.applications.find(
      (a) => String(a.id || "").toUpperCase() === input.toUpperCase()
    );
    if (local) {
      const expiry = local.expiryDate ? new Date(local.expiryDate) : new Date();
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const paymentStatus = local.paymentStatus || "Unpaid";
      const paymentNeeded = diffDays < 90 && String(paymentStatus).toLowerCase() !== "paid";

      state.renewalStatus = { needed: paymentNeeded, daysRemaining: diffDays, data: local };
      btn.innerText = "Proceed";
      window.setView("renewal-details");
      return;
    }

    const result = await callBackend({ action: "search", id: input });

    if (result && result.result === "success") {
      const data = result.data;
      const expRaw = pickFirst(data, ["expiryDate", "ExpiryDate", "expiry", "Expiry"]);
      const expiry = expRaw ? new Date(expRaw) : new Date();
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const paymentStatus = pickFirst(data, ["paymentStatus", "PaymentStatus"]) || "Unpaid";
      const paymentNeeded = diffDays < 90 && String(paymentStatus).toLowerCase() !== "paid";

      state.renewalStatus = { needed: paymentNeeded, daysRemaining: diffDays, data };
      btn.innerText = "Proceed";
      window.setView("renewal-details");
    } else {
      btn.innerText = "Proceed";
      msgEl.innerText = "Record not found.";
      msgEl.className = "text-red-500 text-sm mt-2 font-bold";
    }
  };

  window.recordPayment = async function () {
    const data = state.renewalStatus && state.renewalStatus.data;
    if (!data) return;

    const confirmed = await uiConfirm(
      "Confirm that you have transferred the funds? This will log a payment record.",
      "Confirm Payment",
      "Confirm",
      "Cancel"
    );
    if (!confirmed) return;

    const amount = 20000;
    const updatedData = {
      ...data,
      paymentStatus: "Paid",
      paidAmount: amount,
      expiryDate: iso(addYears(1)),
      lastPaymentDate: iso(now()),
      staffAction: "RenewalPayment",
      timestamp: new Date().toLocaleString(),
    };

    // update local if exists
    const idx = state.applications.findIndex((a) => a.id === updatedData.id);
    if (idx >= 0) state.applications[idx] = { ...state.applications[idx], ...updatedData };
    persistLocal();

    await saveToGoogleSheet("Artisans", updatedData);
    uiAlert("Payment recorded! Your ID is now valid.", "Payment Successful");
    window.setView("miner-portal");

    if (state.currentUserRole === "md") {
      await loadApplications();
      await loadMDData();
    }
  };

  // =========================
  // QR Scanner
  // =========================
  window.openQRScanner = function (context = "global") {
    state.scannerContext = context;
    state.qrScannerModal.open = true;
    state.scannedQR = null;
    render();
    setTimeout(() => startQRScanner(), 120);
  };
  window.closeQRScanner = function () {
    state.qrScannerModal.open = false;
    state.scannedQR = null;
    stopQRScanner();
    render();
  };

  let qrVideo = null;
  let qrCanvas = null;
  let qrInterval = null;

  async function startQRScanner() {
    qrVideo = document.getElementById("qr-video");
    qrCanvas = document.getElementById("qr-canvas");
    if (!qrVideo || !qrCanvas) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      qrVideo.srcObject = stream;
      qrVideo.setAttribute("playsinline", "true");
      qrVideo.muted = true;
      await qrVideo.play();

      if (qrInterval) clearInterval(qrInterval);
      qrInterval = setInterval(scanQR, 140);
    } catch (err) {
      console.error(err);
      uiAlert("Camera access denied or unavailable.");
      window.closeQRScanner();
    }
  }

  function scanQR() {
    if (!qrVideo || !qrCanvas) return;
    if (qrVideo.readyState !== qrVideo.HAVE_ENOUGH_DATA) return;

    qrCanvas.height = qrVideo.videoHeight;
    qrCanvas.width = qrVideo.videoWidth;

    const ctx = qrCanvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(qrVideo, 0, 0, qrCanvas.width, qrCanvas.height);

    const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code || !code.data) return;

    state.scannedQR = code.data;
    const parsedId = extractArtisanId(code.data);
    if (!parsedId) return;

    if (state.scannerContext === "exitLog") {
      state.exitForm.id = parsedId;
      window.closeQRScanner();
      setTimeout(updateExitRevenuePreview, 50);
      return;
    }

    if (!state.onSiteArtisans.includes(parsedId)) state.onSiteArtisans.push(parsedId);

    const scanPayload = {
      id: parsedId,
      raw: code.data,
      time: new Date().toISOString(),
      timeLocal: new Date().toLocaleString(),
      staffId: state.auth.staffId || "",
      staffName: state.auth.staffName || "",
      staffPin: state.auth.pin || "",
    };

    state.scanLogs = safeArray(state.scanLogs);
    state.scanLogs.push(scanPayload);
    if (state.scanLogs.length > 3000) state.scanLogs = state.scanLogs.slice(-3000);
    persistLocal();

    saveToGoogleSheet("ScanLogs", scanPayload, { action: "append" });

    uiAlert("ID " + parsedId + " scanned.", "Scan Success");
    if (state.currentUserRole === "md") loadMDData();
    window.closeQRScanner();
  }

  function stopQRScanner() {
    if (qrInterval) clearInterval(qrInterval);
    qrInterval = null;
    try {
      if (qrVideo && qrVideo.srcObject)
        qrVideo.srcObject.getTracks().forEach((track) => track.stop());
    } catch (e) {}
    qrVideo = null;
    qrCanvas = null;
  }

  // =========================
  // Camera capture
  // =========================
  let camStream = null;

  window.openCamera = function () {
    state.cameraError = null;
    state.capturedPhoto = null;
    state.cameraModal.open = true;
    render();
    setTimeout(() => startCamera(), 160);
  };

  window.closeCamera = function () {
    state.cameraModal.open = false;
    state.cameraError = null;
    state.capturedPhoto = null;
    stopCamera();
    render();
  };

  async function startCamera() {
    try {
      const v = document.getElementById("cam-video");
      if (!v) return;
      stopCamera();

      camStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });

      v.srcObject = camStream;
      v.setAttribute("playsinline", "true");
      await v.play();
    } catch (err) {
      console.error(err);
      state.cameraError = "Camera access denied or unavailable.";
      render();
    }
  }

  function stopCamera() {
    if (camStream) {
      try {
        camStream.getTracks().forEach((t) => t.stop());
      } catch (e) {}
    }
    camStream = null;
  }

  window.capturePhoto = async function () {
    const v = document.getElementById("cam-video");
    const c = document.getElementById("cam-canvas");
    if (!v || !c) return;

    const size = Math.min(v.videoWidth || 720, v.videoHeight || 720);
    const sx = Math.max(0, ((v.videoWidth || size) - size) / 2);
    const sy = Math.max(0, ((v.videoHeight || size) - size) / 2);

    c.width = 720;
    c.height = 720;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, sx, sy, size, size, 0, 0, c.width, c.height);

    const dataUrl = c.toDataURL("image/jpeg", 0.92);

    if (FACE_MODELS_READY) {
      const img = new Image();
      img.src = dataUrl;
      await new Promise((r) => (img.onload = r));

      const detections = await faceapi
        .detectAllFaces(
          img,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
        )
        .withFaceLandmarks();

      if (!detections || detections.length === 0) {
        state.cameraError = "No face detected. Please retake.";
        state.capturedPhoto = null;
        render();
        return;
      }
    }

    state.cameraError = null;
    state.capturedPhoto = await compressPhotoDataUrl(dataUrl);
    render();
  };

  window.useCapturedPhoto = function () {
    if (!state.capturedPhoto) return;
    state.formData.photoURL = state.capturedPhoto; // base64 stored correctly
    window.closeCamera();
  };

  window.retakePhoto = function () {
    state.cameraError = null;
    state.capturedPhoto = null;
    render();
  };

  window.handlePhotoUpload = async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
      const base64Data = e.target.result; // data:image/... base64 (correct for ID rendering)
      const img = new Image();
      img.src = base64Data;
      await new Promise((r) => (img.onload = r));

      if (FACE_MODELS_READY) {
        const detections = await faceapi
          .detectAllFaces(
            img,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
          )
          .withFaceLandmarks();

        if (!detections || detections.length === 0) {
          state.error = "No face detected. Please upload a clear photo.";
          render();
          setTimeout(() => {
            state.error = null;
            render();
          }, 3000);
          return;
        }
      }

      state.formData.photoURL = await compressPhotoDataUrl(base64Data);
      render();
    };
    reader.readAsDataURL(file);
  };

  // =========================
  // Exit log (auto revenue)
  // =========================
  window.openExitLog = function () {
    state.exitForm = state.exitForm || { id: "", quantity: "", mineral: "Gypsum" };
    if (!MINERAL_MAP[state.exitForm.mineral]) {
      state.exitForm.mineral = MINERAL_NAMES[0] || "Gypsum";
    }
    state.exitLogModal.open = true;
    render();
    setTimeout(updateExitRevenuePreview, 50);
  };
  window.closeExitLog = function () {
    state.exitLogModal.open = false;
    render();
  };

  function updateExitRevenuePreview() {
    const qty = Number(String(state.exitForm?.quantity ?? "").replace(/,/g, "")) || 0;
    const mineral = String(state.exitForm?.mineral || "");

    const meta = mineralMeta(mineral);
    const unit = meta.unit;
    const unitPrice = meta.price;
    const revenue = qty * unitPrice;

    const unitEl = document.getElementById("exit-unit-display");
    const unitHidden = document.getElementById("exit-unit");
    const pEl = document.getElementById("price-per-unit");
    const rEl = document.getElementById("est-rev");

    if (unitEl) unitEl.innerText = unitLabel(unit, qty);
    if (unitHidden) unitHidden.value = unit;
    if (pEl)
      pEl.innerText = unitPrice ? money(unitPrice) + " / " + unitLabel(unit, 1) : "—";
    if (rEl) rEl.innerText = revenue && isFinite(revenue) ? money(revenue) : "—";
  }
  window.updateExitRevenuePreview = updateExitRevenuePreview;

  window.submitExitLog = async function () {
    const id = String(state.exitForm?.id || "").trim().toUpperCase();
    const qtyRaw = String(state.exitForm?.quantity ?? "").trim();
    const qty = Number(qtyRaw.replace(/,/g, ""));
    const mineral = String(state.exitForm?.mineral || "").trim();

    const meta = mineralMeta(mineral);
    const unitPrice = Number(meta.price || 0);
    const fixedUnit = meta.unit;

    if (!id) {
      uiAlert("Artisan ID is required.");
      return;
    }
    if (!mineral) {
      uiAlert("Mineral type is required.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      uiAlert("Quantity must be greater than 0.");
      return;
    }
    if (!enforceArtisanOnly(id)) {
      uiAlert("Exit Log ID must be an Artisan ID (ART-xxxxxx).");
      return;
    }
    if (!unitPrice) {
      uiAlert("Selected mineral has no configured price.");
      return;
    }

    const revenue = qty * unitPrice;

    const logData = {
      id,
      mineral,
      quantity: qty,
      unit: fixedUnit,
      unitPrice,
      revenue,
      time: new Date().toISOString(),
      timeLocal: new Date().toLocaleString(),
      staffId: state.auth.staffId || "",
      staffName: state.auth.staffName || state.auth.staffId || "",
      staffPin: state.auth.pin || "",
    };

    state.exitLogs = safeArray(state.exitLogs);
    state.exitLogs.push(logData);
    if (state.exitLogs.length > 5000) state.exitLogs = state.exitLogs.slice(-5000);
    persistLocal();

    const btn = document.querySelector("#exit-submit-btn");
    if (btn) btn.innerHTML = "Sending...";

    await saveToGoogleSheet("ExitLogs", logData, { action: "append" });
    state.exitLogModal.open = false;

    if (state.currentUserRole === "md") {
      await loadMDData();
    } else {
      await loadExitLogs();
    }

    render();
  };

  // =========================
  // Admin tools
  // =========================
  window.handleAdminSearch = function (event) {
    state.adminSearch = (event.target.value || "").toLowerCase();
    render();
  };

  window.handleMDSearch = function (event) {
    state.mdSearch = (event.target.value || "").toLowerCase();
    render();
  };

  window.setMDLgaFilter = function (val) {
    state.mdFilterLga = val || "All";
    render();
  };

  window.setStaffExitFilterDate = function (val) {
    state.staffExitFilterDate = val || "";
    render();
  };

  window.viewApplication = function (id) {
    state.previewAppId = id;
    render();
  };
  window.closePreview = function () {
    state.previewAppId = null;
    render();
  };

  window.deleteApplication = async function (id) {
    const confirmed = await uiConfirm(
      "Are you sure you want to delete this record? This action cannot be undone.",
      "Delete Record",
      "Delete",
      "Cancel"
    );
    if (!confirmed)
      return;

    const existing = state.applications.find((a) => a.id === id);
    state.applications = state.applications.filter((a) => a.id !== id);
    persistLocal();
    render();

    const res = await callBackend({ action: "delete", sheet: "Artisans", id });
    if (!res || res.result !== "success") {
      if (existing) {
        await saveToGoogleSheet("Artisans", {
          ...existing,
          deleted: true,
          deletedAt: new Date().toISOString(),
          staffAction: "Delete",
          timestamp: new Date().toLocaleString(),
        });
      }
    }

    uiAlert("Record deleted (or flagged) for: " + id, "Delete Complete");
    if (state.currentUserRole === "md") {
      await loadApplications();
      await loadMDData();
    }
  };

  window.editApplication = function (id) {
    const a = state.applications.find((x) => x.id === id);
    if (!a) return;
    state.editingId = id;
    state.formData.name = a.name || "";
    state.formData.lga = a.location || LGAs[0];
    state.formData.mineral = a.mineral || "Gypsum";
    state.formData.photoURL = normalizePhotoURL(a.photoURL || null);
    state.formData.phone = a.phone || "08000000000";
    window.setView("artisan-form");
  };

  window.updateStatus = async function (id, newStatus) {
    const a = state.applications.find((x) => x.id === id);
    if (!a) return;
    a.status = newStatus;
    if (newStatus === "Approved") {
      a.issueDate = a.issueDate || iso(now());
      a.expiryDate = a.expiryDate || iso(addYears(1));
      a.fee = a.fee || 20000;
    }
    persistLocal();
    await saveToGoogleSheet("Artisans", {
      ...a,
      status: newStatus,
      staffAction: "StatusUpdate",
      timestamp: new Date().toLocaleString(),
    });
    uiAlert("Record " + id + " status updated to " + newStatus, "Status Updated");

    if (state.currentUserRole === "md") {
      await loadApplications();
      await loadMDData();
    }
    render();
  };

  function validateArtisanForm() {
    const errors = [];
    const name = String(state.formData.name || "").trim();
    const phone = String(state.formData.phone || "");
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    if (cleanPhone.length !== 11) errors.push(t("phoneError"));
    if (!name) errors.push(t("required"));
    if (!state.formData.photoURL) errors.push("Passport photo is required.");
    return errors;
  }

  window.submitForm = async function () {
    const errors = validateArtisanForm();
    if (errors.length > 0) {
      state.error = errors.join(" | ");
      render();
      return;
    }

    state.isLoading = true;
    render();

    if (state.editingId) {
      const idx = state.applications.findIndex((a) => a.id === state.editingId);
      if (idx !== -1) {
        const original = state.applications[idx];
        const updatedApp = {
          ...original,
          type: "Artisan",
          name: state.formData.name,
          location: state.formData.lga,
          mineral: state.formData.mineral,
          photoURL: normalizePhotoURL(state.formData.photoURL),
          phone: state.formData.phone,
          updatedAt: new Date().toISOString(),
        };
        state.applications[idx] = updatedApp;
        persistLocal();
        await saveToGoogleSheet("Artisans", updatedApp);
      }

      setTimeout(() => {
        state.isLoading = false;
        state.editingId = null;
        if (state.currentUserRole === "md") window.setView("md-dashboard");
        else if (state.currentUserRole === "staff") window.setView("admin-dashboard");
        else window.setView("success");
      }, 650);
      return;
    }

    // REQUIRED: GPS capture for artisan registration
    let geo = null;
    try {
      geo = await getGeoPosition();
    } catch (err) {
      state.isLoading = false;
      state.error =
        "Location permission is required to register a miner. Please allow GPS and try again.";
      render();
      return;
    }

    state.generatedId = "ART-" + Math.floor(100000 + Math.random() * 900000);
    state.issueDate = new Date();
    state.expiryDate = addYears(1);

    const createdAtISO = new Date().toISOString();

    const backendData = {
      id: state.generatedId,
      type: "Artisan",
      status: "Pending",
      paymentStatus: "Unpaid",
      paidAmount: 0,
      fee: 20000,
      name: state.formData.name,
      phone: state.formData.phone,
      lga: state.formData.lga,
      location: state.formData.lga, // keep both for compatibility
      mineral: state.formData.mineral,
      photoURL: normalizePhotoURL(state.formData.photoURL),
      issueDate: iso(state.issueDate),
      expiryDate: iso(state.expiryDate),
      createdAt: createdAtISO,

      // REQUIRED permanent fields
      lat: geo?.coords?.latitude ?? null,
      lng: geo?.coords?.longitude ?? null,
      locationCapturedAt: createdAtISO,
    };

    state.applications = safeArray(state.applications);
    state.applications.unshift({
      ...backendData,
      name: backendData.name,
      location: backendData.location,
      photoURL: backendData.photoURL,
    });
    persistLocal();

    await saveToGoogleSheet("Artisans", backendData);

    setTimeout(() => {
      state.isLoading = false;
      window.setView("success");
    }, 900);
  };

  // =========================
  // Auth (PIN-based)
  // =========================
  window.handleAdminLogin = function (e) {
    e.preventDefault();
    if (state.authSigningIn) return;
    const input = document.getElementById("admin-pin");
    const btn = document.getElementById("admin-submit");

    const pin = String(input?.value || "").trim();
    if (!pin) return;

    const acct = STAFF_ACCOUNTS[pin];
    if (!acct) {
      uiAlert(
        "Invalid PIN. Use: 1111 (Adams), 2222 (Abba), 4444 (Mustapha), 5555 (Mohammed)."
      );
      if (btn) btn.innerHTML = t("portalEntry");
      return;
    }

    state.authSigningIn = true;
    if (btn) {
      btn.innerHTML = t("processing");
      try {
        btn.setAttribute("disabled", "true");
      } catch (e) {}
    }

    state.auth.pin = pin;
    state.auth.staffName = acct.name;
    state.auth.staffId = acct.name;
    state.auth.role = acct.role;

    state.currentUserRole = acct.role;
    state.staffLocStatus.error = null;

    // Fast login: show dashboard immediately with locally cached data, then refresh in background.
    hydrateLocal();
    if (acct.role === "md") {
      window.setView("md-dashboard");
      startMDRefreshLoop();
    } else {
      window.setView("admin-dashboard");
      startStaffLocationTracking({ silent: true });
    }

    (async () => {
      try {
        await loadApplications();
        await loadExitLogs();
        if (acct.role === "md") await loadMDData();
      } finally {
        state.authSigningIn = false;
      }
    })();
  };

  window.manualLogLocationNow = function () {
    logStaffLocation("manual");
  };
  window.refreshMDNow = function () {
    loadApplications().then(loadExitLogs).then(loadMDData);
  };

  window.logout = function () {
    state.authSigningIn = false;
    state.currentUserRole = null;
    state.auth.role = null;
    state.auth.staffId = null;
    state.auth.staffName = null;
    state.auth.pin = null;

    stopStaffLocationTracking();
    stopMDRefreshLoop();

    window.setView("landing");
  };

  function waitForImage(img, timeoutMs) {
    const ms = Number(timeoutMs || 6000);
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();

    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        try {
          img.removeEventListener("load", finish);
          img.removeEventListener("error", finish);
        } catch (e) {}
        resolve();
      };

      try {
        img.addEventListener("load", finish, { once: true });
        img.addEventListener("error", finish, { once: true });
      } catch (e) {
        // ignore
      }

      setTimeout(finish, ms);
    });
  }

  async function waitForImages(root, timeoutMs) {
    const imgs = root ? Array.from(root.querySelectorAll("img")) : [];
    await Promise.all(imgs.map((img) => waitForImage(img, timeoutMs)));
  }

  async function fetchBlobWithFallback(url, timeoutMs) {
    const ms = Number(timeoutMs || 8000);
    const controller = "AbortController" in window ? new AbortController() : null;
    const timer = setTimeout(() => {
      try {
        controller?.abort();
      } catch (e) {}
    }, ms);

    try {
      // First try normal fetch (CORS if allowed).
      try {
        const res = await fetch(url, { signal: controller?.signal });
        if (res && res.ok) {
          const ct = String(res.headers?.get("content-type") || "").toLowerCase();
          if (ct && ct.includes("text/html")) throw new Error("Non-image response");
          return await res.blob();
        }
      } catch (e) {}

      // Fallback: opaque fetch often still gives a usable Blob for <img>.
      const res2 = await fetch(url, { mode: "no-cors", signal: controller?.signal });
      return await res2.blob();
    } finally {
      clearTimeout(timer);
    }
  }

  async function inlineImagesForDownload(root) {
    // Inline ALL images inside the download root, otherwise a single cross-origin <img>
    // will taint the html2canvas output and break toDataURL().
    const imgs = root ? Array.from(root.querySelectorAll("img")) : [];
    const cleanups = [];

    for (const img of imgs) {
      const src = String(img.getAttribute("src") || "");
      if (!src || src.startsWith("data:") || src.startsWith("blob:")) continue;
      if (img.dataset.inlineOriginalSrc) continue;

      try {
        const blob = await fetchBlobWithFallback(src, 8000);
        const type = String(blob?.type || "").toLowerCase();
        if (type && !type.startsWith("image/")) throw new Error("Non-image blob");
        const objectUrl = URL.createObjectURL(blob);
        img.dataset.inlineOriginalSrc = src;
        img.dataset.inlineObjectUrl = objectUrl;
        img.setAttribute("src", objectUrl);
        cleanups.push(() => {
          try {
            const orig = img.dataset.inlineOriginalSrc;
            const obj = img.dataset.inlineObjectUrl;
            if (orig) img.setAttribute("src", orig);
            if (obj) URL.revokeObjectURL(obj);
            delete img.dataset.inlineOriginalSrc;
            delete img.dataset.inlineObjectUrl;
          } catch (e) {}
        });
      } catch (e) {
        // If we can't inline, force a same-origin placeholder to avoid tainting the canvas.
        // This also prevents html2canvas from failing on broken/cors-blocked images.
        try {
          img.dataset.inlineOriginalSrc = src;
          img.setAttribute("src", "./assets/icon.svg");
          cleanups.push(() => {
            try {
              const orig = img.dataset.inlineOriginalSrc;
              if (orig) img.setAttribute("src", orig);
              delete img.dataset.inlineOriginalSrc;
            } catch (e2) {}
          });
        } catch (e2) {}
      }
    }

    return () => {
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch (e) {}
      });
    };
  }

  // Download any element (ID card)
  window.downloadElement = async function (elementId, fileName) {
    const element = document.getElementById(elementId);
    if (!element) return;
    let cleanup = null;
    try {
      hydrateQrCodes(element);
      cleanup = await inlineImagesForDownload(element);
      await waitForImages(element, 8000);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = fileName + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      uiAlert("Could not generate image. Please try again.");
    } finally {
      try {
        cleanup && cleanup();
      } catch (e) {}
    }
  };

  // =========================
  // UI helpers
  // =========================
  function Icon(name, className) {
    return '<i data-lucide="' + name + '" class="' + (className || "w-5 h-5") + '"></i>';
  }

  function renderInput(label, id, type, placeholder, value, oninput, maxlength) {
    return (
      '<div class="mb-4">' +
      '<label class="block text-sm font-medium text-gray-700 mb-1">' +
      label +
      "</label>" +
      '<input type="' +
      (type || "text") +
      '" id="' +
      id +
      '"' +
      ' class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"' +
      ' placeholder="' +
      (placeholder || "") +
      '"' +
      ' value="' +
      (value || "") +
      '"' +
      (maxlength ? ' maxlength="' + maxlength + '"' : "") +
      ' oninput="' +
      (oninput || "") +
      '">' +
      "</div>"
    );
  }

  function renderSelect(label, id, options, selectedValue, onchange) {
    const opts = (options || [])
      .map((opt) => {
        const sel = opt === selectedValue ? " selected" : "";
        return '<option value="' + opt + '"' + sel + ">" + opt + "</option>";
      })
      .join("");

    return (
      '<div class="mb-4">' +
      '<label class="block text-sm font-medium text-gray-700 mb-1">' +
      label +
      "</label>" +
      '<div class="relative">' +
      '<select id="' +
      id +
      '" onchange="' +
      (onchange || "") +
      '" class="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none">' +
      opts +
      "</select>" +
      '<div class="absolute right-3 top-3.5 pointer-events-none text-gray-400">' +
      Icon("chevron-down", "w-5 h-5") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderHeader() {
    const showInstall = !state.pwa.isStandalone && (state.pwa.canInstall || state.pwa.isIOS);
    const mobileMenuOpen = !!(state.ui && state.ui.mobileMenuOpen);

    return (
      '<header class="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white shadow-lg sticky top-0 z-50 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))]">' +
      '<div class="flex items-center justify-between gap-3 max-w-6xl mx-auto">' +
      '<div class="flex items-center space-x-3 cursor-pointer group min-w-0" onclick="setView(\'landing\')">' +
      '<div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white group-hover:scale-105 transition-transform overflow-hidden">' +
      '<img src="' +
      ASSETS.miningLogo +
      '" class="w-full h-full object-cover" alt="Yobe Mining Logo" onerror="this.onerror=null;this.src=\'./assets/icon.svg\'">' +
      "</div>" +
      '<div class="min-w-0">' +
      '<h1 class="font-bold text-sm md:text-lg leading-tight tracking-wide truncate">' +
      t("appTitle") +
      "</h1>" +
      '<p class="text-[10px] md:text-xs text-emerald-200 uppercase tracking-wider hidden md:block">' +
      t("subtitle") +
      "</p>" +
      "</div>" +
      "</div>" +

      '<div class="flex items-center gap-2 md:gap-4 shrink-0">' +
      '<nav class="hidden md:flex space-x-6 text-sm font-medium text-emerald-100">' +
      '<button onclick="setView(\'landing\')" class="hover:text-white hover:underline">' +
      t("home") +
      "</button>" +
      '<button onclick="setView(\'miner-portal\')" class="hover:text-white hover:underline">' +
      t("services") +
      "</button>" +
      '<button onclick="scrollToContact()" class="hover:text-white hover:underline">' +
      t("contact") +
      "</button>" +
      "</nav>" +

      '<button onclick="toggleMobileMenu()" class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20 backdrop-blur-sm" aria-label="Menu">' +
      (mobileMenuOpen ? Icon("x", "w-5 h-5") : Icon("menu", "w-5 h-5")) +
      "</button>" +

      (showInstall
        ? '<button onclick="installApp()" class="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-emerald-950 w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full transition-all text-xs md:text-sm font-black border border-yellow-200 shadow-sm">' +
          Icon("download", "w-4 h-4 sm:mr-2") +
          '<span class="hidden sm:inline">Install</span>' +
          "</button>"
        : "") +

      '<button onclick="toggleLang()" class="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full transition-all text-xs md:text-sm font-medium border border-white/20 backdrop-blur-sm">' +
      Icon("languages", "w-4 h-4 sm:mr-2") +
      '<span class="hidden sm:inline">' +
      (state.lang === "en" ? "HA" : "EN") +
      "</span>" +
      '<span class="sm:hidden font-black">' +
      (state.lang === "en" ? "HA" : "EN") +
      "</span>" +
      "</button>" +
      "</div>" +
      "</div>" +

      (mobileMenuOpen
        ? '<div class="md:hidden max-w-6xl mx-auto mt-3">' +
          '<div class="bg-white/10 border border-white/15 rounded-2xl p-3 backdrop-blur-sm">' +
          '<div class="grid grid-cols-1 gap-2 text-sm font-bold">' +
          '<button onclick="setView(\'landing\')" class="w-full text-left px-3 py-3 rounded-xl hover:bg-white/10 transition flex items-center gap-2">' +
          Icon("home", "w-4 h-4") +
          t("home") +
          "</button>" +
          '<button onclick="setView(\'miner-portal\')" class="w-full text-left px-3 py-3 rounded-xl hover:bg-white/10 transition flex items-center gap-2">' +
          Icon("pickaxe", "w-4 h-4") +
          t("services") +
          "</button>" +
          (showInstall
            ? '<button onclick="installApp()" class="w-full text-left px-3 py-3 rounded-xl hover:bg-white/10 transition flex items-center gap-2">' +
              Icon("download", "w-4 h-4") +
              "Install" +
              "</button>"
            : "") +
          '<button onclick="scrollToContact()" class="w-full text-left px-3 py-3 rounded-xl hover:bg-white/10 transition flex items-center gap-2">' +
          Icon("phone", "w-4 h-4") +
          t("contact") +
          "</button>" +
          "</div>" +
          "</div>" +
          "</div>"
        : "") +

      "</header>"
    );
  }

  // =========================
  // Modals
  // =========================
  function renderIOSInstallHint() {
    if (!state.pwa.isIOS || state.pwa.isStandalone || state.pwa.iosHintDismissed)
      return "";
    if (state.view !== "landing") return "";
    return (
      '<div class="fixed bottom-3 left-3 right-3 z-[80]">' +
      '<div class="max-w-xl mx-auto bg-white border border-gray-200 shadow-xl rounded-2xl p-4 flex items-start gap-3">' +
      '<div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">' +
      Icon("smartphone", "w-5 h-5") +
      "</div>" +
      '<div class="flex-1">' +
      '<div class="text-sm font-black text-gray-900">Install this app</div>' +
      '<div class="text-xs text-gray-600 mt-1">On iPhone/iPad: Share → “Add to Home Screen”.</div>' +
      "</div>" +
      '<button onclick="dismissIOSInstallHint()" class="text-xs font-black text-gray-500 hover:text-gray-900 px-2 py-1">Dismiss</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderSystemDialog() {
    if (!state.dialog || !state.dialog.open) return "";
    const title = escHtml(state.dialog.title || "Notice");
    const message = escHtml(state.dialog.message || "");
    const okText = escHtml(state.dialog.okText || "OK");
    const cancelText = escHtml(state.dialog.cancelText || "Cancel");
    const isConfirm = state.dialog.mode === "confirm";

    return (
      '<div class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onclick="if(event.target===this) closeDialog(false)">' +
      '<div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5">' +
      '<div class="text-lg font-black text-gray-900">' +
      title +
      "</div>" +
      '<div class="text-sm text-gray-700 mt-2 leading-relaxed">' +
      message +
      "</div>" +
      '<div class="mt-5 flex justify-end gap-3">' +
      (isConfirm
        ? '<button onclick="closeDialog(false)" class="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50">' +
          cancelText +
          "</button>"
        : "") +
      '<button onclick="closeDialog(true)" class="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800">' +
      okText +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderExitLogModal() {
    if (!state.exitLogModal.open) return "";
    return (
      '<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up" onclick="if(event.target === this) closeExitLog()">' +
      '<div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[92dvh] overflow-hidden flex flex-col">' +
      '<div class="bg-emerald-900 px-6 py-4 flex justify-between items-center text-white">' +
      '<h3 class="font-bold flex items-center gap-2">' +
      Icon("log-out", "w-5 h-5") +
      " Log Exit</h3>" +
      '<button onclick="closeExitLog()" class="hover:bg-emerald-800 p-1 rounded transition">' +
      Icon("x", "w-5 h-5") +
      "</button>" +
      "</div>" +
      '<div class="p-6 overflow-y-auto">' +
      '<div class="mb-4 relative">' +
      '<label class="block text-sm font-medium text-gray-700 mb-1">Artisan ID</label>' +
      '<div class="flex gap-2">' +
      '<input type="text" id="exit-id" value="' +
      String(state.exitForm?.id || "") +
      '" oninput="state.exitForm.id = this.value" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="ART-XXXXXX">' +
      '<button onclick="openQRScanner(\'exitLog\')" class="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 flex items-center justify-center">' +
      Icon("scan", "w-5 h-5") +
      "</button>" +
      "</div>" +
      "</div>" +

      '<div class="mb-4">' +
      '<label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>' +
      '<div class="flex gap-2">' +
      '<input type="number" id="exit-amount" value="' +
      String(state.exitForm?.quantity || "") +
      '" oninput="state.exitForm.quantity = this.value; updateExitRevenuePreview()" class="w-2/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="0" min="0.0001" step="any" inputmode="decimal">' +
      '<div id="exit-unit-display" class="w-1/3 px-2 py-3 bg-gray-100 border border-gray-200 rounded-xl text-center text-sm font-bold text-gray-700 flex items-center justify-center">Unit</div>' +
      '<input type="hidden" id="exit-unit" value="ton">' +
      "</div>" +
      "</div>" +

      renderSelect(
        "Mineral Type",
        "exit-mineral",
        MINERAL_NAMES,
        state.exitForm?.mineral || "Gypsum",
        "state.exitForm.mineral = this.value; updateExitRevenuePreview()"
      ) +

      '<div class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs">' +
      '<div class="flex items-center justify-between">' +
      '<span class="text-gray-600 font-bold">Unit Price</span>' +
      '<span class="font-mono font-black text-gray-900" id="price-per-unit">—</span>' +
      "</div>" +
      '<div class="flex items-center justify-between mt-1">' +
      '<span class="text-gray-600 font-bold">Estimated Revenue</span>' +
      '<span class="font-mono font-black text-emerald-700" id="est-rev">—</span>' +
      "</div>" +
      "</div>" +

      '<div class="flex gap-3 mt-4">' +
      '<button onclick="closeExitLog()" class="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50">Cancel</button>' +
      '<button id="exit-submit-btn" onclick="submitExitLog()" class="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700">Submit Log</button>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderQRScannerModal() {
    if (!state.qrScannerModal.open) return "";
    return (
      '<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up" onclick="if(event.target === this) closeQRScanner()">' +
      '<div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[92dvh] overflow-hidden flex flex-col">' +
      '<div class="bg-emerald-900 px-6 py-4 flex justify-between items-center text-white">' +
      '<h3 class="font-bold flex items-center gap-2">' +
      Icon("scan", "w-5 h-5") +
      " QR Code Scanner</h3>" +
      '<button onclick="closeQRScanner()" class="hover:bg-emerald-800 p-1 rounded transition">' +
      Icon("x", "w-5 h-5") +
      "</button>" +
      "</div>" +
      '<div class="p-6 flex flex-col items-center gap-3 overflow-y-auto">' +
      '<video id="qr-video" class="w-full max-w-xs rounded-lg border border-gray-300 bg-black" playsinline></video>' +
      '<canvas id="qr-canvas" class="hidden"></canvas>' +
      '<div class="text-[11px] text-gray-500 text-center">Scan the Miner ID-card QR only.</div>' +
      (state.scannedQR
        ? '<p class="text-xs text-green-600 font-mono">Detected: ' + state.scannedQR + "</p>"
        : "") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderCameraModal() {
    if (!state.cameraModal.open) return "";
    const hasShot = !!state.capturedPhoto;

    return (
      '<div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in-up" onclick="if(event.target === this) closeCamera()">' +
      '<div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[92dvh] overflow-hidden flex flex-col">' +
      '<div class="bg-gray-900 px-6 py-4 flex justify-between items-center text-white">' +
      '<h3 class="font-bold flex items-center gap-2">' +
      Icon("camera", "w-5 h-5") +
      " " +
      t("cameraTitle") +
      "</h3>" +
      '<button onclick="closeCamera()" class="hover:bg-white/10 p-1 rounded transition">' +
      Icon("x", "w-5 h-5") +
      "</button>" +
      "</div>" +

      '<div class="p-6 overflow-y-auto">' +
      '<p class="text-xs text-gray-500 mb-3">' +
      t("cameraHint") +
      "</p>" +

      '<div class="rounded-2xl overflow-hidden border border-gray-200 bg-black relative">' +
      (hasShot
        ? '<img src="' + state.capturedPhoto + '" class="w-full aspect-square object-cover" alt="Captured photo">'
        : '<video id="cam-video" class="w-full aspect-square object-cover" playsinline autoplay muted></video>') +
      '<canvas id="cam-canvas" class="hidden"></canvas>' +
      '<div class="absolute inset-0 pointer-events-none"><div class="absolute inset-8 rounded-2xl border-2 border-white/30"></div></div>' +
      "</div>" +

      (state.cameraError
        ? '<div class="mt-3 bg-red-50 text-red-700 border border-red-100 rounded-xl p-3 text-xs font-bold">' +
          state.cameraError +
          "</div>"
        : "") +

      '<div class="mt-4 grid grid-cols-2 gap-3">' +
      (hasShot
        ? '<button onclick="retakePhoto()" class="py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50">' +
          t("retake") +
          "</button>" +
          '<button onclick="useCapturedPhoto()" class="py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700">' +
          t("usePhoto") +
          "</button>"
        : '<button onclick="closeCamera()" class="py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50">Cancel</button>' +
          '<button onclick="capturePhoto()" class="py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black flex items-center justify-center gap-2">' +
          Icon("aperture", "w-5 h-5") +
          " " +
          t("capture") +
          "</button>") +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  // =========================
  // Pages
  // =========================
  function renderLanding() {
    const statRegistered = "20+";
    const statCompanies = "10+";
    const statLgas = String(LGAs.length);
    const statCompliance = "98%";

    return (
      '<div class="animate-fade-in-up">' +
      '<div class="relative bg-emerald-900 text-white overflow-hidden">' +
      '<div class="absolute inset-0 bg-emerald-900 opacity-20"></div>' +
      '<div class="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/80"></div>' +
      '<div class="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center">' +
      '<div class="md:w-1/2 mb-10 md:mb-0">' +
      '<div class="inline-block px-3 py-1 bg-yellow-400 text-emerald-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Mining Dasboard</div>' +
      '<h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">' +
      t("subtitle") +
      "</h1>" +
      '<p class="text-emerald-100 text-lg mb-8 max-w-lg">Streamlining miner onboarding, verification, renewals, and on-site compliance.</p>' +
      '<div class="flex flex-col sm:flex-row gap-4">' +
      '<button onclick="setView(\'miner-portal\')" class="bg-yellow-400 text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center">' +
      t("portalEntry") +
      " " +
      Icon("arrow-right", "ml-2 w-5 h-5") +
      "</button>" +
      '<button onclick="setView(\'admin-login\')" class="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center">' +
      Icon("lock", "mr-2 w-4 h-4") +
      " " +
      t("adminLogin") +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +

      // Stats strip (as requested)
      '<section class="bg-white border-t border-emerald-900/20">' +
      '<div class="max-w-6xl mx-auto px-6 py-10 md:py-14">' +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">' +
      '<div>' +
      '<div class="text-4xl md:text-5xl font-black text-emerald-900 tracking-tight">' +
      statRegistered +
      "</div>" +
      '<div class="mt-2 text-sm font-bold text-gray-500 uppercase tracking-widest">Registered Miners</div>' +
      "</div>" +
      "<div>" +
      '<div class="text-4xl md:text-5xl font-black text-emerald-900 tracking-tight">' +
      statCompanies +
      "</div>" +
      '<div class="mt-2 text-sm font-bold text-gray-500 uppercase tracking-widest">Minerals</div>' +
      "</div>" +
      "<div>" +
      '<div class="text-4xl md:text-5xl font-black text-emerald-900 tracking-tight">' +
      statLgas +
      "</div>" +
      '<div class="mt-2 text-sm font-bold text-gray-500 uppercase tracking-widest">LGAs Covered</div>' +
      "</div>" +
      "<div>" +
      '<div class="text-4xl md:text-5xl font-black text-emerald-900 tracking-tight">' +
      statCompliance +
      "</div>" +
      '<div class="mt-2 text-sm font-bold text-gray-500 uppercase tracking-widest">Compliance Rate</div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>" +
      "</div>"
    );
  }

  function renderSiteFooter() {
    const year = new Date().getFullYear();
    return (
      '<footer id="contact-us" class="mt-auto bg-[#0B4B3B] text-emerald-50 pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">' +
      '<div class="max-w-6xl mx-auto px-6">' +
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-10">' +
      "<div>" +
      '<div class="flex items-center gap-3">' +
      '<div class="text-yellow-400">' +
      Icon("pickaxe", "w-6 h-6") +
      "</div>" +
      '<div class="text-xl font-black">YOBE MINING DEVELOPMENT COMPANY</div>' +
      "</div>" +
      '<p class="mt-4 text-emerald-100/90 text-sm leading-relaxed">' +
      "Mining dashboard for developing solid minerals, regulating mining activities within Yobe State, ensuring safety, compliance, and economic growth." +
      "</p>" +
      "</div>" +

      "<div>" +
      '<div class="text-yellow-400 font-black uppercase tracking-widest text-sm">Quick Links</div>' +
      '<div class="mt-4 space-y-3 text-emerald-50/90 font-medium">' +
      '<button onclick="setView(\'artisan-form\')" class="block hover:text-white hover:underline text-left">Registration</button>' +
      '<button onclick="setView(\'status-check\')" class="block hover:text-white hover:underline text-left">Check Status</button>' +
      '<button onclick="setView(\'renew-check\')" class="block hover:text-white hover:underline text-left">Renewals</button>' +
      '<button onclick="setView(\'miner-portal\')" class="block hover:text-white hover:underline text-left">Digital Mining Suite</button>' +
      '<button onclick="scrollToContact()" class="block hover:text-white hover:underline text-left">Contact Us</button>' +
      "</div>" +
      "</div>" +

      "<div>" +
      '<div class="text-yellow-400 font-black uppercase tracking-widest text-sm">Contact Us</div>' +
      '<div class="mt-4 space-y-4 text-emerald-50/90 text-sm">' +
      '<div class="flex items-start gap-3">' +
      '<div class="text-yellow-400 mt-0.5">' +
      Icon("map-pin", "w-5 h-5") +
      "</div>" +
      '<div>Head Office: Beside Bra Bra Housing Estate, Bye - Pass Damaturu.</div>' +
      '<div>Abuja Office: Floor 5, Yobe Investment House, Central Business District Abuja.</div>' +
      "</div>" +
      '<div class="flex items-start gap-3">' +
      '<div class="text-yellow-400 mt-0.5">' +
      Icon("phone", "w-5 h-5") +
      "</div>" +
      '<a class="hover:text-white hover:underline" href="tel:+23480064646992">+234 800 MINING YB</a>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +

      '<div class="mt-10 pt-6 border-t border-white/10 text-center text-emerald-100/80 text-sm">' +
      "© " +
      year +
      " YOBE MINING DEVELOPMENT COMPANY. All rights reserved." +
      "</div>" +
      "</div>" +
      "</footer>"
    );
  }

  function renderMinerPortal() {
    return (
      '<div class="animate-fade-in-up min-h-[60vh]">' +
      '<div class="relative bg-emerald-50 pb-8 rounded-b-[2.5rem] overflow-hidden">' +
      '<div class="max-w-md mx-auto px-6 pt-6 text-center relative z-10">' +
      '<h2 class="text-2xl font-bold text-emerald-900 mb-2">' +
      t("welcome") +
      ", Miner!</h2>" +
      '<div class="grid grid-cols-2 gap-4 mt-6">' +
      '<button onclick="setView(\'artisan-form\')" class="bg-white p-4 rounded-2xl shadow-md border-b-4 border-yellow-400 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-2 hover:bg-yellow-50">' +
      '<div class="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">' +
      Icon("user", "w-6 h-6") +
      "</div>" +
      '<span class="font-bold text-sm text-gray-800 leading-tight">' +
      t("registerArtisan") +
      "</span>" +
      "</button>" +
      '<button onclick="setView(\'status-check\')" class="bg-white p-4 rounded-2xl shadow-md border-b-4 border-blue-400 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-2 hover:bg-blue-50">' +
      '<div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">' +
      Icon("credit-card", "w-6 h-6") +
      "</div>" +
      '<span class="font-bold text-sm text-gray-800 leading-tight">' +
      t("idCard") +
      "</span>" +
      "</button>" +
      '<button onclick="setView(\'renew-check\')" class="bg-white p-4 rounded-2xl shadow-md border-b-4 border-orange-400 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-2 hover:bg-orange-50">' +
      '<div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">' +
      Icon("refresh-cw", "w-6 h-6") +
      "</div>" +
      '<span class="font-bold text-sm text-gray-800 leading-tight">' +
      t("renew") +
      "</span>" +
      "</button>" +
      '<button onclick="setView(\'admin-login\')" class="bg-white p-4 rounded-2xl shadow-md border-b-4 border-emerald-500 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-2 hover:bg-emerald-50">' +
      '<div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">' +
      Icon("lock", "w-6 h-6") +
      "</div>" +
      '<span class="font-bold text-sm text-gray-800 leading-tight">' +
      t("adminLogin") +
      "</span>" +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderArtisanForm() {
    const backTarget =
      state.currentUserRole === "staff" ? "setView('admin-dashboard')" : "setView('miner-portal')";
    return (
      '<div class="max-w-xl w-full mx-auto px-4 py-8 animate-slide-in-right">' +
      '<button onclick="' +
      backTarget +
      '" class="text-gray-500 mb-4 flex items-center hover:text-gray-900 transition">' +
      Icon("arrow-left", "w-5 h-5 mr-1") +
      (state.editingId ? " Cancel Edit" : " " + t("back")) +
      "</button>" +
      '<div class="bg-white rounded-2xl shadow-xl overflow-hidden">' +
      '<div class="bg-yellow-500 p-4 text-emerald-900">' +
      '<h2 class="text-xl font-bold flex items-center gap-2">' +
      Icon("pickaxe", "w-5 h-5") +
      " " +
      (state.editingId ? "Edit Miner Record" : "Register Miner") +
      "</h2>" +
      '<div class="text-[11px] font-bold opacity-80 mt-1">GPS will be captured automatically on submission.</div>' +
      "</div>" +
      '<div class="p-6">' +
      (state.error
        ? '<div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">' +
          state.error +
          "</div>"
        : "") +
      renderInput(t("formName"), "inp-name", "text", "Musa Ibrahim", state.formData.name, "state.formData.name = this.value", null) +
      renderInput(
        t("formPhone"),
        "inp-phone",
        "tel",
        "08012345678",
        state.formData.phone,
        "this.value = this.value.replace(/[^0-9]/g,'').slice(0, 11); state.formData.phone = this.value",
        11
      ) +
      renderSelect(t("formLocation"), "sel-lga", LGAs, state.formData.lga, "state.formData.lga = this.value") +
      renderSelect(t("formMineral"), "sel-mineral", MINERAL_NAMES, state.formData.mineral, "state.formData.mineral = this.value") +
      '<div class="mb-6">' +
      '<label class="block text-sm font-medium text-gray-700 mb-2">' +
      t("formPhoto") +
      "</label>" +
      '<div class="grid grid-cols-2 gap-3">' +
      '<button type="button" onclick="openCamera()" class="py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black flex items-center justify-center gap-2">' +
      Icon("camera", "w-5 h-5") +
      " " +
      t("snapPhoto") +
      "</button>" +
      '<label class="py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer">' +
      Icon("upload", "w-5 h-5") +
      " " +
      t("uploadPhoto") +
      '<input type="file" accept="image/*" class="hidden" onchange="handlePhotoUpload(event)">' +
      "</label>" +
      "</div>" +
      (state.formData.photoURL
        ? '<div class="mt-4 flex items-center gap-3">' +
          '<img src="' +
          state.formData.photoURL +
          '" class="w-14 h-14 rounded-full object-cover border-2 border-yellow-500 shadow-sm" onerror="this.onerror=null;this.src=\'./assets/icon.svg\'">' +
          '<div class="text-xs text-gray-500">Photo saved.</div>' +
          "</div>"
        : '<div class="mt-3 text-xs text-gray-400">No photo selected yet.</div>') +
      "</div>" +
      '<button onclick="submitForm()" class="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-900 transition flex justify-center items-center">' +
      (state.isLoading ? Icon("loader-2", "animate-spin mr-2 w-5 h-5") : "") +
      (state.isLoading ? t("processing") : state.editingId ? "Update Record" : "Submit") +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderIDCard(id, name, lga, mineral, expiryDate, photoURL) {
    const qrText = String(id || "").toUpperCase();
    const photo = normalizePhotoURL(photoURL || ASSETS.miningLogo);

    return (
      '<div id="download-target" class="relative w-[340px] h-[540px] bg-gradient-to-br from-green-800 to-green-950 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col items-center pt-8 pb-4 px-6 border-2 border-yellow-500/50 cert-watermark">' +
      '<div class="hologram-strip absolute inset-0 pointer-events-none z-20"></div>' +
      '<div class="security-guilloche absolute inset-0 z-0 opacity-20"></div>' +
      '<div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none font-bold text-6xl text-white/10 rotate-45">YOBE STATE</div>' +
      '<div class="flex flex-col items-center mb-6 z-10 text-center relative">' +
      '<img src="' +
      ASSETS.miningLogo +
      '" class="w-12 h-12 object-contain mb-2 drop-shadow-md rounded-full bg-white/10 p-1" onerror="this.onerror=null;this.src=\'./assets/icon.svg\'">' +
      '<h1 class="text-lg font-bold font-serif text-yellow-400">YOBE MINING DEVELOPMENT COMPANY</h1>' +
      '<div class="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-bold mt-1 shadow-lg">MINER ID CARD</div>' +
      "</div>" +
      '<div class="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden shadow-lg mb-4 z-10 bg-gray-300 relative">' +
      '<img src="' +
      photo +
      '" class="w-full h-full object-cover" onerror="this.onerror=null;this.src=\'./assets/icon.svg\'">' +
      '<div class="absolute -bottom-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-20">' +
      Icon("check", "w-5 h-5 text-emerald-900") +
      "</div>" +
      "</div>" +
      '<div class="text-center z-10 w-full space-y-2">' +
      "<div>" +
      '<h2 class="text-xl font-bold text-white mb-1 uppercase tracking-wide drop-shadow-md">' +
      (name || "") +
      "</h2>" +
      '<div class="inline-block bg-black/30 backdrop-blur px-3 py-1 rounded-full border border-white/20">' +
      '<p class="text-xs text-yellow-300 font-mono-security">' +
      (id || "") +
      "</p>" +
      "</div>" +
      "</div>" +
      '<div class="bg-white/10 rounded-lg p-2 flex justify-between items-center text-xs border border-white/20 mt-2 backdrop-blur-sm">' +
      '<div class="text-left">' +
      '<span class="block text-[9px] text-emerald-300 uppercase">LGA</span>' +
      '<span class="font-bold">' +
      (lga || "—") +
      "</span>" +
      "</div>" +
      '<div class="text-right">' +
      '<span class="block text-[9px] text-emerald-300 uppercase">Mineral</span>' +
      '<span class="font-bold">' +
      (mineral || "—") +
      "</span>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="mt-auto pt-4 w-full flex justify-between items-end z-10">' +
      '<div class="text-left">' +
      '<span class="block text-[9px] text-emerald-400 uppercase">Expires</span>' +
      '<span class="text-sm font-bold font-mono">' +
      formatDate(expiryDate || addYears(1)) +
      "</span>" +
      "</div>" +
      '<div class="bg-white p-1 rounded shadow-lg"><div class="w-14 h-14" data-qr-text="' +
      qrText +
      '"></div></div>' +
      "</div>" +
      "</div>"
    );
  }

  function renderSuccess() {
    const card = renderIDCard(
      state.generatedId,
      state.formData.name,
      state.formData.lga,
      state.formData.mineral,
      state.expiryDate,
      state.formData.photoURL
    );
    return (
      '<div class="flex-grow flex flex-col items-center py-10 px-4 bg-gray-100">' +
      '<div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">' +
      Icon("check-circle", "w-10 h-10") +
      "</div>" +
      '<h2 class="text-2xl font-bold text-emerald-900 mb-2">' +
      t("success") +
      "</h2>" +
      '<p class="text-xs text-gray-500 mb-6">GPS captured and stored for this registration.</p>' +
      '<div class="w-full max-w-2xl mb-8 flex justify-center">' +
      card +
      "</div>" +
      '<div class="flex gap-4 flex-wrap justify-center">' +
      '<button onclick="downloadElement(\'download-target\', \'MinerID_' +
      state.generatedId +
      "\')" +
      '" class="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2">' +
      Icon("download") +
      " " +
      t("downloadID") +
      "</button>" +
      '<button onclick="setView(\'miner-portal\')" class="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition">' +
      t("back") +
      "</button>" +
      "</div>" +
      "</div>"
    );
  }

  function renderSearchSuccess() {
    const id = state.generatedId || (state.searchResult && state.searchResult.id) || "";
    const nm = state.formData.name || (state.searchResult && state.searchResult.name) || "";
    const lga =
      state.formData.lga ||
      (state.searchResult && (state.searchResult.lga || state.searchResult.location)) ||
      LGAs[0];
    const mineral =
      state.formData.mineral ||
      (state.searchResult && state.searchResult.mineral) ||
      "Gypsum";
    const exp = state.expiryDate || addYears(1);
    const photo =
      state.formData.photoURL ||
      resolvePhotoFromRecord(state.searchResult, ASSETS.miningLogo) ||
      ASSETS.miningLogo;

    const card = renderIDCard(id, nm, lga, mineral, exp, photo);

    return (
      '<div class="flex-grow flex flex-col items-center py-10 px-4 bg-gray-100">' +
      '<div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">' +
      Icon("badge-check", "w-10 h-10") +
      "</div>" +
      '<h2 class="text-2xl font-bold text-gray-900 mb-2">Record Found</h2>' +
      '<p class="text-sm text-gray-600 mb-8">Download the Miner ID card below.</p>' +
      '<div class="w-full max-w-2xl mb-8 flex justify-center">' +
      card +
      "</div>" +
      '<div class="flex gap-4 flex-wrap justify-center">' +
      '<button onclick="downloadElement(\'download-target\', \'MinerID_' +
      id +
      "\')" +
      '" class="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2">' +
      Icon("download") +
      " " +
      t("downloadID") +
      "</button>" +
      '<button onclick="setView(\'miner-portal\')" class="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition">Back to Menu</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderRenewCheck() {
    return (
      '<div class="max-w-md w-full mx-auto px-4 py-8 animate-slide-in-right">' +
      '<button onclick="setView(\'miner-portal\')" class="text-gray-500 mb-4 flex items-center hover:text-gray-900 transition">' +
      Icon("arrow-left", "w-5 h-5 mr-1") +
      " " +
      t("back") +
      "</button>" +
      '<div class="bg-white rounded-2xl shadow-xl p-6 text-center">' +
      '<h2 class="text-xl font-bold text-gray-800 mb-2">' +
      t("renew") +
      "</h2>" +
      '<input id="renew-input" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4" placeholder="Enter ART-XXXXXX" />' +
      '<div id="renew-msg"></div>' +
      '<button id="renew-btn" onclick="checkRenew()" class="w-full bg-orange-600 text-white py-3 rounded-xl font-bold">Proceed</button>' +
      '<p class="mt-3 text-xs text-gray-500">Only Artisan IDs are supported.</p>' +
      "</div>" +
      "</div>"
    );
  }

  function renderRenewalDetails() {
    const st = state.renewalStatus;
    if (!st || !st.data) {
      window.setView("renew-check");
      return "";
    }
    const needed = st.needed;
    const data = st.data;
    const daysRemaining = st.daysRemaining;

    return (
      '<div class="max-w-md w-full mx-auto px-4 py-8 animate-slide-in-right">' +
      '<button onclick="setView(\'renew-check\')" class="text-gray-500 mb-4 flex items-center hover:text-gray-900 transition">' +
      Icon("arrow-left", "w-5 h-5 mr-1") +
      " Back</button>" +
      '<div class="bg-white rounded-2xl shadow-xl overflow-hidden">' +
      '<div class="bg-gray-50 p-6 border-b border-gray-100 text-center">' +
      '<div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden border-4 border-white shadow-sm">' +
      '<img src="' +
      normalizePhotoURL(data.photoURL || ASSETS.miningLogo) +
      '" class="w-full h-full object-cover" onerror="this.onerror=null;this.src=\'./assets/icon.svg\'">' +
      "</div>" +
      '<h2 class="text-xl font-bold text-gray-900">' +
      (data.name || "—") +
      "</h2>" +
      '<p class="text-sm text-gray-500 font-mono bg-gray-200 inline-block px-2 py-0.5 rounded mt-1">' +
      (data.id || "—") +
      "</p>" +
      '<div class="mt-3 text-xs font-bold uppercase tracking-wider ' +
      (daysRemaining > 0 ? "text-green-600" : "text-red-600") +
      '">' +
      (daysRemaining > 0
        ? "Expires in " + daysRemaining + " days"
        : "Expired " + Math.abs(daysRemaining) + " days ago") +
      "</div>" +
      "</div>" +
      '<div class="p-6">' +
      (needed
        ? '<div class="text-center mb-6">' +
          '<div class="p-4 bg-orange-50 text-orange-800 rounded-xl mb-6 border border-orange-100">' +
          Icon("alert-circle", "w-8 h-8 mx-auto mb-2 text-orange-600") +
          '<p class="font-bold text-lg mb-1">Renewal Required</p>' +
          '<p class="text-xs opacity-90">Payment is required to renew your ID card.</p>' +
          "</div>" +
          '<div class="bg-white border-2 border-dashed border-gray-300 p-5 rounded-xl text-left">' +
          '<p class="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">Pay into this Account</p>' +
          '<div class="flex justify-between items-end mb-1">' +
          "<div>" +
          '<p class="font-black text-2xl text-gray-900 tracking-tight">5770123123</p>' +
          '<p class="text-sm font-bold text-emerald-700">Stanbic IBTC</p>' +
          "</div>" +
          '<button onclick="navigator.clipboard.writeText(\'5770123123\'); this.innerText=\'Copied!\'; setTimeout(()=>this.innerText=\'Copy\', 1500)" class="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-gray-600 transition text-xs font-bold">Copy</button>' +
          "</div>" +
          '<p class="text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2">Account Name: <span class="font-bold text-gray-700">YOBE MINING DEVELOPMENT COMPANY</span></p>' +
          "</div>" +
          '<p class="text-[10px] text-gray-400 mt-6 mb-4">Please include your ID <span class="font-mono text-gray-600">' +
          (data.id || "") +
          "</span> in the payment reference.</p>" +
          '<button onclick="recordPayment()" class="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition flex justify-center items-center gap-2">' +
          Icon("check-circle", "w-5 h-5") +
          " I Have Made Payment</button>" +
          "</div>"
        : '<div class="text-center py-8">' +
          '<div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">' +
          Icon("shield-check", "w-10 h-10") +
          "</div>" +
          '<h3 class="text-xl font-bold text-gray-900 mb-2">No Payment Required</h3>' +
          '<p class="text-gray-500 text-sm max-w-xs mx-auto">Your ID is valid and compliant.</p>' +
          '<div class="mt-8"><button onclick="setView(\'miner-portal\')" class="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition">Return to Menu</button></div>' +
          "</div>") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderAdminLogin() {
    return (
      '<div class="min-h-[70vh] flex items-center justify-center p-4">' +
      '<div class="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full animate-fade-in-up border border-gray-100">' +
      '<div class="text-center mb-6">' +
      '<div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">' +
      Icon("lock", "w-8 h-8 text-emerald-700") +
      "</div>" +
      '<h2 class="text-2xl font-bold text-gray-900">' +
      t("adminLogin") +
      "</h2>" +
      '<div class="mt-2 text-[11px] text-gray-400">Enter staff PIN. Location permission will be requested for field tracking.</div>' +
      '<div class="mt-2 text-[11px] text-gray-500 font-mono">Adams 1111 • Abba 2222 • Mustapha 4444 • Mohammed 5555 • Executive 3333</div>' +
      "</div>" +
      '<form onsubmit="handleAdminLogin(event)" class="space-y-4">' +
      "<div>" +
      '<label class="block text-sm font-medium text-gray-700 mb-1">Staff PIN</label>' +
      '<input id="admin-pin" type="password" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="••••" />' +
      "</div>" +
      '<button id="admin-submit" type="submit" class="w-full bg-emerald-800 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-emerald-900 transition-colors flex items-center justify-center">' +
      t("portalEntry") +
      "</button>" +
      "</form>" +
      '<div class="mt-4 text-center">' +
      '<button onclick="setView(\'landing\')" class="text-sm text-gray-500 hover:text-emerald-700">Cancel</button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderExitLogsSectionForStaff() {
    const rows = safeArray(state.exitLogs);
    const staffId = state.auth.staffId || "";
    const staffRows = rows.filter(
      (r) => String(r.staffName || r.staffId || "").trim() === String(staffId).trim()
    );

    const filterDate = state.staffExitFilterDate || "";
    const filtered = filterDate
      ? staffRows.filter((r) => {
          const dt = tryParseDateTime(r.time || r.Time || r.timeLocal);
          return dt && iso(dt) === filterDate;
        })
      : staffRows;

    const totalRevenueFiltered = filtered.reduce((s, r) => s + getExitRevenue(r), 0);
    const totalRevenueAll = staffRows.reduce((s, r) => s + getExitRevenue(r), 0);

    const latest = filtered.slice().reverse().slice(0, 200);

    return (
      '<div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-6">' +
      '<div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">' +
      '<h3 class="font-bold text-gray-800 flex items-center gap-2">' +
      Icon("log-out", "w-5 h-5 text-red-600") +
      " Exit Logs (Staff View)</h3>" +
      '<div class="flex items-center gap-3 text-xs text-gray-600 font-bold flex-wrap">' +
      '<div class="flex items-center gap-2">' +
      "<span>Date Filter</span>" +
      '<input type="date" value="' +
      (filterDate || "") +
      '" onchange="setStaffExitFilterDate(this.value)" class="border border-gray-300 rounded-lg px-2 py-1 text-xs">' +
      '<button onclick="setStaffExitFilterDate(\'\')" class="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-lg">All</button>' +
      "</div>" +
      '<span class="text-emerald-700">Filtered: ' +
      money(totalRevenueFiltered) +
      "</span>" +
      "<span>Total (Staff): " +
      money(totalRevenueAll) +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="overflow-x-auto">' +
      '<table class="w-full text-sm text-left">' +
      '<thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">' +
      "<tr>" +
      '<th class="px-6 py-3">Time</th>' +
      '<th class="px-6 py-3">Artisan ID</th>' +
      '<th class="px-6 py-3">Mineral</th>' +
      '<th class="px-6 py-3">Qty</th>' +
      '<th class="px-6 py-3">Unit Price</th>' +
      '<th class="px-6 py-3">Revenue</th>' +
      "</tr>" +
      "</thead>" +
      '<tbody class="divide-y divide-gray-100">' +
      (latest.length
        ? latest
            .map((r) => {
              const dt = tryParseDateTime(r.time || r.Time || r.timeLocal);
              const timeLabel = dt ? dt.toLocaleString() : r.timeLocal || "—";
              const qty = Number(r.quantity || r.Quantity || 0);
              const unit = String(r.unit || r.Unit || "").toLowerCase();
              const qtyLabel = qty ? fmtNum(qty) + " " + unitLabel(unit || "unit", qty) : "—";
              const p = Number(r.unitPrice || r.UnitPrice || 0);
              const rev = getExitRevenue(r);

              return (
                '<tr class="hover:bg-gray-50 transition">' +
                '<td class="px-6 py-4 text-xs text-gray-600 font-mono">' +
                timeLabel +
                "</td>" +
                '<td class="px-6 py-4 font-mono font-bold text-gray-900">' +
                (r.id || r.ID || "—") +
                "</td>" +
                '<td class="px-6 py-4 font-bold text-gray-800">' +
                (r.mineral || r.Mineral || "—") +
                "</td>" +
                '<td class="px-6 py-4">' +
                qtyLabel +
                "</td>" +
                '<td class="px-6 py-4 font-mono">' +
                (p ? money(p) : "—") +
                "</td>" +
                '<td class="px-6 py-4 font-black text-emerald-700">' +
                (rev ? money(rev) : "—") +
                "</td>" +
                "</tr>"
              );
            })
            .join("")
        : '<tr><td colspan="6" class="px-6 py-6 text-center text-gray-500">No exit logs for this filter.</td></tr>') +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>"
    );
  }

  function renderAdminDashboard() {
    const filteredApps = state.applications.filter(
      (a) =>
        String(a.name || "").toLowerCase().includes(state.adminSearch) ||
        String(a.id || "").toLowerCase().includes(state.adminSearch)
    );
    const pendingCount = state.applications.filter((a) => (a.status || "Pending") === "Pending").length;

    const loc = state.staffLocStatus;
    const locOk = !!loc.lastLoggedAt && !loc.error;

    return (
      '<div class="min-h-screen bg-gray-50 text-gray-800 pb-12 animate-fade-in-up">' +
      '<div class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">' +
      '<div class="flex items-center">' +
      '<div class="p-2 bg-orange-100 rounded-lg mr-3">' +
      Icon("hard-hat", "w-6 h-6 text-orange-700") +
      "</div>" +
      "<div>" +
      '<h2 class="text-xl font-bold text-gray-900 tracking-tight">Staff Operations</h2>' +
      '<div class="text-xs text-gray-500">Field Ops • Staff: <span class="font-mono font-bold">' +
      (state.auth.staffName || "—") +
      "</span></div>" +
      "</div>" +
      "</div>" +

      '<div class="flex items-center space-x-4">' +
      '<div class="text-right hidden md:block">' +
      '<div class="text-xs text-gray-400 uppercase font-bold tracking-wider">Local Time</div>' +
      '<div class="text-lg font-mono font-bold text-gray-800 live-time">' +
      state.timeString +
      "</div>" +
      "</div>" +
      '<button onclick="logout()" class="flex items-center bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl transition-colors text-sm font-bold border border-gray-200">' +
      Icon("log-out", "w-4 h-4 mr-2") +
      " " +
      t("logout") +
      "</button>" +
      "</div>" +
      "</div>" +

      '<div class="max-w-6xl mx-auto p-6 md:p-8">' +
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">' +
      '<div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">' +
      '<div class="flex justify-between items-start mb-2">' +
      '<p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Records</p>' +
      '<div class="p-2 bg-orange-50 text-orange-600 rounded-lg">' +
      Icon("file-clock", "w-5 h-5") +
      "</div>" +
      "</div>" +
      '<h3 class="text-3xl font-bold text-gray-900">' +
      pendingCount +
      "</h3>" +
      '<p class="text-xs text-orange-600 mt-1 font-medium">Requires review</p>' +
      "</div>" +

      '<div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">' +
      '<div class="flex justify-between items-start mb-2">' +
      '<p class="text-xs font-bold text-gray-400 uppercase tracking-wider">On-site Scans (Session)</p>' +
      '<div class="p-2 bg-purple-50 text-purple-600 rounded-lg">' +
      Icon("scan", "w-5 h-5") +
      "</div>" +
      "</div>" +
      '<h3 class="text-3xl font-bold text-gray-900">' +
      state.onSiteArtisans.length +
      "</h3>" +
      '<p class="text-xs text-purple-600 mt-1 font-medium">IDs scanned today</p>' +
      "</div>" +

      '<div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">' +
      '<div class="flex justify-between items-start mb-2">' +
      '<p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Location Status</p>' +
      '<div class="p-2 ' +
      (locOk ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600") +
      ' rounded-lg">' +
      Icon("map-pin", "w-5 h-5") +
      "</div>" +
      "</div>" +
      '<div class="text-sm font-bold text-gray-900">' +
      (locOk ? "Logged" : "Not Logged") +
      "</div>" +
      '<div class="text-[11px] text-gray-500 mt-1">' +
      (locOk
        ? 'Last: <span class="font-mono">' +
          new Date(loc.lastLoggedAt).toLocaleString() +
          "</span><br/>Lat: <span class=\"font-mono\">" +
          Number(loc.lat || 0).toFixed(5) +
          "</span> • Lng: <span class=\"font-mono\">" +
          Number(loc.lng || 0).toFixed(5) +
          "</span>"
        : loc.error
          ? loc.error
          : "Allow location permission to enable field tracking.") +
      "</div>" +
      '<button onclick="manualLogLocationNow()" class="mt-3 text-xs bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 px-3 py-2 rounded-lg font-bold inline-flex items-center gap-2">' +
      Icon("satellite", "w-4 h-4") +
      " Log Location Now</button>" +
      "</div>" +
      "</div>" +

      '<div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">' +
      '<div class="px-6 py-4 border-b border-gray-100 bg-gray-50">' +
      '<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">' +
      '<div class="flex items-center justify-between md:justify-start gap-3">' +
      '<h3 class="font-bold text-gray-800 flex items-center gap-2">' +
      Icon("inbox", "w-5 h-5 text-gray-500") +
      " Miner Records Queue</h3>" +
      '<div class="relative w-full md:w-56">' +
      '<input type="text" oninput="handleAdminSearch(event)" placeholder="Search..." class="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500">' +
      '<div class="absolute left-2.5 top-2.5 text-gray-400">' +
      Icon("search", "w-3 h-3") +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="flex flex-wrap gap-2 justify-start md:justify-end">' +
      '<button onclick="openRegisterMiner()" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2">' +
      Icon("user-plus", "w-4 h-4") +
      " Register Miner</button>" +
      '<button onclick="openQRScanner(\'global\')" class="bg-gray-900 hover:bg-black text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2">' +
      Icon("scan", "w-4 h-4") +
      " Scan ID</button>" +
      '<button onclick="openExitLog()" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2">' +
      Icon("log-out", "w-4 h-4") +
      " Log Exit</button>" +
      "</div>" +
      "</div>" +
      "</div>" +

      '<div class="overflow-x-auto">' +
      '<table class="w-full text-sm text-left">' +
      '<thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">' +
      "<tr>" +
      '<th class="px-6 py-3">Miner</th>' +
      '<th class="px-6 py-3">Location</th>' +
      '<th class="px-6 py-3">Status</th>' +
      '<th class="px-6 py-3 text-center">Actions</th>' +
      "</tr>" +
      "</thead>" +
      '<tbody class="divide-y divide-gray-100">' +
      filteredApps
        .map((a) => {
          const status = a.status || "Pending";
          const statusClass =
            status === "Approved"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700";

          return (
            '<tr class="hover:bg-gray-50 transition">' +
            '<td class="px-6 py-4 font-medium text-gray-900">' +
            "<div>" +
            (a.name || "—") +
            "</div>" +
            '<div class="text-[10px] text-gray-400 font-mono">ID: ' +
            (a.id || "—") +
            "</div>" +
            "</td>" +
            '<td class="px-6 py-4">' +
            (a.location || a.lga || "—") +
            "</td>" +
            '<td class="px-6 py-4"><span class="px-2 py-1 rounded text-xs font-bold ' +
            statusClass +
            '">' +
            status +
            "</span></td>" +
            '<td class="px-6 py-4"><div class="flex items-center justify-center gap-2">' +
            '<button onclick="viewApplication(\'' +
            a.id +
            '\')" title="View" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition">' +
            Icon("eye", "w-4 h-4") +
            "</button>" +
            (status !== "Approved"
              ? '<button onclick="updateStatus(\'' +
                a.id +
                "\', \'Approved\')" +
                '" title="Approve" class="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition">' +
                Icon("check", "w-4 h-4") +
                "</button>"
              : "") +
            (status !== "Rejected"
              ? '<button onclick="updateStatus(\'' +
                a.id +
                "\', \'Rejected\')" +
                '" title="Reject" class="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition">' +
                Icon("x", "w-4 h-4") +
                "</button>"
              : "") +
            '<button onclick="editApplication(\'' +
            a.id +
            "\')" +
            '" title="Edit" class="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition">' +
            Icon("pencil", "w-4 h-4") +
            "</button>" +
            '<button onclick="deleteApplication(\'' +
            a.id +
            "\')" +
            '" title="Delete" class="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 transition">' +
            Icon("trash-2", "w-4 h-4") +
            "</button>" +
            "</div></td>" +
            "</tr>"
          );
        })
        .join("") +
      (filteredApps.length === 0
        ? '<tr><td colspan="4" class="px-6 py-6 text-center text-gray-500">No records found.</td></tr>'
        : "") +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>" +

      renderExitLogsSectionForStaff() +
      "</div>" +
      "</div>"
    );
  }

  // =========================
  // MD Map (real dots only)
  // =========================
  function initMDMap() {
    const el = document.getElementById("md-map");
    if (!el) return;

    if (mdMap) {
      try {
        mdMap.remove();
      } catch (e) {}
      mdMap = null;
      mdArtisanLayer = null;
      mdStaffLayer = null;
    }

    mdMap = L.map("md-map", { scrollWheelZoom: false }).setView([12.2, 11.8], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap",
    }).addTo(mdMap);

    mdArtisanLayer = L.layerGroup().addTo(mdMap);
    mdStaffLayer = L.layerGroup().addTo(mdMap);
  }

  function updateMDMapMarkers(artisans, staffLatest) {
    if (!mdMap || !mdArtisanLayer || !mdStaffLayer) return;

    mdArtisanLayer.clearLayers();
    mdStaffLayer.clearLayers();

    const bounds = [];

    // Artisans = red dots (actual GPS only)
    (artisans || []).forEach((a) => {
      const lat = Number(a.lat);
      const lng = Number(a.lng);
      if (!isFinite(lat) || !isFinite(lng)) return;

      const capturedAt = a.locationCapturedAt ? tryParseDateTime(a.locationCapturedAt) : null;
      const capturedLabel = capturedAt ? capturedAt.toLocaleString() : a.locationCapturedAt || "—";

      const marker = L.circleMarker([lat, lng], {
        radius: 6,
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.9,
        weight: 1,
      }).bindPopup(
        "<b>" +
          (a.name || "Artisan") +
          "</b><br/>" +
          '<span class="font-mono">' +
          (a.id || "") +
          "</span><br/>" +
          "LGA: " +
          (a.location || a.lga || "—") +
          "<br/>" +
          "Captured: " +
          capturedLabel
      );

      marker.addTo(mdArtisanLayer);
      bounds.push([lat, lng]);
    });

    // Staff = green dots (actual GPS logs, latest per staff)
    (staffLatest || []).forEach((s) => {
      const lat = Number(s.lat);
      const lng = Number(s.lng);
      if (!isFinite(lat) || !isFinite(lng)) return;

      const marker = L.circleMarker([lat, lng], {
        radius: 6,
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.9,
        weight: 1,
      }).bindPopup(
        "<b>" +
          (s.staffId || "Staff") +
          "</b><br/>" +
          "Event: <span class=\"font-mono\">" +
          (s.event || "—") +
          "</span><br/>" +
          "Time: " +
          (s.timeLocal || s.time || "—")
      );

      marker.addTo(mdStaffLayer);
      bounds.push([lat, lng]);
    });

    if (bounds.length) {
      mdMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }

  // NOTE: renderMDDashboard + renderApplicationPreviewModal + render() below are unchanged from your original,
  // except for minor footer safe-area padding and modal sizing already handled above.
  // To keep this patch readable, they are included verbatim.

  function renderMDDashboard() {
    const staffLatest = state.md.staffLatest || [];
    const staffOnField = state.md.staffOnField || [];
    const lastRef = state.md.lastRefreshAt ? new Date(state.md.lastRefreshAt).toLocaleTimeString() : "—";

    const mdSearch = state.mdSearch || "";
    const mdLga = state.mdFilterLga || "All";

    const lgaCounts = LGAs.reduce((acc, l) => {
      acc[l] = 0;
      return acc;
    }, {});
    state.applications.forEach((a) => {
      const l = a.location || a.lga || "";
      if (lgaCounts[l] !== undefined) lgaCounts[l] += 1;
    });

    const filteredArtisans = state.applications.filter((a) => {
      const byLga = mdLga === "All" || String(a.location || a.lga || "") === mdLga;
      const bySearch =
        String(a.name || "").toLowerCase().includes(mdSearch) ||
        String(a.id || "").toLowerCase().includes(mdSearch);
      return byLga && bySearch;
    });

    const revenueByMineral = Object.entries(state.md.revenueByMineral || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const revenueByStaff = Object.entries(state.md.revenueByStaff || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const revenueByLocation = Object.entries(state.md.revenueByLocation || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return `
          <div class="min-h-screen bg-gray-50 text-gray-800 pb-12 animate-fade-in-up font-sans">
            <div class="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
              <div class="flex items-center">
                <div class="p-2 bg-emerald-100 rounded-lg mr-3">${Icon("shield", "w-6 h-6 text-emerald-700")}</div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900 tracking-tight">${t("mdDashboard")}</h2>
                  <div class="text-xs text-gray-500 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    System Operational
                    <span class="text-[11px] text-gray-400">• Refreshed: <span class="font-mono">${lastRef}</span></span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <button onclick="refreshMDNow()" class="hidden md:flex items-center gap-2 text-xs bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-200 transition text-gray-700 font-bold">
                  ${Icon("refresh-cw","w-4 h-4")} Refresh Now
                </button>

                <div class="text-right hidden md:block">
                  <div class="text-xs text-gray-400 uppercase font-bold tracking-wider">Local Time</div>
                  <div class="text-lg font-mono font-bold text-gray-800 live-time">${state.timeString}</div>
                </div>

                <button onclick="logout()" class="flex items-center bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl transition-colors text-sm font-bold border border-gray-200">
                  ${Icon("log-out","w-4 h-4 mr-2")} ${t("logout")}
                </button>
              </div>
            </div>

            <div class="max-w-[1600px] mx-auto p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue Today</p>
                  <h3 class="text-3xl font-bold text-gray-900 mt-1">₦ ${fmtMoney(state.md.revenueToday)}</h3>
                  <p class="text-xs text-gray-500 mt-2 font-medium">${todayISO()}</p>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Lifetime Revenue</p>
                  <h3 class="text-3xl font-bold text-gray-900 mt-1">₦ ${fmtMoney(state.md.revenueLifetime)}</h3>
                  <p class="text-xs text-gray-500 mt-2 font-medium">All Exit Logs</p>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Artisans</p>
                  <h3 class="text-3xl font-bold text-gray-900 mt-1">${fmtNum(state.md.artisansTotal)}</h3>
                  <p class="text-xs text-gray-500 mt-2 font-medium">Registered records</p>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Staff on Field</p>
                  <h3 class="text-3xl font-bold text-gray-900 mt-1">${fmtNum(state.md.staffOnFieldCount)}</h3>
                  <p class="text-xs text-gray-500 mt-2 font-medium">Last 6 hours</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                  <div class="flex justify-between items-center mb-4">
                    <div>
                      <h3 class="font-bold text-gray-900 flex items-center gap-2">${Icon("radar","w-5 h-5 text-emerald-700")} Staff Location Logs</h3>
                      <div class="text-xs text-gray-500">“On field” = last seen within 6 hours. Green dots on map = GPS login/heartbeat logs (latest per staff).</div>
                    </div>
                    <div class="text-right">
                      <div class="text-[11px] text-gray-400 uppercase font-bold">Staff on Field</div>
                      <div class="text-2xl font-black text-gray-900">${state.md.staffOnFieldCount}</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">On Field (Latest)</div>
                      <div class="space-y-2 max-h-56 overflow-y-auto custom-scroll">
                        ${staffOnField.length ? staffOnField.map(s => {
                          const dt = s._dt;
                          const ago = dt ? hoursAgo(dt) : 999;
                          const mapLink = `https://www.google.com/maps?q=${s.lat},${s.lng}`;
                          return `
                            <div class="bg-white rounded-xl border border-gray-100 p-3 flex items-start justify-between gap-3">
                              <div>
                                <div class="font-bold text-gray-900 text-sm">${s.staffId}</div>
                                <div class="text-[11px] text-gray-500 font-mono">Lat ${Number(s.lat||0).toFixed(5)} • Lng ${Number(s.lng||0).toFixed(5)}</div>
                                <div class="text-[11px] text-gray-400">Last seen: <span class="font-mono">${dt ? dt.toLocaleString() : '—'}</span></div>
                              </div>
                              <div class="text-right">
                                <div class="text-[10px] font-bold px-2 py-1 rounded-full ${ago <= 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}">
                                  ${ago.toFixed(1)}h ago
                                </div>
                                <a href="${mapLink}" target="_blank" class="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline">
                                  ${Icon("external-link","w-3 h-3")} View
                                </a>
                              </div>
                            </div>
                          `;
                        }).join('') : `<div class="text-sm text-gray-500">No staff currently on field.</div>`}
                      </div>
                    </div>

                    <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">All Staff (Latest Logs)</div>
                      <div class="space-y-2 max-h-56 overflow-y-auto custom-scroll">
                        ${staffLatest.length ? staffLatest.slice(0, 25).map(s => {
                          const dt = s._dt;
                          const ago = dt ? hoursAgo(dt) : 999;
                          const mapLink = `https://www.google.com/maps?q=${s.lat},${s.lng}`;
                          return `
                            <div class="bg-white rounded-xl border border-gray-100 p-3 flex items-start justify-between gap-3">
                              <div>
                                <div class="font-bold text-gray-900 text-sm">${s.staffId}</div>
                                <div class="text-[11px] text-gray-500">Event: <span class="font-mono">${s.event || '—'}</span></div>
                                <div class="text-[11px] text-gray-500 font-mono">(${Number(s.lat||0).toFixed(5)}, ${Number(s.lng||0).toFixed(5)})</div>
                              </div>
                              <div class="text-right">
                                <div class="text-[10px] font-bold px-2 py-1 rounded-full ${ago <= 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}">
                                  ${ago.toFixed(1)}h
                                </div>
                                <a href="${mapLink}" target="_blank" class="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline">
                                  ${Icon("external-link","w-3 h-3")} View
                                </a>
                              </div>
                            </div>
                          `;
                        }).join('') : `<div class="text-sm text-gray-500">No staff location logs yet.</div>`}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-3">
                      <h3 class="font-bold text-gray-900 flex items-center gap-2">${Icon("layers","w-5 h-5 text-red-600")} Revenue by Mineral</h3>
                      <span class="text-[11px] font-mono text-gray-500">${todayISO()}</span>
                    </div>
                    <div class="space-y-2">
                      ${revenueByMineral.length ? revenueByMineral.map(([k,v]) => `
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-700 font-medium">${k}</span>
                          <span class="font-mono font-bold text-gray-900">${money(v)}</span>
                        </div>
                      `).join('') : `<div class="text-sm text-gray-500">No exit logs yet.</div>`}
                    </div>
                  </div>

                  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mineral Price List (Fixed)</div>
                    <div class="space-y-2">
                      ${MINERAL_CATALOG.map(k => `
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-700 font-medium">${k.name}</span>
                          <span class="font-mono font-bold text-gray-900">${money(k.price)} / ${unitLabel(k.unit,1)}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 class="font-bold text-gray-900 flex items-center gap-2">${Icon("filter","w-5 h-5 text-emerald-700")} Artisan Filtering & Summary</h3>
                    <div class="text-xs text-gray-500">Total artisans, filter by LGA, search by name/ID, and LGA breakdown.</div>
                  </div>
                  <div class="flex flex-wrap items-center gap-3">
                    <input type="text" oninput="handleMDSearch(event)" placeholder="Search name or ID..." class="px-3 py-2 border border-gray-300 rounded-xl text-xs w-56">
                    <select onchange="setMDLgaFilter(this.value)" class="px-3 py-2 border border-gray-300 rounded-xl text-xs">
                      <option value="All"${mdLga==='All'?' selected':''}>All LGAs</option>
                      ${LGAs.map(l => `<option value="${l}"${mdLga===l?' selected':''}>${l}</option>`).join('')}
                    </select>
                    <div class="text-xs font-bold text-gray-700">Filtered: ${filteredArtisans.length}</div>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div class="lg:col-span-2">
                    <div class="overflow-x-auto border border-gray-200 rounded-xl">
                      <table class="w-full text-sm text-left">
                        <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th class="px-4 py-3">Artisan</th>
                            <th class="px-4 py-3">LGA</th>
                            <th class="px-4 py-3">Mineral</th>
                            <th class="px-4 py-3">GPS</th>
                            <th class="px-4 py-3">ID</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                          ${filteredArtisans.slice(0, 150).map(a => {
                            const hasGps = isFinite(Number(a.lat)) && isFinite(Number(a.lng));
                            return `
                              <tr class="hover:bg-gray-50 transition">
                                <td class="px-4 py-3">${a.name || '—'}</td>
                                <td class="px-4 py-3">${a.location || a.lga || '—'}</td>
                                <td class="px-4 py-3">${a.mineral || '—'}</td>
                                <td class="px-4 py-3 text-xs ${hasGps ? 'text-emerald-700 font-bold' : 'text-gray-400'}">
                                  ${hasGps ? 'Yes' : 'No'}
                                </td>
                                <td class="px-4 py-3 font-mono font-bold">${a.id || '—'}</td>
                              </tr>
                            `;
                          }).join('')}
                          ${filteredArtisans.length === 0 ? '<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500">No artisans found.</td></tr>' : ''}
                        </tbody>
                      </table>
                    </div>
                    <div class="text-[11px] text-gray-500 mt-2">Only artisans with captured GPS will appear as red dots on the map.</div>
                  </div>

                  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Count by LGA</div>
                    <div class="space-y-2 max-h-72 overflow-y-auto custom-scroll">
                      ${LGAs.map(l => `
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-700 font-medium">${l}</span>
                          <span class="font-mono font-bold text-gray-900">${fmtNum(lgaCounts[l] || 0)}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-8 mt-8">
                <div class="col-span-12 lg:col-span-8 space-y-8">
                  <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md relative h-[420px] md:h-[600px]">
                    <div class="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs border border-gray-200 shadow-sm flex items-center gap-3">
                      <span class="w-2 h-2 rounded-full bg-red-500"></span><span class="font-bold text-gray-700">Artisans (Red)</span>
                      <span class="w-2 h-2 rounded-full bg-green-500"></span><span class="font-bold text-gray-700">Staff Logs (Green)</span>
                    </div>

                    <div class="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs border border-gray-200 shadow-sm">
                      <span class="font-bold text-gray-700">LIVE MAP: REAL GPS POINTS ONLY</span>
                    </div>

                    <div id="md-map"></div>
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-4 space-y-6">
                  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Revenue by Staff</div>
                    <div class="space-y-2">
                      ${revenueByStaff.length ? revenueByStaff.map(([k,v]) => `
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-700 font-medium">${k}</span>
                          <span class="font-mono font-bold text-gray-900">${money(v)}</span>
                        </div>
                      `).join('') : `<div class="text-sm text-gray-500">No exit logs yet.</div>`}
                    </div>
                  </div>

                  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Revenue by Location</div>
                    <div class="space-y-2">
                      ${revenueByLocation.length ? revenueByLocation.map(([k,v]) => `
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-700 font-medium">${k}</span>
                          <span class="font-mono font-bold text-gray-900">${money(v)}</span>
                        </div>
                      `).join('') : `<div class="text-sm text-gray-500">No exit logs yet.</div>`}
                    </div>
                  </div>

                  <div class="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                    <div class="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                      <span class="text-xs font-bold text-gray-300 flex items-center gap-2">
                        ${Icon("camera", "w-3 h-3")} SITE SURVEILLANCE
                      </span>
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-red-500 blink-red"></span>
                        <span class="text-[10px] font-mono text-red-400">REC</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-0.5 bg-black p-0.5">
                      ${[
                        { url: "https://embed.skylinewebcams.com/img/992.jpg", name: "TSAVO EAST (KENYA)" },
                        { url: "https://embed.skylinewebcams.com/img/165.jpg", name: "ROME PANTHEON" },
                        { url: "https://embed.skylinewebcams.com/img/607.jpg", name: "PIAZZA VENEZIA" },
                        { url: "https://embed.skylinewebcams.com/img/4309.jpg", name: "DIANI BEACH" }
                      ].map(feed => `
                        <div class="relative aspect-video bg-gray-800 group overflow-hidden">
                          <img src="${feed.url}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" />
                          <div class="absolute top-2 left-2 text-[8px] bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur font-mono">${feed.name}</div>
                          <div class="absolute bottom-2 right-2 text-[8px] font-mono text-white/80 live-time">${state.timeString}</div>
                        </div>
                      `).join('')}
                    </div>

                    <div class="px-4 py-2 bg-gray-800 text-[10px] text-gray-400 font-mono text-center">
                      Feeds auto-refreshing every 5s | Secure Connection
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
  }

  function renderApplicationPreviewModal() {
    const a = state.applications.find((x) => x.id === state.previewAppId);
    if (!a) return "";

    const qrText = String(a.id || "").toUpperCase();

    const card =
      '<div class="relative w-[300px] h-[480px] bg-gradient-to-br from-green-800 to-green-950 rounded-xl shadow-2xl overflow-hidden text-white flex flex-col items-center pt-6 pb-4 px-4 border border-yellow-500/30 mx-auto">' +
      '<div class="flex flex-col items-center mb-4 z-10 text-center">' +
      '<img src="' +
      ASSETS.miningLogo +
      '" class="w-12 h-12 object-contain mb-1 rounded-full bg-white/10 p-1" onerror="this.onerror=null;this.src=\'./assets/icon.svg\'">' +
      '<h1 class="text-sm font-bold font-serif text-yellow-400">YOBE MINING DEVELOPMENT COMPANY</h1>' +
      "</div>" +
      '<div class="w-24 h-24 rounded-full border-2 border-yellow-400 overflow-hidden shadow-lg mb-2 z-10 bg-gray-300">' +
      '<img src="' +
      normalizePhotoURL(a.photoURL || ASSETS.miningLogo) +
      '" class="w-full h-full object-cover" onerror="this.onerror=null;this.src=\'./assets/icon.svg\'">' +
      "</div>" +
      '<div class="text-center z-10 w-full">' +
      '<h2 class="text-lg font-bold text-white truncate">' +
      (a.name || "—") +
      "</h2>" +
      '<p class="text-xs text-green-300 uppercase">' +
      (a.location || a.lga || "—") +
      " LGA</p>" +
      '<div class="bg-white/10 rounded p-1 flex justify-between items-center text-[10px] border border-white/10 mt-2">' +
      '<div class="text-left"><div>Mineral</div><div class="font-bold text-yellow-300">' +
      (a.mineral || "—") +
      "</div></div>" +
      '<div class="text-right"><div>ID</div><div class="font-mono font-bold text-white">' +
      (a.id || "—") +
      "</div></div>" +
      "</div>" +
      '<div class="bg-white/10 rounded p-1 flex justify-between items-center text-[10px] border border-white/10 mt-2">' +
      '<div class="text-left"><div>GPS</div><div class="font-mono font-bold text-white">' +
      (isFinite(Number(a.lat)) && isFinite(Number(a.lng)) ? "YES" : "NO") +
      "</div></div>" +
      '<div class="text-right"><div>Captured</div><div class="font-mono font-bold text-white">' +
      (a.locationCapturedAt ? String(a.locationCapturedAt).slice(0, 10) : "—") +
      "</div></div>" +
      "</div>" +
      "</div>" +
      '<div class="mt-auto z-10 w-full flex justify-between items-end">' +
      '<div class="w-16 h-16 border border-white/20 p-1 bg-white rounded"><div class="w-full h-full" data-qr-text="' +
      qrText +
      '"></div></div>' +
      '<div class="text-right"><div class="text-[10px] text-white/60 uppercase">Status</div><div class="text-sm font-bold">' +
      (a.status || "Pending") +
      "</div></div>" +
      "</div>" +
      "</div>";

    return (
      '<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up" onclick="if(event.target === this) closePreview()">' +
      '<div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92dvh] overflow-hidden flex flex-col">' +
      '<div class="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">' +
      '<h3 class="font-bold text-gray-800">Record #' +
      (a.id || "—") +
      "</h3>" +
      '<button onclick="closePreview()" class="text-gray-500 hover:text-gray-800">' +
      Icon("x", "w-6 h-6") +
      "</button>" +
      "</div>" +
      '<div class="p-8 bg-gray-200 flex justify-center overflow-y-auto">' +
      card +
      "</div>" +
      '<div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 flex-wrap">' +
      '<button onclick="closePreview()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Close</button>' +
      ((a.status || "Pending") === "Pending"
        ? '<button onclick="updateStatus(\'' +
          a.id +
          "\', \'Rejected\'); closePreview()" +
          '" class="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium">Reject</button>' +
          '<button onclick="updateStatus(\'' +
          a.id +
          "\', \'Approved\'); closePreview()" +
          '" class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold shadow">Approve</button>'
        : "") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  // =========================
  // Render loop
  // =========================
  function render() {
    let content = "";

    if (state.view === "landing") content = renderLanding();
    else if (state.view === "miner-portal") content = renderMinerPortal();
    else if (state.view === "artisan-form") content = renderArtisanForm();
    else if (state.view === "success") content = renderSuccess();
    else if (state.view === "search-success") content = renderSearchSuccess();
    else if (state.view === "status-check") {
      content =
        '<div class="max-w-md w-full mx-auto px-4 py-8 animate-slide-in-right">' +
        '<button onclick="setView(\'miner-portal\')" class="text-gray-500 mb-4 flex items-center hover:text-gray-900 transition">' +
        Icon("arrow-left", "w-5 h-5 mr-1") +
        " " +
        t("back") +
        "</button>" +
        '<div class="bg-white rounded-2xl shadow-xl p-6 text-center">' +
        '<h2 class="text-xl font-bold text-gray-800 mb-2">Check ID Status</h2>' +
        '<input id="status-input" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4" placeholder="Enter ART-XXXXXX" />' +
        '<div id="status-msg"></div>' +
        '<button id="status-btn" onclick="checkStatus()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Check</button>' +
        '<p class="mt-3 text-xs text-gray-500">Only Artisan IDs are supported right now.</p>' +
        "</div>" +
        "</div>";
    } else if (state.view === "renew-check") content = renderRenewCheck();
    else if (state.view === "renewal-details") content = renderRenewalDetails();
    else if (state.view === "admin-login") content = renderAdminLogin();
    else if (state.view === "admin-dashboard") content = renderAdminDashboard();
    else if (state.view === "md-dashboard") content = renderMDDashboard();
    else content = renderLanding();

    app.innerHTML =
      renderHeader() +
      '<main class="flex-1">' +
      content +
      "</main>" +
      renderApplicationPreviewModal() +
      renderExitLogModal() +
      renderQRScannerModal() +
      renderCameraModal() +
      renderSystemDialog() +
      renderIOSInstallHint() +
      renderSiteFooter();

    try {
      lucide.createIcons();
    } catch (e) {}

    // Ensure QR placeholders render into real QR codes (local canvas/img)
    try {
      hydrateQrCodes(app);
    } catch (e) {}

    // Initialize / update MD map after DOM exists
    if (state.view === "md-dashboard") {
      setTimeout(() => {
        initMDMap();

        const mdSearch = state.mdSearch || "";
        const mdLga = state.mdFilterLga || "All";
        const filteredArtisans = state.applications.filter((a) => {
          const byLga = mdLga === "All" || String(a.location || a.lga || "") === mdLga;
          const bySearch =
            String(a.name || "").toLowerCase().includes(mdSearch) ||
            String(a.id || "").toLowerCase().includes(mdSearch);
          return byLga && bySearch;
        });

        updateMDMapMarkers(filteredArtisans, state.md.staffLatest || []);
      }, 60);
    } else {
      if (mdMap) {
        try {
          mdMap.remove();
        } catch (e) {}
        mdMap = null;
        mdArtisanLayer = null;
        mdStaffLayer = null;
      }
    }
  }

  // Boot
  hydrateLocal();
  if (window.location && window.location.protocol === "file:") {
    // PWA + manifest + service worker + camera permissions + CORS won't work reliably on file://
    // The app must be served over http(s).
    setTimeout(() => {
      uiAlert("Open this app via http://localhost (or HTTPS). Do not open index.html with file://.");
    }, 50);
  }
  render();
})();
