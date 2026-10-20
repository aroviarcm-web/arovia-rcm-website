import os
import re
import smtplib
import time
from email.message import EmailMessage

from flask import Flask, jsonify, redirect, request, send_from_directory

try:
    import config  # your private config.py (local computer)
except ImportError:
    config = None  # on a host, settings come from environment variables


def setting(name, default=""):
    """Environment variable first (for hosting), then config.py."""
    return os.environ.get(name) or getattr(config, name, default)


app = Flask(__name__, static_folder="public", static_url_path="")
app.config["MAX_CONTENT_LENGTH"] = 64 * 1024  # reject huge requests

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
hits = {}  # ip -> list of timestamps


def clean(text, limit=4000):
    """Trim and remove line breaks that could be used for email header tricks."""
    return str(text or "").replace("\r", " ").strip()[:limit]


def one_line(text, limit=200):
    return " ".join(clean(text, limit).split())


def too_many(ip):
    now = time.time()
    recent = [t for t in hits.get(ip, []) if now - t < 3600]
    if len(recent) >= int(setting("MAX_REQUESTS_PER_HOUR", 5)):
        hits[ip] = recent
        return True
    recent.append(now)
    hits[ip] = recent
    return False


@app.route("/")
def home():
    try:
        return send_from_directory(app.static_folder, "index.html")
    except Exception:
        # On Vercel the public folder is served by its CDN
        return redirect("/index.html")


@app.route("/health")
def health():
    return "ok"


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}
    name = one_line(data.get("name"))
    email = one_line(data.get("email"))
    org = one_line(data.get("organization"))
    kind = one_line(data.get("request_type"))
    details = clean(data.get("details"))
    subject = one_line(data.get("_subject")) or "New request from the Arovia website"

    if not name or not EMAIL_RE.match(email):
        return jsonify(ok=False, error="Name and a valid email are required."), 400

    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0].strip()
    if too_many(ip):
        return jsonify(ok=False, error="Too many requests. Please try again later."), 429

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = setting("GMAIL_USER")
    msg["To"] = setting("NOTIFY_TO") or setting("GMAIL_USER")
    msg["Reply-To"] = email
    msg.set_content(
        f"New request from the Arovia website\n\n"
        f"Name: {name}\nEmail: {email}\nCompany: {org or '-'}\nType: {kind or '-'}\n\n"
        f"{details}\n"
    )

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=20) as server:
            server.login(setting("GMAIL_USER"), setting("GMAIL_APP_PASSWORD").replace(" ", ""))
            server.send_message(msg)
    except Exception as exc:  # show the reason in the logs, not to the visitor
        print("EMAIL ERROR:", exc)
        return jsonify(ok=False, error="Could not send right now."), 502

    return jsonify(ok=True)


if __name__ == "__main__":
    # Local run only. Vercel starts the app by itself.
    app.run(host="127.0.0.1", port=5000, debug=False)