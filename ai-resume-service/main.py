import os
import tempfile
from pathlib import Path
from typing import Set

from fastapi import FastAPI, File, HTTPException, UploadFile

from processor import extract_text_from_pdf, process_resume


app = FastAPI(title="Resume Screening Service")

BASE_DIR = Path(__file__).resolve().parent
SKILLS_FILE = Path(os.getenv("SKILLS_FILE_PATH", BASE_DIR / "skills.txt"))


def load_skills_set(file_path: Path) -> Set[str]:
    """Load skills from a local text file (one skill per line)."""
    if not file_path.exists():
        raise FileNotFoundError(f"Skills file not found at: {file_path}")

    skills: Set[str] = set()
    with file_path.open("r", encoding="utf-8") as fp:
        for raw_line in fp:
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            skills.add(line.lower())

    if not skills:
        raise ValueError(f"Skills file is empty: {file_path}")

    return skills


async def save_upload_to_temp(upload: UploadFile, suffix: str = ".pdf") -> str:
    """Persist uploaded file content to a temporary file and return its path."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await upload.read()
        tmp.write(content)
        return tmp.name


@app.post("/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...),
):
    resume_temp_path = None
    jd_temp_path = None

    try:
        if resume.content_type not in {"application/pdf", "application/octet-stream"}:
            raise HTTPException(status_code=400, detail="resume must be a PDF file")
        if jd.content_type not in {"application/pdf", "application/octet-stream"}:
            raise HTTPException(status_code=400, detail="jd must be a PDF file")

        resume_temp_path = await save_upload_to_temp(resume)
        jd_temp_path = await save_upload_to_temp(jd)

        jd_text = extract_text_from_pdf(jd_temp_path)
        skills_set = load_skills_set(SKILLS_FILE)

        result = process_resume(resume_temp_path, jd_text, skills_set)

        return {
            "match_percentage": result.get("match_percentage", 0),
            "matching_skills": result.get("matching_skills", []),
            "missing_skills": result.get("missing_skills", []),
            "status": result.get("status", "Not Shortlisted ❌"),
        }
    except HTTPException:
        raise
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {exc}") from exc
    finally:
        if resume_temp_path and os.path.exists(resume_temp_path):
            os.remove(resume_temp_path)
        if jd_temp_path and os.path.exists(jd_temp_path):
            os.remove(jd_temp_path)
