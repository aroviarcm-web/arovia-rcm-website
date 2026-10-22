# Arovia RCM - SEO patch. Run from the inner project folder:  python apply_seo.py
import json, os, re, sys

if not os.path.exists(os.path.join("public", "index.html")):
    sys.exit("Wrong folder. Open the inner arovia-rcm-website folder (it contains main.py) and run again.")

SITE = "https://www.aroviarcm.com"
OG_IMG = SITE + "/assets/og-image.jpg"

PAGES = {
    "index.html": dict(
        path="",
        title="AR Follow-Up & Denial Management for US Practices | Arovia RCM",
        desc="Arovia RCM helps small and independent US practices with claims follow-up, denial management and transparent reporting from a dedicated remote team.",
    ),
    "how-we-work.html": dict(
        path="how-we-work.html",
        title="How We Work: Discovery, Audit, 30-Day Pilot | Arovia RCM",
        desc="See how Arovia RCM starts: a discovery call, baseline audit, written scope, 30-day pilot and weekly reporting. No work begins until requirements are agreed.",
    ),
}

ORG = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": SITE + "/#org",
            "name": "Arovia RCM",
            "url": SITE + "/",
            "logo": SITE + "/assets/logo-full.png",
            "email": "aroviarcm@gmail.com",
            "telephone": "+91 95297 52648",
            "description": "Healthcare revenue cycle management for independent US practices: AR follow-up, denial management and transparent reporting, delivered remotely from India.",
            "areaServed": "US",
            "sameAs": [
                "https://www.linkedin.com/in/arovia-rcm-revenuecyclemanagement-44b839445/",
                "https://www.facebook.com/profile.php?id=61595311513256",
                "https://www.instagram.com/aroviarcm",
            ],
        },
        {
            "@type": "WebSite",
            "@id": SITE + "/#site",
            "url": SITE + "/",
            "name": "Arovia RCM",
            "publisher": {"@id": SITE + "/#org"},
        },
    ],
}

def head_block(info, with_ld):
    url = SITE + "/" + info["path"]
    lines = [
        "<!-- SEO:start -->",
        f"<title>{info['title']}</title>",
        f'<meta name="description" content="{info["desc"]}">',
        f'<link rel="canonical" href="{url}">',
        '<meta name="robots" content="index,follow">',
        '<meta name="theme-color" content="#071B44">',
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="Arovia RCM">',
        f'<meta property="og:title" content="{info["title"]}">',
        f'<meta property="og:description" content="{info["desc"]}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{OG_IMG}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{info["title"]}">',
        f'<meta name="twitter:description" content="{info["desc"]}">',
        f'<meta name="twitter:image" content="{OG_IMG}">',
    ]
    if with_ld:
        lines.append('<script type="application/ld+json">' + json.dumps(ORG, ensure_ascii=False) + "</script>")
    lines.append("<!-- SEO:end -->")
    return "\n".join(lines) + "\n"

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

def write(p, t):
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(t)

for name, info in PAGES.items():
    p = os.path.join("public", name)
    t = read(p)
    t = re.sub(r"<!-- SEO:start -->.*?<!-- SEO:end -->\n?", "", t, flags=re.S)
    t = re.sub(r"<title>.*?</title>\s*", "", t, flags=re.S)
    t = re.sub(r'<meta name="description"[^>]*>\s*', "", t)
    t = t.replace("</head>", head_block(info, name == "index.html") + "</head>", 1)
    # descriptive image text (the photos are illustrations)
    t = t.replace('alt="Doctor"', 'alt="Illustration of a doctor at an independent medical practice"')
    t = t.replace('alt="Patient"', 'alt="Illustration of a patient"')
    # footer links to the new pages
    if "privacy.html" not in t:
        t = re.sub(r'(<div class="f-links">.*?)(\s*</div>)',
                   lambda m: m.group(1) + '<a href="privacy.html">Privacy</a><a href="terms.html">Terms</a>' + m.group(2),
                   t, count=1, flags=re.S)
    write(p, t)
    print("patched", name)

css = os.path.join("public", "css", "style.css")
c = read(css)
if ".legal{" not in c:
    c += "\n.legal{max-width:760px}.legal h2{font:600 1.25rem/1.3 var(--display);margin:34px 0 10px}.legal p{line-height:1.7;margin:0 0 14px}.legal a{color:var(--brand)}\n"
    write(css, c)
    print("patched css")
print("DONE")
