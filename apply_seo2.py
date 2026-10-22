# -*- coding: utf-8 -*-
# Arovia RCM - SEO step 2. Run from the inner project folder:  python apply_seo2.py
import html, json, os, re, sys

if not os.path.exists(os.path.join("public", "index.html")):
    sys.exit("Wrong folder. Open the inner arovia-rcm-website folder (it contains main.py) and run again.")

SITE = "https://www.aroviarcm.com"
TODAY = "2026-10-22"
DATA = json.loads(r'''{"LINKS": [["ar-follow-up-services.html", "AR follow-up", "AR follow-up services", "We call payers and check portals on every unpaid claim until it is paid or properly appealed."], ["denial-management-services.html", "Denial management", "Denial management and appeals", "Find why claims are denied, correct them, appeal on time and stop the same denial coming back."], ["unpaid-claims-recovery.html", "Claims recovery", "Unpaid claims and old AR recovery", "A second look at old balances, rejected claims and short payments that nobody had time to chase."], ["medical-billing-services-for-small-practices.html", "Billing for small practices", "Medical billing for small practices", "Eligibility to patient statements, with one team and one weekly report."], ["credentialing-and-enrollment-services.html", "Credentialing", "Provider credentialing and enrollment", "Payer enrollment, Medicare and Medicaid applications and CAQH upkeep."], ["prior-authorization-and-eligibility-verification.html", "Prior auth and eligibility", "Prior authorization and eligibility checks", "Check coverage before the visit and get approvals before costly procedures."]], "HOME_FAQ": [["What is revenue cycle management (RCM)?", "Revenue cycle management is the process of getting paid for care: checking coverage, getting approvals, coding, sending claims, posting payments, following up on unpaid claims, handling denials and billing patients."], ["What does an AR follow-up company do?", "It tracks claims that were sent to insurers but not paid, finds out why, fixes or appeals them and reports on progress. Our team calls payers, checks portals and records every answer."], ["Is outsourcing medical billing worth it for a small practice?", "It can be, when billing work keeps getting delayed or one person is overloaded. A baseline audit shows how your claims perform today, so you can decide with facts."], ["Do you guarantee collections?", "No. We never promise a specific collection amount. We promise the work, the tracking and a clear weekly report."], ["How do we get started?", "Book a call. We then run a baseline audit, agree a written scope and start a 30-day pilot that you review before deciding to continue."], ["Is our patient information safe with you?", "A signed Business Associate Agreement, NDA and service agreement come before any patient information is shared. Our team uses company systems only, with role-based access and HIPAA training."]], "PAGES": ["ar-follow-up-services.html", "denial-management-services.html", "unpaid-claims-recovery.html", "medical-billing-services-for-small-practices.html", "credentialing-and-enrollment-services.html", "prior-authorization-and-eligibility-verification.html"]}''')
LINKS, HOME_FAQ, NEW_PAGES = DATA["LINKS"], DATA["HOME_FAQ"], DATA["PAGES"]

for s in NEW_PAGES:
    if not os.path.exists(os.path.join("public", s)):
        sys.exit("Missing public/" + s + ". Copy the whole public folder from the zip into your project first.")

def read(p):
    with open(p, encoding="utf-8") as f: return f.read()
def write(p, t):
    with open(p, "w", encoding="utf-8", newline="") as f: f.write(t)
def plain(s): return html.unescape(re.sub(r"<[^>]+>", "", s))

# ---------- 1. home page ----------
cards = "".join(f'<a href="{s}"><b>{ti}</b><span>{bl}</span><em>Learn more &rarr;</em></a>' for s, _, ti, bl in LINKS)
SERV = f'''<!-- SEO2:services-start -->
<section class="section" id="solutions">
  <div class="wrap">
    <div class="sec-h">
      <span class="eyebrow">Our services in detail</span>
      <h2>AR follow-up, denial management and billing support for independent practices.</h2>
      <p>Choose the service you need. Each page explains what we do, how we work and what you receive every week.</p>
    </div>
    <div class="rel">{cards}</div>
  </div>
</section>
<!-- SEO2:services-end -->
'''
faq_html = "".join(f"      <details><summary>{q}</summary><p>{a}</p></details>\n" for q, a in HOME_FAQ)
FAQ = f'''<!-- SEO2:faq-start -->
<section class="section" id="faq">
  <div class="wrap">
    <div class="sec-h">
      <span class="eyebrow">Questions</span>
      <h2>Questions practice owners ask before they hire an RCM partner.</h2>
    </div>
    <div class="faq" style="max-width:820px">
{faq_html}    </div>
  </div>
</section>
<!-- SEO2:faq-end -->
'''
ld = {"@context": "https://schema.org", "@graph": [
    {"@type": "ItemList", "name": "Arovia RCM services",
     "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": ti, "url": SITE + "/" + s} for i, (s, _, ti, _) in enumerate(LINKS)]},
    {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": plain(q), "acceptedAnswer": {"@type": "Answer", "text": plain(a)}} for q, a in HOME_FAQ]},
]}
LD = '<!-- SEO2:ld-start -->\n<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>\n<!-- SEO2:ld-end -->\n'

def strip(t, name):
    return re.sub(r"<!-- SEO2:%s-start -->.*?<!-- SEO2:%s-end -->\n?" % (name, name), "", t, flags=re.S)

p = os.path.join("public", "index.html")
t = read(p)
for n in ("services", "faq", "ld"): t = strip(t, n)
a = '<section class="section pat" id="help">'
b = '<section class="section pat" id="contact">'
if a not in t or b not in t: sys.exit("index.html structure not as expected (id=help / id=contact missing).")
t = t.replace(a, SERV + a, 1).replace(b, FAQ + b, 1)
t = t.replace("</head>", LD + "</head>", 1)
if 'fetchpriority' not in t:
    t = t.replace('<img src="assets/photos/hero.jpg"', '<img fetchpriority="high" src="assets/photos/hero.jpg"', 1)
write(p, t)
print("patched index.html")

# ---------- 2. preconnect + footer links on existing pages ----------
def service_links(prefix):
    return "".join(f'<a href="{s}">{lab}</a>' for s, lab, _, _ in LINKS)

for name, home in (("index.html", ""), ("how-we-work.html", "index.html"), ("privacy.html", "index.html"), ("terms.html", "index.html")):
    p = os.path.join("public", name)
    if not os.path.exists(p): continue
    t = read(p)
    if 'rel="preconnect"' not in t:
        t = t.replace('<link rel="stylesheet" href="https://fonts.googleapis.com',
                      '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com', 1)
    if ">AR follow-up</a>" not in t:
        t = re.sub(r'(<div class="f-links">.*?Services</a>)', lambda m: m.group(1) + service_links(""), t, count=1, flags=re.S)
    write(p, t)
    print("patched", name)

# ---------- 3. css ----------
css = os.path.join("public", "css", "style.css")
c = read(css)
if "/* seo2 */" not in c:
    c += '''
/* seo2 */
.crumbs{font:500 13px var(--mono);color:#9FC3F5;margin-bottom:14px}
.crumbs a{color:#BFD9FF;text-decoration:none}.crumbs a:hover{text-decoration:underline}
.legal ul,.legal ol{margin:0 0 16px 1.2em;line-height:1.7}.legal li{margin:6px 0}
.faq details{border:1px solid var(--line);border-radius:14px;padding:2px 20px;margin:10px 0;background:var(--panel)}
.faq summary{cursor:pointer;font-weight:600;padding:14px 0;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";float:right;color:var(--accent);font-size:1.2rem;line-height:1}
.faq details[open] summary::after{content:"\\2013"}
.faq p{margin:0 0 16px;color:var(--muted);line-height:1.65}
.rel{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
.rel a{display:grid;gap:8px;align-content:start;padding:22px;border:1px solid var(--line);border-radius:14px;background:var(--panel);text-decoration:none;color:var(--text);transition:transform .2s,border-color .2s}
.rel a:hover{transform:translateY(-3px);border-color:var(--accent)}
.rel b{font:600 1.02rem/1.3 var(--display)}
.rel span{color:var(--muted);font-size:.93rem;line-height:1.55}
.rel em{font:600 13px var(--mono);font-style:normal;color:var(--accent)}
@media(min-width:760px){.f-links{grid-auto-flow:column;grid-template-rows:repeat(6,auto);grid-template-columns:none;gap:8px 36px}}
'''
    write(css, c)
    print("patched css")

# ---------- 4. sitemap ----------
urls = [("", "1.0"), ("how-we-work.html", "0.8")] + [(s, "0.9") for s in NEW_PAGES] + [("privacy.html", "0.3"), ("terms.html", "0.3")]
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + \
     "".join(f"  <url><loc>{SITE}/{u}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>\n" for u, pr in urls) + "</urlset>\n"
write(os.path.join("public", "sitemap.xml"), sm)
print("wrote sitemap.xml")
print("DONE")
