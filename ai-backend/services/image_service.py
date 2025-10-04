import openai
import os
import requests
import base64
from pydantic import BaseModel
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

# 환경변수에서 키 가져오기
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
STABLE_DIFFUSION_API_KEY = os.getenv("STABLE_DIFFUSION_API_KEY")

class SimpleInput(BaseModel):
    prompt: str

async def generate_image_from_prompt(input_data: SimpleInput):
    # 1. GPT에게 질문
    client = openai.OpenAI(api_key=OPEN_AI_API_KEY)
    completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are an AI fashion stylist. Given a scene or situation, you recommend the most suitable outfit in English, describing the clothing in detail."},
        {"role": "user", "content": f"Recommend a detailed and trendy hip outfit inspired by urban street style for the following scene or situation. Only return the English outfit description. Scene: {input_data.prompt}"}
    ],
    temperature=0.5
    )
    gpt_answer = completion.choices[0].message.content

    # 2. Stability.ai Stable Diffusion API로 이미지 생성
    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        headers={
            "Authorization": f"Bearer {STABLE_DIFFUSION_API_KEY}",
            "Accept": "image/*",
        },
        files={"none": ""},
        data={
            "model": "sd3.5-large-turbo",
            "prompt": gpt_answer + " high quality image",
            "aspect_ratio": "1:1",
            "output_format": "jpeg",
        },
    )

    if response.status_code == 200:
        encoded_image = base64.b64encode(response.content).decode("utf-8")
        return {"gpt_answer": gpt_answer, "image": encoded_image}
    else:
        raise HTTPException(
            status_code=500,
            detail=f"Image generation failed: {response.status_code} - {response.text}"
        )