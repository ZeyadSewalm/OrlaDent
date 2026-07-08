/* ==========================================================================
   ORLADENT — i18n.js
   Lightweight bilingual (EN/AR) text-swap engine.
   - data-i18n="key"        -> element.textContent = translation
   - data-i18n-html="key"   -> element.innerHTML = translation (preserves markup)
   - data-i18n-placeholder="key" -> element.placeholder = translation
   Service names, project names, and technical/scientific terms (All-on-X,
   DSD, Veneers, Zirconia, Smile Design, CAD/CAM, case-type names, model
   labels, etc.) are intentionally NOT included as translatable keys — they
   stay identical in both languages by simply never being tagged.
   Persists the chosen language in localStorage and swaps instantly with no
   page reload. Switching to Arabic also flips the document to dir="rtl" so
   the whole layout mirrors (nav, grids, flex rows); switching back to
   English restores dir="ltr". See the "RTL / Arabic Support" section in
   css/style.css for the handful of manual mirror rules the browser can't
   handle on its own (arrow icons, absolutely-positioned UI chrome).
   ========================================================================== */
(function(){
  "use strict";

  var STORAGE_KEY = "od-lang";

  var TRANSLATIONS = {
    en: {
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.projects": "Projects",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.uploadStl": "Upload STL",
      "brand.tagline": "Exactness, Earned",

      "common.scroll": "Scroll",
      "common.email": "Email",
      "common.basedIn": "Based In",
      "common.basedInValue": "Egypt · Est. 2025",
      "common.responseTime": "Response Time",
      "common.responseTimeValue": "Within one business day",
      "common.view": "View",
      "common.projects": "Projects",

      "home.hero.kicker": "Digital Dental CAD/CAM Design House",
      "home.hero.title": '<span class="line"><span>Precision, milled</span></span><span class="line"><span>into <em class="text-gold" style="font-style:normal;">every</em> margin.</span></span>',
      "home.hero.sub": 'OrlaDent is the design <em class="text-gold" style="font-style:normal;font-weight: bolder;font-size: x-large;">partner</em> that treats speed as a craft — flawless crown, bridge, implant and full-arch design delivered in hours, not days, through a direct relationship with the people doing the work.',
      "home.hero.viewWork": "View Our Work",
      "home.hero.stat1": "Express Single Crown",
      "home.hero.stat2": "Case Types Supported",
      "home.hero.stat3": "Quality Checked",
      "home.hero.stat4": "Cases Handled",

      "home.viewer.eyebrow": "Live From The Design Floor",
      "home.viewer.title": "A real case file, in your hands.",
      "home.viewer.lede": "This is an actual wax-up CAD scan, straight off our design floor — drag to rotate, scroll to zoom, and judge the precision yourself.",
      "home.viewer.badge": "Live Case File",
      "home.viewer.loading": "Loading case file…",
      "home.viewer.unavailable": "3D viewer unavailable",
      "home.viewer.loadError": "Couldn't load the case file",
      "home.viewer.autoRotate": "Auto-Rotate",
      "home.viewer.wireframe": "Wireframe",
      "home.viewer.reset": "Reset View",
      "home.viewer.dragHint": "Drag to Rotate",
      "home.viewer.scrollHint": "Scroll to Zoom",

      "home.intro.eyebrow": "Who We Are",
      "home.intro.title": "An outsourcing relationship that never feels outsourced.",
      "home.intro.lede": "Speed is never a discount signal — it's evidence of discipline. One design house. One named team. Every case, exact.",

      "home.laws.eyebrow": "The Three Laws",
      "home.laws.title": "The Golden Queen's Standard",
      "home.laws.lede": "Every touchpoint at OrlaDent is built on three verifiable proof points — not adjectives, but promises you can measure against real cases.",
      "home.laws.law1.tag": "The Law of Exactness",
      "home.laws.law1.title": "Precision Under Pressure",
      "home.laws.law1.body": "Flawless margin and occlusion accuracy on every case — proven through a Gold Standard portfolio of CAD mesh files paired against finished, milled crowns. Speed is never a gimmick; it's proof of discipline.",
      "home.laws.law2.tag": "The Law of the Royal Court",
      "home.laws.law2.title": "The Human Line",
      "home.laws.law2.body": "No faceless armies, no ticket queues, no rotating freelancers. A real, named designer and team relationship — a dependable extension of your own bench who picks up the phone.",
      "home.laws.law3.tag": "The Law of the Vault",
      "home.laws.law3.title": "Earned Gold",
      "home.laws.law3.body": "Premium is never simply claimed — it's demonstrated case by case, against published, case-type-specific SLAs. Our gold standard is earned every single time, not assumed once.",

      "home.servicesPreview.eyebrow": "Full-Scope Design",
      "home.servicesPreview.title": "One partner. Every case type.",
      "home.servicesPreview.allServices": "All Services",
      "home.servicesPreview.crown": "Anatomically precise single-unit crowns with flawless margins and natural occlusion, milled-ready on delivery.",
      "home.servicesPreview.bridge": "Multi-unit bridges engineered for load distribution, connector strength and seamless esthetic transitions.",
      "home.servicesPreview.implant": "Abutment and implant-supported restorations built to exact screw-channel and emergence-profile tolerances.",
      "home.servicesPreview.fullarch": "Hybrid and full-arch implant frameworks — All-on-4/6/X — coordinated across bite, esthetics and structure.",
      "home.servicesPreview.express": "Chairside-ready turnaround as fast as 30–45 minutes on a single crown — same discipline, compressed clock.",
      "home.servicesPreview.cadcam": "Crowns, bridges, implants, orthodontic and removable — one design house for a lab's entire case mix.",

      "home.process.eyebrow": "How It Works",
      "home.process.title": "From scan to milling-ready, on a clock you can trust.",
      "home.process.step1.title": "Submit Scan & Rx",
      "home.process.step1.body": "Send your intraoral scan or model file with case notes through your preferred workflow — no new software to learn.",
      "home.process.step2.title": "Named Designer Assigned",
      "home.process.step2.body": "Your case goes to a real designer who understands occlusion and esthetics — not a rotating queue.",
      "home.process.step3.title": "Design & Quality Check",
      "home.process.step3.body": "Margins, contacts and occlusion are verified against our Gold Standard before anything ships.",
      "home.process.step4.title": "Delivered Within SLA",
      "home.process.step4.body": "Milling-ready files land inside the published Express or Regular window for your exact case type.",

      "home.featured.eyebrow": "Selected Work",
      "home.featured.title": "Case files from the design floor.",
      "home.featured.fullPortfolio": "Full Portfolio",

      "home.why.eyebrow": "Why OrlaDent",
      "home.why.title": "Outsourcing that behaves like your own bench.",
      "home.why.lede": "Every reason to choose OrlaDent, verified on your first case — not promised for later.",
      "home.why.item1": "Judge the margins and turnaround yourself, on us.",
      "home.why.item2.title": "Case-Type SLAs, Published",
      "home.why.item2.body": "Turnaround scoped by complexity, never a vague promise.",
      "home.why.item3.title": "One Designer, Not a Ticket Number",
      "home.why.item3.body": "The same named designer, every case.",
      "home.why.item4.title": "Full-Scope Capability",
      "home.why.item4.body": "Crowns to full-arch — one partner, never split.",

      "home.journey.eyebrow": "Client Journey",
      "home.journey.title": "From first hello to active partner.",
      "home.journey.step1.title": "Inquire",
      "home.journey.step1.body": "A quick conversation about your case mix and volume.",
      "home.journey.step2.body": "We design one case, on us — no contract required.",
      "home.journey.step3.title": "You Evaluate",
      "home.journey.step3.body": "Judge margins, esthetics and turnaround against your own standard.",
      "home.journey.step4.title": "Volume Conversation",
      "home.journey.step4.body": "We scope a quote around your real monthly case flow.",
      "home.journey.step5.title": "Active Partnership",
      "home.journey.step5.body": "Recurring capacity, on call, without the overhead of hiring.",

      "home.cta.eyebrow": "Ready When You Are",
      "home.cta.title": "Send your first case. See exactness, earned.",
      "home.cta.lede": "No contract, no rate card, no risk — just the work, judged on its own merit.",
      "home.cta.exploreServices": "Explore Services",

      "about.hero.eyebrow": "Our Story",
      "about.hero.title": "Built on discipline, not on hustle.",
      "about.hero.lede": "OrlaDent exists because the industry kept asking labs and clinics to choose between speed and standards. We built a design house that refuses the trade.",
      "about.story.eyebrow": "Company Story",
      "about.story.title": 'The relentless search for "exact."',
      "about.story.p1": 'The CAD/CAM outsourcing market split into two broken extremes: ticket-queue platforms, and freelance marketplaces with no consistent quality. We built the opposite — a named designer, scoped turnaround, and "premium" proven on your case.',
      "about.story.p2": 'Our crest is a quiet nod to that standard: sovereignty earned through discipline, not declared by title. It\'s why our line is <em class="text-gold" style="font-style:normal;">Exactness, Earned</em>.',
      "about.philosophy.title": "Brand Philosophy",
      "about.philosophy.body": "Speed is evidence of mastery, not a discount signal — fast, precise and premium, together.",
      "about.mission.title": "Mission",
      "about.mission.body": "Overflow capacity, boutique margins, chairside speed — without gambling on quality.",
      "about.vision.title": "Vision",
      "about.vision.body": "The one design partner labs call before ever splitting a case again.",
      "about.values.eyebrow": "Core Values",
      "about.values.title": "Three Laws, one standard.",
      "about.values.lede": "Internally, we call these the Three Laws — the mythology behind the mark. Externally, they're just how every case is measured.",
      "about.values.law1.tag": "Law I · Exactness",
      "about.values.law1.title": "Precision Under Pressure",
      "about.values.law1.body": "Flawless margins and perfect occlusion on every design — the proof that makes our speed credible instead of suspicious.",
      "about.values.law2.tag": "Law II · The Royal Court",
      "about.values.law2.title": "The Human Line",
      "about.values.law2.body": "A direct, human relationship with every partner — never a faceless messenger, marketplace, or ticket queue.",
      "about.values.law3.tag": "Law III · The Vault",
      "about.values.law3.title": "Earned Gold",
      "about.values.law3.body": "Premium demonstrated case by case against real, published turnaround data — never a blanket promise.",
      "about.personality.eyebrow": "Brand Personality",
      "about.personality.title": "Confident. Precise. Low-hype.",
      "about.personality.lede": "No hustle language, no urgency theater. Speed is discipline, not a rush — gold used as an earned accent, never gaudy.",
      "about.automation.eyebrow": "Human Expertise vs. Automation",
      "about.automation.title": "A named designer, not a model.",
      "about.automation.lede": "Where platforms lead with algorithms, we lead with a person you can call. Automation supports the workflow — it never replaces the relationship.",
      "about.automation.cta": 'See How We Work <span class="btn-arrow">→</span>',
      "about.video.eyebrow": "Watch",
      "about.video.title": "Inside the standard.",
      "about.cta.eyebrow": "Join Us",
      "about.cta.title": "See the standard on your own case.",
      "about.cta.lede": "Upload STL. Everything after that is earned.",

      "services.hero.title": "Every case type. One accountable partner.",
      "services.hero.lede": "Turnaround is scoped by case complexity, not promised in a single flat number — so the speed claim stays defensible, case by case.",
      "services.book.title": "Turn the page on every case type.",
      "services.book.lede": "Six disciplines, one open book — flip through to see how each case is designed.",
      "services.book.coverTitle": "Our Services",
      "services.book.coverSub": "Six Disciplines. One Design House.",
      "services.book.cover": "Cover",

      "services.crown.body": "Single-unit anatomical crowns — including inlays, onlays and veneers — designed for flawless margins and natural occlusal contact from the first proposal.",
      "services.crown.b1": "Full-contour or minimal-prep design, your choice of material library",
      "services.crown.b2": "Occlusion and contact points verified against our Gold Standard",
      "services.crown.b3": "Milling-ready file formats for your in-house or partner mill",

      "services.bridge.body": "Multi-unit fixed bridges from 3-unit anterior spans to 4–6 unit posterior frameworks, engineered for load distribution and seamless pontic transitions.",
      "services.bridge.b1": "Connector strength calculated per span and material",
      "services.bridge.b2": "Non-rigid connector options for compromised abutments",
      "services.bridge.b3": "Esthetic gradation across pontics for a natural anterior line",

      "services.implant.body": "Implant-supported crowns and custom abutments built to exact screw-channel angulation and emergence-profile tolerances, case by case.",
      "services.implant.b1": "Screw-retained or cement-retained design, matched to your protocol",
      "services.implant.b2": "Abutment and crown coordinated as a single verified system",
      "services.implant.b3": "Compatible with major implant systems and scan-body libraries",

      "services.fullarch.body": "Hybrid and full-arch implant frameworks — All-on-4/6/X — plus complete and partial dentures, coordinated across bite, esthetics and structural support.",
      "services.fullarch.b1": "Fixed hybrid, removable or combination framework design",
      "services.fullarch.b2": "Full denture and partial framework design included",
      "services.fullarch.b3": "Bite and vertical dimension verified across the full arch",

      "services.esthetic.body": "Anterior cases where shade, translucency and natural light dynamics matter as much as fit — veneers, esthetic crowns and digital smile design mockups built to disappear into a natural smile.",
      "services.esthetic.b1": "Digital smile design (DSD) mockups for case approval before milling",
      "services.esthetic.b2": "Shade and translucency mapping matched to adjacent dentition",
      "services.esthetic.b3": "Incisal edge and contact design verified against the facial midline",

      "services.guides.body": "Implant surgical guides planned from CBCT and scan data, plus night guards, splints and orthodontic appliances — the protective and functional side of full-scope design.",
      "services.guides.b1": "Surgical guides with verified sleeve position and drill depth",
      "services.guides.b2": "Night guards, splints and retainers in hard, soft or dual-layer materials",
      "services.guides.b3": "Designed and QC'd by the same named team as every other case",

      "services.ibar.body": "A milled implant bar substructure connecting multiple fixtures into one rigid framework — the foundation for a bar-retained overdenture or fixed full-arch restoration, precision-fit to every screw channel.",
      "services.ibar.b1": "CAD-milled bar framework verified for passive fit across all implants",
      "services.ibar.b2": "Screw-access channels aligned to each fixture's exact angulation",
      "services.ibar.b3": "Built as the substructure for bar-retained overdentures or fixed prostheses",

      "services.wf.scanIntake": "Scan Intake",
      "services.wf.design": "Design",
      "services.wf.qcPass": "QC Pass",
      "services.wf.delivery": "Delivery",
      "services.wf.frameworkDesign": "Framework Design",
      "services.wf.scanImplantData": "Scan + Implant Data",
      "services.wf.abutmentDesign": "Abutment Design",
      "services.wf.recordsIntake": "Records Intake",
      "services.wf.waxupFramework": "Wax-Up / Framework",
      "services.wf.smileScan": "Smile Scan",
      "services.wf.shadeMatch": "Shade Match",
      "services.wf.guideDesign": "Guide Design",
      "services.wf.implantScanData": "Implant Scan Data",
      "services.wf.barDesign": "Bar Design",
      "services.wf.passiveFitQc": "Passive-Fit QC",

      "services.sla.eyebrow": "Published, Not Promised",
      "services.sla.title": "Turnaround, scoped by case type.",
      "services.sla.lede": "No blanket guarantee that breaks down under scrutiny — every case type has its own Express and Regular window.",
      "services.sla.caseType": "Case Type",

      "services.ctaFinal.eyebrow": "Try Before You Commit",
      "services.ctaFinal.title": "Send one real case. Judge it yourself.",
      "services.ctaFinal.lede": "No contract, no rate card — Upload STL.",
      "services.ctaFinal.seeWork": "See the Work",

      "projects.hero.eyebrow": "Case Portfolio",
      "projects.hero.title": "Real cases. Real files. Real precision.",
      "projects.hero.lede": '<span id="portfolio-count">49</span> design files from the OrlaDent floor — captured straight from the design software, unedited, organized by case type.',
      "projects.filter.all": "All Work",
      "projects.cta.eyebrow": "Like What You See?",
      "projects.cta.title": "Your case could be the next file in this gallery.",
      "projects.cta.lede": "Upload your STL file — no contract required.",

      "contact.hero.eyebrow": "Let's Talk",
      "contact.hero.title": "Send your first case. On us.",
      "contact.hero.lede": "No contract, no rate card, no risk. Tell us a little about your lab or clinic and we'll set up your case.",
      "contact.form.name": "Full Name",
      "contact.form.namePh": "Dr. Jane Carter",
      "contact.form.org": "Lab / Clinic Name",
      "contact.form.orgPh": "Carter Dental Lab",
      "contact.form.phone": "Phone",
      "contact.form.segment": "I am a...",
      "contact.form.seg1": "High-Volume Production Lab",
      "contact.form.seg2": "Elite Independent Technician",
      "contact.form.seg3": "Digital Dental Clinic",
      "contact.form.seg4": "Other",
      "contact.form.message": "Tell us about your case mix",
      "contact.form.messagePh": "Case types, monthly volume, and what you'd like your STL to be...",
      "contact.form.submit": "Request My Case",
      "contact.form.sendingBtn": "Sending…",
      "contact.form.sending": "Sending your message…",
      "contact.form.successBtn": "Message Received",
      "contact.form.success": "Thanks — your message was sent. We'll reply within one business day.",
      "contact.form.errorBtn": "Try Again",
      "contact.form.error": "Something went wrong sending that — please email hello@orladent.com directly, or try again.",
      "contact.followUs": "Follow OrlaDent",
      "contact.cta.eyebrow": "Still Deciding?",
      "contact.cta.title": "Browse the case portfolio first.",
      "contact.cta.lede": "See the exact standard your first case will be measured against.",
      "contact.cta.viewPortfolio": "View Case Portfolio",

      "footer.tagline": "A digital dental CAD/CAM design house delivering precision crown, bridge, implant and full-arch design — fast, without ever trading away quality.",
      "footer.sitemap": "Sitemap",
      "footer.aboutUs": "About Us",
      "footer.getInTouch": "Get in Touch",
      "footer.rights": "All rights reserved."
    },

    ar: {
      "nav.home": "الرئيسية",
      "nav.services": "الخدمات",
      "nav.projects": "المشاريع",
      "nav.about": "من نحن",
      "nav.contact": "تواصل معنا",
      "nav.uploadStl": "ارفع ملف STL",
      "brand.tagline": "دقة، مُستحقّة",

      "common.scroll": "مرر للأسفل",
      "common.email": "البريد الإلكتروني",
      "common.basedIn": "مقرنا في",
      "common.basedInValue": "مصر · تأسست 2025",
      "common.responseTime": "وقت الرد",
      "common.responseTimeValue": "خلال يوم عمل واحد",
      "common.view": "عرض",
      "common.projects": "مشاريع",

      "home.hero.kicker": "بيت تصميم رقمي متخصص في CAD/CAM لطب الأسنان",
      "home.hero.title": '<span class="line"><span>دقة، مصقولة</span></span><span class="line"><span>في <em class="text-gold" style="font-style:normal;">كل</em> تفصيلة.</span></span>',
      "home.hero.sub": 'OrlaDent هو <em class="text-gold" style="font-style:normal;font-weight: bolder;font-size: x-large;">الشريك</em> التصميمي الذي يتعامل مع السرعة كحرفة — تصميم تاج وجسر وزراعة وقوس كامل بلا أي عيوب، يُسلَّم خلال ساعات لا أيام، من خلال علاقة مباشرة مع فريق العمل نفسه.',
      "home.hero.viewWork": "شاهد أعمالنا",
      "home.hero.stat1": "تاج فردي سريع",
      "home.hero.stat2": "نوع حالة مدعوم",
      "home.hero.stat3": "خاضع لفحص الجودة",
      "home.hero.stat4": "حالة تم تنفيذها",

      "home.viewer.eyebrow": "مباشرةً من صالة التصميم",
      "home.viewer.title": "ملف حالة حقيقي، بين يديك.",
      "home.viewer.lede": "هذا مسح CAD حقيقي لنموذج شمعي، مأخوذ مباشرة من صالة التصميم لدينا — اسحب للتدوير، مرر للتكبير، واحكم على الدقة بنفسك.",
      "home.viewer.badge": "ملف حالة مباشر",
      "home.viewer.loading": "جارٍ تحميل ملف الحالة…",
      "home.viewer.unavailable": "عارض الثري دي غير متاح حاليًا",
      "home.viewer.loadError": "تعذّر تحميل ملف الحالة",
      "home.viewer.autoRotate": "تدوير تلقائي",
      "home.viewer.wireframe": "عرض شبكي",
      "home.viewer.reset": "إعادة ضبط العرض",
      "home.viewer.dragHint": "اسحب للتدوير",
      "home.viewer.scrollHint": "مرر للتكبير",

      "home.intro.eyebrow": "من نحن",
      "home.intro.title": "علاقة استعانة بمصادر خارجية لا تبدو خارجية أبدًا.",
      "home.intro.lede": "السرعة لم تكن يومًا إشارة تنازل عن الجودة — بل دليل على الانضباط. بيت تصميم واحد. فريق واحد معروف بالاسم. كل حالة، بدقة كاملة.",

      "home.laws.eyebrow": "القوانين الثلاثة",
      "home.laws.title": "معيار الملكة الذهبية",
      "home.laws.lede": "كل تفصيلة في OrlaDent مبنية على ثلاث ركائز يمكن التحقق منها — ليست مجرد صفات، بل وعود يمكن قياسها على حالات حقيقية.",
      "home.laws.law1.tag": "قانون الدقة",
      "home.laws.law1.title": "دقة تحت الضغط",
      "home.laws.law1.body": "دقة لا تشوبها شائبة في الحواف والإطباق في كل حالة — مثبتة عبر معيار ذهبي يقارن ملفات CAD الشبكية بالتيجان المصقولة النهائية. السرعة هنا ليست خدعة، بل دليل انضباط.",
      "home.laws.law2.tag": "قانون البلاط الملكي",
      "home.laws.law2.title": "الخط الإنساني",
      "home.laws.law2.body": "لا جيوش بلا وجوه، ولا طوابير تذاكر، ولا مستقلّين متغيّرين باستمرار. علاقة حقيقية مع مصمم وفريق معروفَين بالاسم — امتداد يمكن الاعتماد عليه لفريقك يرد على الهاتف.",
      "home.laws.law3.tag": "قانون الخزنة",
      "home.laws.law3.title": "ذهب مُستحَق",
      "home.laws.law3.body": "الفخامة لا تُدَّعى فقط — بل تُثبَت حالة بحالة، مقابل اتفاقيات مستوى خدمة منشورة وخاصة بكل نوع حالة. معيارنا الذهبي يُكتسَب في كل مرة، لا يُفترَض مرة واحدة.",

      "home.servicesPreview.eyebrow": "تصميم شامل",
      "home.servicesPreview.title": "شريك واحد. كل نوع حالة.",
      "home.servicesPreview.allServices": "كل الخدمات",
      "home.servicesPreview.crown": "تيجان أحادية الوحدة بدقة تشريحية، بحواف لا تشوبها شائبة وإطباق طبيعي، جاهزة للتصنيع عند التسليم.",
      "home.servicesPreview.bridge": "جسور متعددة الوحدات مصممة لتوزيع الحمل وقوة الموصلات وانتقالات جمالية سلسة.",
      "home.servicesPreview.implant": "ترميمات مدعومة بالزراعة ودعامات مخصصة، مصممة بدقة صارمة لقناة البرغي وملامح الظهور.",
      "home.servicesPreview.fullarch": "أطر زراعة كاملة أو هجينة — All-on-4/6/X — منسقة عبر الإطباق والجماليات والبنية.",
      "home.servicesPreview.express": "تسليم جاهز للكرسي في وقت قياسي يصل إلى 30–45 دقيقة لتاج واحد — نفس الانضباط، بوقت مضغوط.",
      "home.servicesPreview.cadcam": "تيجان وجسور وزراعات وتقويم وأطقم متحركة — بيت تصميم واحد لكل مزيج حالات المعمل.",

      "home.process.eyebrow": "كيف نعمل",
      "home.process.title": "من المسح إلى الجاهزية للتصنيع، في وقت يمكنك الوثوق به.",
      "home.process.step1.title": "أرسل المسح والوصفة",
      "home.process.step1.body": "أرسل مسحك داخل الفم أو ملف النموذج مع ملاحظات الحالة عبر سير العمل المفضل لديك — بلا برامج جديدة لتعلّمها.",
      "home.process.step2.title": "تعيين مصمم مسؤول",
      "home.process.step2.body": "تذهب حالتك إلى مصمم حقيقي يفهم الإطباق والجماليات — لا طابور دوّار.",
      "home.process.step3.title": "التصميم وفحص الجودة",
      "home.process.step3.body": "يتم التحقق من الحواف ونقاط التماس والإطباق مقابل معيارنا الذهبي قبل أي تسليم.",
      "home.process.step4.title": "التسليم ضمن الاتفاقية الزمنية",
      "home.process.step4.body": "تصل الملفات الجاهزة للتصنيع ضمن النافذة الزمنية المعلنة، السريعة أو العادية، حسب نوع حالتك بالضبط.",

      "home.featured.eyebrow": "أعمال مختارة",
      "home.featured.title": "ملفات حالات من صالة التصميم.",
      "home.featured.fullPortfolio": "كل الأعمال",

      "home.why.eyebrow": "لماذا OrlaDent",
      "home.why.title": "استعانة بمصادر خارجية تتصرف وكأنها فريقك الخاص.",
      "home.why.lede": "كل سبب لاختيار OrlaDent، مُثبَت في أول حالة لك — لا موعود به لاحقًا.",
      "home.why.item1": "احكم بنفسك على الدقة والسرعة، على حسابنا.",
      "home.why.item2.title": "اتفاقيات مستوى خدمة معلنة لكل نوع حالة",
      "home.why.item2.body": "سرعة التسليم محسوبة حسب التعقيد، لا وعدًا غامضًا.",
      "home.why.item3.title": "مصمم واحد، لا رقم تذكرة",
      "home.why.item3.body": "نفس المصمم المعروف بالاسم، في كل حالة.",
      "home.why.item4.title": "قدرة شاملة على كل نوع حالة",
      "home.why.item4.body": "من التيجان إلى القوس الكامل — شريك واحد، لا يتجزأ أبدًا.",

      "home.journey.eyebrow": "رحلة العميل",
      "home.journey.title": "من أول تواصل إلى شراكة فعّالة.",
      "home.journey.step1.title": "التواصل الأول",
      "home.journey.step1.body": "محادثة سريعة عن مزيج حالاتك وحجمها.",
      "home.journey.step2.body": "نصمم حالة واحدة، على حسابنا — بلا أي عقد مطلوب.",
      "home.journey.step3.title": "التقييم من جانبك",
      "home.journey.step3.body": "احكم على الحواف والجماليات وسرعة التسليم وفقًا لمعيارك الخاص.",
      "home.journey.step4.title": "نقاش حجم العمل",
      "home.journey.step4.body": "نحدد عرض سعر يتناسب مع تدفق حالاتك الشهري الفعلي.",
      "home.journey.step5.title": "شراكة فعّالة",
      "home.journey.step5.body": "طاقة استيعابية متكررة وجاهزة عند الطلب، دون أعباء التوظيف.",

      "home.cta.eyebrow": "جاهزون متى كنت مستعدًا",
      "home.cta.title": "أرسل حالتك الأولى. شاهد الدقة المُستحقّة.",
      "home.cta.lede": "بلا عقد، بلا بطاقة أسعار، بلا مخاطرة — فقط العمل نفسه، يُحكَم عليه بجدارته.",
      "home.cta.exploreServices": "استكشف الخدمات",

      "about.hero.eyebrow": "قصتنا",
      "about.hero.title": "مبني على الانضباط، لا على الاستعجال.",
      "about.hero.lede": "OrlaDent موجودة لأن الصناعة ظلت تطلب من المعامل والعيادات الاختيار بين السرعة والمعايير. نحن بنينا بيت تصميم يرفض هذه المفاضلة.",
      "about.story.eyebrow": "قصة الشركة",
      "about.story.title": 'البحث الدؤوب عن "الدقة."',
      "about.story.p1": 'انقسمت سوق الاستعانة بمصادر خارجية في CAD/CAM إلى نقيضين مكسورين: منصات طوابير التذاكر، وأسواق العمل الحر بلا جودة ثابتة. نحن بنينا النقيض: مصمم معروف بالاسم، وسرعة تسليم محددة، و"الفخامة" مُثبَتة على حالتك.',
      "about.story.p2": 'شعارنا إشارة هادئة لهذا المعيار: سيادة مُكتسَبة بالانضباط، لا مُعلَنة باللقب. لهذا شعارنا هو <em class="text-gold" style="font-style:normal;">دقة، مُستحقّة</em>.',
      "about.philosophy.title": "فلسفة العلامة",
      "about.philosophy.body": "السرعة دليل على الإتقان، لا إشارة تنازل — سريعة ودقيقة وفاخرة، معًا.",
      "about.mission.title": "المهمة",
      "about.mission.body": "طاقة استيعابية إضافية، هوامش بوتيكية، وسرعة كرسي — دون المقامرة بالجودة.",
      "about.vision.title": "الرؤية",
      "about.vision.body": "شريك التصميم الأول الذي تتصل به المعامل قبل أن تفكر في تقسيم حالتها مرة أخرى.",
      "about.values.eyebrow": "قيمنا الأساسية",
      "about.values.title": "قوانين ثلاثة، معيار واحد.",
      "about.values.lede": "داخليًا، نسمّيها القوانين الثلاثة — الأسطورة خلف الشعار. خارجيًا، هي ببساطة كيف تُقاس كل حالة.",
      "about.values.law1.tag": "القانون الأول · الدقة",
      "about.values.law1.title": "دقة تحت الضغط",
      "about.values.law1.body": "حواف لا تشوبها شائبة وإطباق مثالي في كل تصميم — الدليل الذي يجعل سرعتنا موثوقة لا مثيرة للريبة.",
      "about.values.law2.tag": "القانون الثاني · البلاط الملكي",
      "about.values.law2.title": "الخط الإنساني",
      "about.values.law2.body": "علاقة إنسانية مباشرة مع كل شريك — أبدًا لا رسول بلا وجه، ولا سوق مفتوح، ولا طابور تذاكر.",
      "about.values.law3.tag": "القانون الثالث · الخزنة",
      "about.values.law3.title": "ذهب مُستحَق",
      "about.values.law3.body": "الفخامة مُثبَتة حالة بحالة مقابل بيانات تسليم حقيقية ومنشورة — أبدًا لا وعد عام شامل.",
      "about.personality.eyebrow": "شخصية العلامة",
      "about.personality.title": "واثقة. دقيقة. بلا مبالغة.",
      "about.personality.lede": "بلا لغة استعجال، بلا مسرحية إلحاح. السرعة انضباط، لا تسرّع — والذهب يُستخدم كلمسة مُستحقة، لا مبالغًا فيها أبدًا.",
      "about.automation.eyebrow": "الخبرة الإنسانية مقابل الأتمتة",
      "about.automation.title": "مصمم معروف بالاسم، لا نموذجًا آليًا.",
      "about.automation.lede": "بينما تعتمد المنصات على الخوارزميات، نحن نعتمد على شخص يمكنك الاتصال به. الأتمتة تدعم سير العمل — ولا تحل محل العلاقة أبدًا.",
      "about.automation.cta": 'شاهد كيف نعمل <span class="btn-arrow">→</span>',
      "about.video.eyebrow": "شاهد",
      "about.video.title": "داخل المعيار.",
      "about.cta.eyebrow": "انضم إلينا",
      "about.cta.title": "شاهد المعيار على حالتك الخاصة.",
      "about.cta.lede": "ارفع ملف STL. كل ما بعد ذلك مُستحَق.",

      "services.hero.title": "كل نوع حالة. شريك واحد مسؤول.",
      "services.hero.lede": "سرعة التسليم محددة حسب تعقيد الحالة، لا موعودة برقم ثابت واحد — حتى يبقى ادعاء السرعة قابلًا للدفاع عنه، حالة بحالة.",
      "services.book.title": "اقلب الصفحة على كل نوع حالة.",
      "services.book.lede": "ست تخصصات، في كتاب واحد مفتوح — اقلب الصفحات لترى كيف تُصمَّم كل حالة.",
      "services.book.coverTitle": "خدماتنا",
      "services.book.coverSub": "ست تخصصات. بيت تصميم واحد.",
      "services.book.cover": "الغلاف",

      "services.crown.body": "تيجان تشريحية أحادية الوحدة — بما فيها الإنليه والأونليه والفينير — مصممة لحواف لا تشوبها شائبة وتماس إطباقي طبيعي من أول مقترح.",
      "services.crown.b1": "تصميم بحجم كامل أو تحضير أدنى، باختيارك من مكتبة الخامات",
      "services.crown.b2": "التحقق من الإطباق ونقاط التماس مقابل معيارنا الذهبي",
      "services.crown.b3": "صيغ ملفات جاهزة للتصنيع في مطحنتك الداخلية أو الشريكة",

      "services.bridge.body": "جسور ثابتة متعددة الوحدات من امتدادات أمامية ثلاثية إلى أطر خلفية من 4 إلى 6 وحدات، مصممة لتوزيع الحمل وانتقالات جسرية سلسة.",
      "services.bridge.b1": "قوة الموصل محسوبة حسب الامتداد والخامة",
      "services.bridge.b2": "خيارات موصلات غير صلبة للدعامات الضعيفة",
      "services.bridge.b3": "تدرج جمالي عبر الجسور لخط أمامي طبيعي",

      "services.implant.body": "تيجان مدعومة بالزراعة ودعامات مخصصة، مصممة بدقة صارمة لزاوية قناة البرغي وملامح الظهور، حالة بحالة.",
      "services.implant.b1": "تصميم مثبت بالبرغي أو باللاصق، متوافق مع بروتوكولك",
      "services.implant.b2": "الدعامة والتاج منسقان كنظام واحد موثّق",
      "services.implant.b3": "متوافق مع أنظمة الزراعة الرئيسية ومكتبات أجسام المسح",

      "services.fullarch.body": "أطر زراعة كاملة أو هجينة — All-on-4/6/X — بالإضافة إلى أطقم أسنان كاملة وجزئية، منسقة عبر الإطباق والجماليات والدعم البنيوي.",
      "services.fullarch.b1": "تصميم إطار هجين ثابت أو متحرك أو مركّب",
      "services.fullarch.b2": "تصميم طقم كامل وإطار جزئي متضمَّن",
      "services.fullarch.b3": "التحقق من الإطباق والبعد الرأسي عبر القوس الكامل",

      "services.esthetic.body": "حالات أمامية حيث تكون درجة اللون والشفافية وديناميكيات الضوء الطبيعي بنفس أهمية الملاءمة — فينير وتيجان جمالية ونماذج تصميم ابتسامة رقمية مصممة للاندماج في ابتسامة طبيعية.",
      "services.esthetic.b1": "نماذج تصميم ابتسامة رقمي (DSD) لاعتماد الحالة قبل التصنيع",
      "services.esthetic.b2": "مطابقة درجة اللون والشفافية مع الأسنان المجاورة",
      "services.esthetic.b3": "التحقق من الحافة القاطعة ونقاط التماس مقابل خط الوجه الأوسط",

      "services.guides.body": "أدلة جراحية للزراعة مخططة من بيانات CBCT والمسح، بالإضافة إلى واقيات الليل والجبائر وأجهزة التقويم — الجانب الوقائي والوظيفي من التصميم الشامل.",
      "services.guides.b1": "أدلة جراحية بموضع كُمّ وعمق حفر موثّقَين",
      "services.guides.b2": "واقيات ليل وجبائر وحافظات بخامات صلبة أو ناعمة أو ثنائية الطبقة",
      "services.guides.b3": "مصممة ومُفحوصة الجودة من نفس الفريق المعروف بالاسم كأي حالة أخرى",

      "services.ibar.body": "بنية تحتية لقضيب زراعة مُصنَّع بدقة يربط عدة ثوابت في إطار واحد صلب — الأساس لطقم متحرك مثبَّت على قضيب أو ترميم قوس كامل ثابت، بملاءمة دقيقة لكل قناة برغي.",
      "services.ibar.b1": "إطار قضيب مُصنَّع بـCAD موثّق لملاءمة سلبية عبر كل الزراعات",
      "services.ibar.b2": "قنوات وصول البرغي محاذاة بدقة لزاوية كل ثابت",
      "services.ibar.b3": "مُصمَّم كبنية تحتية لأطقم متحركة مثبَّتة على قضيب أو ترميمات ثابتة",

      "services.wf.scanIntake": "استلام المسح",
      "services.wf.design": "التصميم",
      "services.wf.qcPass": "فحص الجودة",
      "services.wf.delivery": "التسليم",
      "services.wf.frameworkDesign": "تصميم الإطار",
      "services.wf.scanImplantData": "المسح + بيانات الزراعة",
      "services.wf.abutmentDesign": "تصميم الدعامة",
      "services.wf.recordsIntake": "استلام السجلات",
      "services.wf.waxupFramework": "النموذج الشمعي / الإطار",
      "services.wf.smileScan": "مسح الابتسامة",
      "services.wf.shadeMatch": "مطابقة اللون",
      "services.wf.guideDesign": "تصميم الدليل",
      "services.wf.implantScanData": "بيانات مسح الزراعة",
      "services.wf.barDesign": "تصميم القضيب",
      "services.wf.passiveFitQc": "فحص جودة الملاءمة السلبية",

      "services.sla.eyebrow": "معلَن، لا موعود",
      "services.sla.title": "سرعة التسليم، محددة حسب نوع الحالة.",
      "services.sla.lede": "لا ضمان عام ينهار تحت التدقيق — لكل نوع حالة نافذته الزمنية الخاصة، السريعة والعادية.",
      "services.sla.caseType": "نوع الحالة",

      "services.ctaFinal.eyebrow": "جرّب قبل الالتزام",
      "services.ctaFinal.title": "أرسل حالة حقيقية واحدة. احكم بنفسك.",
      "services.ctaFinal.lede": "بلا عقد، بلا بطاقة أسعار — فقط ارفع ملف STL.",
      "services.ctaFinal.seeWork": "شاهد الأعمال",

      "projects.hero.eyebrow": "معرض الأعمال",
      "projects.hero.title": "حالات حقيقية. ملفات حقيقية. دقة حقيقية.",
      "projects.hero.lede": '<span id="portfolio-count">49</span> ملف تصميم من صالة OrlaDent — مأخوذة مباشرة من برنامج التصميم، دون تعديل، منظمة حسب نوع الحالة.',
      "projects.filter.all": "كل الأعمال",
      "projects.cta.eyebrow": "أعجبك ما رأيت؟",
      "projects.cta.title": "قد تكون حالتك الملف التالي في هذا المعرض.",
      "projects.cta.lede": "ارفع ملف STL الخاص بك — بلا أي عقد مطلوب.",

      "contact.hero.eyebrow": "لنتحدث",
      "contact.hero.title": "أرسل حالتك الأولى. على حسابنا.",
      "contact.hero.lede": "بلا عقد، بلا بطاقة أسعار، بلا مخاطرة. أخبرنا قليلًا عن معملك أو عيادتك وسنجهّز حالتك.",
      "contact.form.name": "الاسم الكامل",
      "contact.form.namePh": "د. جين كارتر",
      "contact.form.org": "اسم المعمل / العيادة",
      "contact.form.orgPh": "معمل كارتر لطب الأسنان",
      "contact.form.phone": "رقم الهاتف",
      "contact.form.segment": "أنا...",
      "contact.form.seg1": "معمل إنتاج عالي الحجم",
      "contact.form.seg2": "فني مستقل متميز",
      "contact.form.seg3": "عيادة أسنان رقمية",
      "contact.form.seg4": "أخرى",
      "contact.form.message": "أخبرنا عن مزيج حالاتك",
      "contact.form.messagePh": "أنواع الحالات، الحجم الشهري، وما تريده من ملف STL الخاص بك...",
      "contact.form.submit": "اطلب حالتي",
      "contact.form.sendingBtn": "جارٍ الإرسال…",
      "contact.form.sending": "جارٍ إرسال رسالتك…",
      "contact.form.successBtn": "تم استلام الرسالة",
      "contact.form.success": "شكرًا — تم إرسال رسالتك. سنرد خلال يوم عمل واحد.",
      "contact.form.errorBtn": "حاول مرة أخرى",
      "contact.form.error": "حدث خطأ أثناء الإرسال — يرجى مراسلتنا مباشرة على hello@orladent.com أو المحاولة مرة أخرى.",
      "contact.followUs": "تابع OrlaDent",
      "contact.cta.eyebrow": "لا تزال تفكر؟",
      "contact.cta.title": "تصفح معرض الأعمال أولًا.",
      "contact.cta.lede": "شاهد المعيار الدقيق الذي ستُقاس عليه حالتك الأولى.",
      "contact.cta.viewPortfolio": "شاهد معرض الأعمال",

      "footer.tagline": "بيت تصميم رقمي متخصص في CAD/CAM لطب الأسنان، يقدم تصميم تاج وجسر وزراعة وقوس كامل بدقة عالية — بسرعة، دون التنازل عن الجودة أبدًا.",
      "footer.sitemap": "خريطة الموقع",
      "footer.aboutUs": "من نحن",
      "footer.getInTouch": "تواصل معنا",
      "footer.rights": "جميع الحقوق محفوظة."
    }
  };

  function getLang(){
    try{ return localStorage.getItem(STORAGE_KEY) || "en"; }catch(e){ return "en"; }
  }

  function setLang(lang){
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch(e){}
  }

  function t(key){
    var lang = getLang();
    var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if(dict[key] !== undefined) return dict[key];
    if(TRANSLATIONS.en[key] !== undefined) return TRANSLATIONS.en[key];
    return key;
  }

  function applyLang(lang){
    if(!TRANSLATIONS[lang]) lang = "en";
    setLang(lang);

    var dict = TRANSLATIONS[lang];

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if(dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function(el){
      var key = el.getAttribute("data-i18n-html");
      if(dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el){
      var key = el.getAttribute("data-i18n-placeholder");
      if(dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll(".lang-toggle .lang-opt").forEach(function(opt){
      opt.classList.toggle("is-active", opt.getAttribute("data-lang") === lang);
    });

    document.documentElement.setAttribute("lang", lang);
    /* Arabic reads right-to-left: flip the document direction so the whole
       layout (nav order, grids, flex rows, absolute-positioned UI chrome)
       mirrors automatically. Matching [dir="rtl"] overrides in style.css
       handle the handful of things the browser can't mirror on its own
       (arrow icons, absolutely-positioned corner elements, the SLA table). */
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: lang } }));
  }

  function init(){
    applyLang(getLang());
    document.querySelectorAll(".lang-toggle").forEach(function(btn){
      btn.addEventListener("click", function(){
        var next = getLang() === "en" ? "ar" : "en";
        applyLang(next);
      });
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.OD_I18N = { t: t, applyLang: applyLang, getLang: getLang };
})();
