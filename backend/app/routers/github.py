from fastapi import APIRouter, HTTPException, Path
import httpx

from app.schemas.github import AnalyticsSummary, UserProfile
from app.services.github_service import github_service

router = APIRouter()


@router.get("/user/{username}", response_model=UserProfile)
async def get_user_profile(
    username: str = Path(..., min_length=1, max_length=39),
):
    try:
        return await github_service.get_profile(username)
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
        raise HTTPException(status_code=502, detail="GitHub API error")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.get("/analytics/{username}", response_model=AnalyticsSummary)
async def get_analytics(
    username: str = Path(..., min_length=1, max_length=39),
):
    try:
        return await github_service.get_analytics(username)
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found. Check the username and try again.")
        if exc.response.status_code == 403:
            raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded. Please try again later.")
        raise HTTPException(status_code=502, detail=f"GitHub API error: {exc.response.status_code}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to fetch analytics: {str(exc)}")
