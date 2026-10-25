# -*- coding: utf-8 -*-
# Arovia RCM - SEO step 3. Run from the inner project folder:  python apply_seo3.py
import glob, json, os, re, sys, datetime

if not os.path.exists(os.path.join("public", "index.html")):
    sys.exit("Wrong folder. Open the inner arovia-rcm-website folder (it contains main.py) and run again.")

SITE = "https://www.aroviarcm.com"
DATA = json.loads(r'''{"CARDS": {"ar-follow-up-services.html": ["AR follow-up services", "We call payers and check portals on every unpaid claim until it is paid or properly appealed."], "denial-management-services.html": ["Denial management and appeals", "Find why claims are denied, correct them, appeal on time and stop the same denial coming back."], "unpaid-claims-recovery.html": ["Unpaid claims and old AR recovery", "A second look at old balances, rejected claims and short payments."], "medical-billing-services-for-small-practices.html": ["Medical billing for small practices", "Eligibility to patient statements, with one team and one weekly report."], "credentialing-and-enrollment-services.html": ["Provider credentialing and enrollment", "Payer enrollment, Medicare and Medicaid applications and CAQH upkeep."], "prior-authorization-and-eligibility-verification.html": ["Prior authorization and eligibility checks", "Check coverage before the visit and get approvals before costly procedures."], "revenue-cycle-management-services.html": ["Revenue cycle management services", "What RCM covers, which numbers to watch and how outsourcing works."], "primary-care-billing-and-ar-follow-up.html": ["Primary care and family medicine", "High-volume visits, E/M levels and small balances that add up."], "dermatology-billing-and-ar-follow-up.html": ["Dermatology", "Procedures on the same day as a visit, medical versus cosmetic and biologics approvals."], "cardiology-billing-and-ar-follow-up.html": ["Cardiology", "Diagnostic tests, technical and professional components and imaging approvals."], "orthopedic-billing-and-ar-follow-up.html": ["Orthopedics", "Global surgical periods, surgery approvals, bracing and injury cases."], "physical-therapy-billing-and-ar-follow-up.html": ["Physical therapy", "Timed codes, visit limits and plan-of-care paperwork."], "behavioral-health-billing-and-ar-follow-up.html": ["Behavioral health", "Time-based therapy codes, telehealth rules and provider enrollment."], "why-medical-claims-get-denied.html": ["Why medical claims get denied", "Eight common reasons and the fix for each."], "ar-follow-up-checklist-for-small-practices.html": ["AR follow-up checklist", "A daily, weekly and monthly routine for small practices."], "how-to-read-an-ar-aging-report.html": ["How to read an AR aging report", "Age buckets, the numbers that matter and what to do first."], "outsourcing-medical-billing-costs-and-red-flags.html": ["Outsourcing medical billing", "How companies charge, what to ask and the red flags."]}, "SPEC": ["primary-care-billing-and-ar-follow-up.html", "dermatology-billing-and-ar-follow-up.html", "cardiology-billing-and-ar-follow-up.html", "orthopedic-billing-and-ar-follow-up.html", "physical-therapy-billing-and-ar-follow-up.html", "behavioral-health-billing-and-ar-follow-up.html"], "ART": ["why-medical-claims-get-denied.html", "ar-follow-up-checklist-for-small-practices.html", "how-to-read-an-ar-aging-report.html", "outsourcing-medical-billing-costs-and-red-flags.html"], "PAGES": ["revenue-cycle-management-services.html", "primary-care-billing-and-ar-follow-up.html", "dermatology-billing-and-ar-follow-up.html", "cardiology-billing-and-ar-follow-up.html", "orthopedic-billing-and-ar-follow-up.html", "physical-therapy-billing-and-ar-follow-up.html", "behavioral-health-billing-and-ar-follow-up.html", "why-medical-claims-get-denied.html", "ar-follow-up-checklist-for-small-practices.html", "how-to-read-an-ar-aging-report.html", "outsourcing-medical-billing-costs-and-red-flags.html", "blog.html"], "DATE": "2026-10-25"}''')
CARDS, SPEC, ART, NEW_PAGES, DATE = DATA["CARDS"], DATA["SPEC"], DATA["ART"], DATA["PAGES"], DATA["DATE"]

for s in NEW_PAGES:
    if not os.path.exists(os.path.join("public", s)):
        sys.exit("Missing public/" + s + ". Copy the files from the zip into your public folder first.")

def read(p):
    with open(p, encoding="utf-8") as f: return f.read()
def write(p, t):
    with open(p, "w", encoding="utf-8", newline="") as f: f.write(t)

def cards(slugs):
    return "".join(f'<a href="{s}"><b>{CARDS[s][0]}</b><span>{CARDS[s][1]}</span><em>Learn more &rarr;</em></a>' for s in slugs)

SPEC_HTML = f'''<!-- SEO3:spec-start -->
<section class="section pat" id="specialties">
  <div class="wrap">
    <div class="sec-h">
      <span class="eyebrow">Specialties</span>
      <h2>Billing and AR follow-up that understands your specialty.</h2>
      <p>Each specialty has its own denial patterns and paperwork. Pick yours to see where claims commonly go wrong and how we help. Not listed? <a href="index.html#contact">Tell us your specialty</a>.</p>
    </div>
    <div class="rel">{cards(SPEC)}</div>
  </div>
</section>
<!-- SEO3:spec-end -->
'''
GUIDE_HTML = f'''<!-- SEO3:guides-start -->
<section class="section" id="guides">
  <div class="wrap">
    <div class="sec-h">
      <span class="eyebrow">Guides</span>
      <h2>Plain-language help on getting paid.</h2>
      <p>Short guides on denials, AR follow-up, aging reports and choosing a billing partner. <a href="blog.html">See all guides</a>, or read <a href="revenue-cycle-management-services.html">what revenue cycle management covers</a>.</p>
    </div>
    <div class="rel">{cards(ART)}</div>
  </div>
</section>
<!-- SEO3:guides-end -->
'''

def strip(t, n):
    return re.sub(r"<!-- SEO3:%s-start -->.*?<!-- SEO3:%s-end -->\n?" % (n, n), "", t, flags=re.S)

# ---- home page: add Specialties and Guides sections before the FAQ ----
p = os.path.join("public", "index.html")
t = read(p)
for n in ("spec", "guides"): t = strip(t, n)
anchor = "<!-- SEO2:faq-start -->"
if anchor not in t: sys.exit("index.html does not have the FAQ marker. Run apply_seo2.py first.")
t = t.replace(anchor, SPEC_HTML + GUIDE_HTML + anchor, 1)
write(p, t)
print("patched index.html")

# ---- footer links on every page ----
extra = '<a href="revenue-cycle-management-services.html">RCM services</a><a href="blog.html">Guides</a>'
count = 0
for f in sorted(glob.glob(os.path.join("public", "*.html"))):
    name = os.path.basename(f)
    if name.startswith("google"): continue
    t = read(f)
    if ">Guides</a>" in t or 'class="f-links"' not in t: continue
    if "Prior auth and eligibility</a>" in t:
        t = t.replace("Prior auth and eligibility</a>", "Prior auth and eligibility</a>" + extra, 1)
        write(f, t); count += 1
print("footer links added on", count, "pages")

# ---- css ----
css = os.path.join("public", "css", "style.css")
c = read(css)
if "/* seo3 */" not in c:
    c += "\n/* seo3 */\n.legal .meta{color:var(--muted);font-size:.92rem;margin:0 0 18px}\n.legal h2:first-child{margin-top:0}\n"
    write(css, c)
    print("patched css")

# ---- sitemap built from the files that exist ----
def prio(n):
    if n == "index.html": return "1.0"
    if n in ("how-we-work.html", "revenue-cycle-management-services.html", "blog.html"): return "0.8"
    if n in ("privacy.html", "terms.html"): return "0.3"
    return "0.7" if n in ART else "0.9"
files = sorted(os.path.basename(f) for f in glob.glob(os.path.join("public", "*.html")) if not os.path.basename(f).startswith("google"))
rows = []
for n in files:
    loc = SITE + "/" + ("" if n == "index.html" else n)
    d = datetime.date.fromtimestamp(os.path.getmtime(os.path.join("public", n))).isoformat()
    rows.append(f"  <url><loc>{loc}</loc><lastmod>{d}</lastmod><priority>{prio(n)}</priority></url>\n")
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(rows) + "</urlset>\n"
write(os.path.join("public", "sitemap.xml"), sm)
print("wrote sitemap.xml with", len(files), "pages")
print("DONE")
