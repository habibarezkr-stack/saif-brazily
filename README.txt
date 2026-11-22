Saif Brazily - Firebase website

تم تجهيز config.js ببيانات مشروع Firebase التي أرسلتها.

قبل النشر:
1) في Firebase Authentication > Sign-in method، تأكد من تفعيل Email/Password.
2) Firestore Database: انشر محتوى firestore.rules من تبويب Rules.
3) ارفع الملفات الستة إلى مشروع Vercel الحالي saif-brazily.
4) افتح الموقع وأنشئ حسابك بالبريد وكلمة المرور.
5) من Firebase Console > Firestore > Data افتح users ثم مستند UID الخاص بحسابك.
6) عدّل الحقل isAdmin إلى Boolean true والحقل status إلى String approved.
7) بعد ذلك سجّل الخروج والدخول؛ ستظهر لوحة الإدارة.

ملاحظات:
- لا تشارك كلمة مرور حسابك.
- Firebase apiKey في تطبيق الويب ليست كلمة مرور إدارية؛ الحماية الفعلية في Firestore Rules.
- زر Apple يفتح صفحة الإعداد الرسمية فقط ولا ينشئ ملف eSIM أو يضمن التفعيل.
- فحص IMEI يتحقق من 15 رقمًا فقط، ولا يثبت توافق الجهاز.
