from fastapi import APIRouter
from services.image_service import generate_image_from_prompt, SimpleInput

router = APIRouter()

@router.post("/simple/ai")
async def simple_ai(input: SimpleInput):
    # 이제 모든 로직은 services/image_service.py에 있음
    return await generate_image_from_prompt(input)