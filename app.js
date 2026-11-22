(() => {
  const $ = id => document.getElementById(id);
  const msg = (id, text) => { $(id).textContent = text; };
  if (!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey) {
    msg("auth-message", "إعداد Firebase غير مكتمل. راجع ملف config.js.");
    return;
  }
  if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
  const auth = firebase.auth(), db = firebase.firestore();
  $("check-imei").addEventListener("click", () => {
    const v = $("imei").value.trim();
    msg("imei-result", /^\d{15}$/.test(v) ? "صيغة IMEI صحيحة (15 رقمًا). هذا لا يؤكد توافق eSIM." : "يرجى إدخال 15 رقمًا بالضبط.");
  });
  $("signup").addEventListener("click", async () => {
    const email = $("email").value.trim(), password = $("password").value;
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(cred.user.uid).set({
        email, status: "pending", isAdmin: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      msg("auth-message", "تم إنشاء الحساب. حسابك ينتظر موافقة الإدارة.");
    } catch(e) { msg("auth-message", e.message); }
  });
  $("login").addEventListener("click", async () => {
    try { await auth.signInWithEmailAndPassword($("email").value.trim(), $("password").value); }
    catch(e) { msg("auth-message", e.message); }
  });
  $("logout").addEventListener("click", () => auth.signOut());
  auth.onAuthStateChanged(async user => {
    $("logout").hidden = !user;
    $("admin-panel").hidden = true;
    if (!user) { msg("auth-message", "سجّل الدخول أو أنشئ حسابًا جديدًا."); return; }
    try {
      const snap = await db.collection("users").doc(user.uid).get();
      if (!snap.exists) { msg("auth-message", "ملف الحساب غير موجود. تواصل مع الإدارة."); return; }
      const data = snap.data();
      if (data.isAdmin === true) {
        msg("auth-message", "مرحبًا بالمدير.");
        $("admin-panel").hidden = false;
        loadPending();
      } else if (data.status === "approved") {
        msg("auth-message", "تمت الموافقة على حسابك.");
      } else if (data.status === "rejected") {
        msg("auth-message", "لم تتم الموافقة على الحساب.");
      } else {
        msg("auth-message", "حسابك قيد مراجعة الإدارة.");
      }
    } catch(e) { msg("auth-message", "تعذر تحميل حالة الحساب: " + e.message); }
  });
  async function loadPending() {
    const host = $("pending-users"); host.textContent = "جارٍ تحميل الطلبات...";
    try {
      const snap = await db.collection("users").where("status", "==", "pending").get();
      host.innerHTML = "";
      if (snap.empty) { host.textContent = "لا توجد طلبات معلّقة."; return; }
      snap.forEach(doc => {
        const d = doc.data(), row = document.createElement("div");
        row.className = "panel";
        const label = document.createElement("p"); label.textContent = d.email || doc.id; row.appendChild(label);
        for (const [status, title] of [["approved","موافقة"],["rejected","رفض"]]) {
          const b = document.createElement("button"); b.textContent = title;
          b.addEventListener("click", async () => {
            try { await doc.ref.update({status}); await loadPending(); }
            catch(e) { alert("تعذر تحديث الطلب: " + e.message); }
          });
          row.appendChild(b);
        }
        host.appendChild(row);
      });
    } catch(e) { host.textContent = "تعذر تحميل الطلبات: " + e.message; }
  }
})();