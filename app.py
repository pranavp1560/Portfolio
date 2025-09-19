from flask import Flask, render_template, request, redirect, url_for, session
from flask import Flask, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from pymongo import MongoClient
import os

app = Flask(__name__)

# Add this line
app.secret_key = "pranav" 

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# =======================
# MongoDB Atlas Connection
# =======================
MONGO_URI = "mongodb+srv://Navayuvk18:18Navayuvk1982@cluster0.7dsv7du.mongodb.net/ganesh_mandal"
client = MongoClient(MONGO_URI)
db = client["portfolio_db"]

projects_collection = db["projects"]
experiences_collection = db["experiences"]   # ✅ define
contacts_collection = db["contacts"] 

# =======================
# Routes
# =======================

@app.route("/")
def index():
    projects = list(projects_collection.find())
    experiences = list(experiences_collection.find().sort("year", -1))
    return render_template("index.html", projects=projects, experiences=experiences)


# ----- CONTACT FORM -----
@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    if name and email and message:
        contacts_collection.insert_one({
            "name": name,
            "email": email,
            "message": message
        })

    return redirect(url_for("index"))

# ----- ADMIN LOGIN -----
@app.route("/admin", methods=["GET", "POST"])
def admin():
    if request.method == "POST":
        password = request.form.get("password")
        if password == "Pranav@1560":   # <-- set your own password
            session["admin"] = True
            return redirect(url_for("dashboard"))
        else:
            return render_template("admin_login.html", error="Invalid password")
    return render_template("admin_login.html")

# ----- DASHBOARD -----
@app.route("/dashboard")
def dashboard():
    if not session.get("admin"):
        return redirect(url_for("admin"))

    projects = list(projects_collection.find())
    experiences = list(experiences_collection.find())
    contacts = list(contacts_collection.find())

    for c in contacts:
        c["_id"] = str(c["_id"])

    print("Contacts fetched:", contacts)

    return render_template(
        "admin_dashboard.html",
        projects=projects,
        experiences=experiences,
        contacts=contacts
    )
# ----- ADD PROJECT -----
@app.route("/add_project", methods=["POST"])
def add_project():
    if not session.get("admin"):
        return redirect(url_for("admin"))

    title = request.form.get("title")
    description = request.form.get("description")
    link = request.form.get("link")  # new field

    # Get file
    image_file = request.files.get("image")
    image_url = None

    if image_file and image_file.filename:
        filename = secure_filename(image_file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image_file.save(filepath)
        # Store relative path for frontend
        image_url = f"/{filepath}"

    if title and description and image_url and link:
        projects_collection.insert_one({
            "title": title,
            "description": description,
            "image_url": image_url,
            "link": link
        })

    return redirect(url_for("dashboard"))


# ----- ADD EXPERIENCE -----
@app.route("/add_experience", methods=["POST"])
def add_experience():
    if not session.get("admin"):
        return redirect(url_for("admin"))

    role = request.form.get("role")
    company = request.form.get("company")
    year = int(request.form.get("year"))
    details = request.form.get("details")

    if role and company and year and details:
        experiences_collection.insert_one({
            "role": role,
            "company": company,
            "year": year,
            "details": details
        })

    return redirect(url_for("dashboard"))

# ----- LOGOUT -----
@app.route("/logout")
def logout():
    session.pop("admin", None)
    return redirect(url_for("admin"))

if __name__ == "__main__":
    app.run(debug=True)