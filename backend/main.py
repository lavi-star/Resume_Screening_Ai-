from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

origins = [*]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

skills_db = [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "SQL",
    "React",
    "FastAPI",
    "JavaScript",
    "Data Science",
    "NLP",
    "TensorFlow",
]

recommendations_db = {
    "React": "Learn React frontend development",
    "FastAPI": "Build APIs using FastAPI",
    "Deep Learning": "Study Neural Networks and CNNs",
    "NLP": "Practice Natural Language Processing projects",
    "TensorFlow": "Build ML models using TensorFlow",
}


@app.get("/")
def home():
    return {"message": "AI Resume Screening Backend Running"}


@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    text = ""

    # PDF Text Extraction
    with pdfplumber.open(file.file) as pdf:

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:
                text += extracted + " "

    # Extract Skills
    extracted_skills = []

    for skill in skills_db:

        if re.search(skill, text, re.IGNORECASE):
            extracted_skills.append(skill)

    # Matched Skills
    matched_skills = []

    for skill in extracted_skills:

        if re.search(skill, job_description, re.IGNORECASE):
            matched_skills.append(skill)

    # Missing Skills
    missing_skills = []

    for skill in skills_db:

        if re.search(skill, job_description, re.IGNORECASE):

            if skill not in extracted_skills:
                missing_skills.append(skill)

    # NLP Similarity using TF-IDF
    documents = [text, job_description]

    tfidf = TfidfVectorizer()

    tfidf_matrix = tfidf.fit_transform(documents)

    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )

    similarity_score = round(similarity[0][0] * 100)

    # Skill Based Score
    skill_score = 0

    if len(matched_skills) + len(missing_skills) > 0:

        skill_score = (
            len(matched_skills) /
            (len(matched_skills) + len(missing_skills))
        ) * 100

    # Final ATS Score
    score = int((similarity_score * 0.7) + (skill_score * 0.3))

    # Recommendation Message
    if score >= 80:

        recommendation = (
            "Excellent match! High chances of selection."
        )

    elif score >= 60:

        recommendation = (
            "Good match! Improve some missing skills."
        )

    elif score >= 40:

        recommendation = (
            "Average match. Add more relevant skills."
        )

    else:

        recommendation = (
            "Low match. Resume needs improvement."
        )

    # Learning Recommendations
    recommendations = []

    for skill in missing_skills:

        if skill in recommendations_db:
            recommendations.append(
                recommendations_db[skill]
            )

    return {

        "match_score": score,

        "similarity_score": similarity_score,

        "recommendation": recommendation,

        "extracted_skills": extracted_skills,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "recommendations": recommendations,

        "resume_text": text[:3000]

    }