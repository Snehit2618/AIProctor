import os
import tempfile
from pathlib import Path
from typing import Set

from fastapi import FastAPI, File, HTTPException, UploadFile, Request

from processor import extract_text_from_pdf, process_resume


app = FastAPI(title="Resume Screening Service")

BASE_DIR = Path(__file__).resolve().parent
SKILLS_FILE = Path(os.getenv("SKILLS_FILE_PATH", BASE_DIR / "skills.txt"))

DEFAULT_SKILLS = {
    'python', 'javascript', 'react', 'node', 'nodejs', 'typescript', 'java',
    'c++', 'c#', 'golang', 'go', 'rust', 'sql', 'postgresql', 'mysql', 'mongodb',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'git', 'linux',
    'html', 'css', 'angular', 'vue', 'django', 'flask', 'fastapi', 'spring',
    'machine learning', 'ml', 'ai', 'deep learning', 'tensorflow', 'pytorch',
    'nlp', 'data science', 'analytics', 'tableau', 'powerbi', 'excel',
    'agile', 'scrum', 'rest', 'api', 'graphql', 'microservices', 'redis',
    'elasticsearch', 'kafka', 'rabbitmq', 'ci/cd', 'jenkins', 'github actions',
    'react native', 'flutter', 'swift', 'kotlin', 'scala', 'hadoop', 'spark',
    'pandas', 'numpy', 'r', 'sas', 'figma', 'sketch', 'adobe xd'
}


def load_skills_set(file_path: Path) -> Set[str]:
    if not file_path.exists():
        return DEFAULT_SKILLS

    skills: Set[str] = set()
    try:
        with file_path.open("r", encoding="utf-8") as fp:
            for raw_line in fp:
                line = raw_line.strip()
                if not line or line.startswith("#"):
                    continue
                skills.add(line.lower())
    except Exception:
        pass

    return skills if skills else DEFAULT_SKILLS


async def save_upload_to_temp(upload: UploadFile, suffix: str = ".pdf") -> str:
    content = await upload.read()
    ext = Path(upload.filename).suffix if upload.filename else ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(content)
        return tmp.name


@app.get("/")
async def root():
    return {"status": "ok", "service": "Resume Screening Service"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...),
):
    resume_temp_path = None
    jd_temp_path = None

    try:
        resume_temp_path = await save_upload_to_temp(resume)
        jd_temp_path = await save_upload_to_temp(jd)

        jd_text = extract_text_from_pdf(jd_temp_path)
        skills_set = load_skills_set(SKILLS_FILE)
        result = process_resume(resume_temp_path, jd_text, skills_set)

        return {
            "match_percentage": result.get("match_percentage", 0),
            "matching_skills": result.get("matching_skills", []),
            "missing_skills": result.get("missing_skills", []),
            "status": result.get("status", "Not Shortlisted"),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {exc}") from exc
    finally:
        if resume_temp_path and os.path.exists(resume_temp_path):
            os.remove(resume_temp_path)
        if jd_temp_path and os.path.exists(jd_temp_path):
            os.remove(jd_temp_path)


@app.post("/analyze-resume-text")
async def analyze_resume_text(request: Request):
    resume_temp_path = None

    try:
        form = await request.form()
        resume_file = form.get("resume")
        jd_text = form.get("jd_text") or ""

        if not resume_file:
            raise HTTPException(status_code=400, detail="resume file is required")

        resume_temp_path = await save_upload_to_temp(resume_file)
        skills_set = load_skills_set(SKILLS_FILE)
        result = process_resume(resume_temp_path, jd_text, skills_set)

        return {
            "match_percentage": result.get("match_percentage", 0),
            "matching_skills": result.get("matching_skills", []),
            "missing_skills": result.get("missing_skills", []),
            "status": result.get("status", "Not Shortlisted"),
            "predicted_role": result.get("predicted_role", ""),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {exc}") from exc
    finally:
        if resume_temp_path and os.path.exists(resume_temp_path):
            os.remove(resume_temp_path)