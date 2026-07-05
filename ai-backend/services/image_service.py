import openai
import os
import requests
import base64
import boto3
import uuid
from pydantic import BaseModel
from fastapi import HTTPException
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
from rembg import remove
from services.weather_service import make_weather_prompt


load_dotenv()

# 환경변수에서 키 가져오기
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
STABLE_DIFFUSION_API_KEY = os.getenv("STABLE_DIFFUSION_API_KEY")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-2")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
AWS_S3_PUBLIC_BASE_URL = os.getenv("AWS_S3_PUBLIC_BASE_URL")

class SimpleInput(BaseModel):
    prompt: str


async def generate_image_from_prompt(input_data: SimpleInput):
    # 1. GPT에게 질문
    client = openai.OpenAI(api_key=OPEN_AI_API_KEY)
    completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are an AI fashion stylist. Given a scene or situation, you recommend the most suitable outfit in English, describing the clothing in detail."},
        {"role": "user", "content": f"Recommend a detailed and trendy outfit based on the current weather. The style should be urban, hip, and stylish. Only return the English outfit description. Scene: {input_data.prompt}"}
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

class ProductAiImageRequest(BaseModel):
    productId: int
    originalImage: str
    productName: str
    category: str

async def generate_product_ai_image(input_data: ProductAiImageRequest):
    image_response = requests.get(input_data.originalImage, timeout=20)

    if image_response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"Original image download failed: {image_response.status_code}"
        )

    original_image = Image.open(BytesIO(image_response.content)).convert("RGBA")

    removed_background = remove(original_image)

    cutout_buffer = BytesIO()
    removed_background.save(cutout_buffer, format="PNG")
    cutout_buffer.seek(0)

    weather_prompt = make_weather_prompt()

    prompt = (
        f"Create a realistic fashion lookbook image of a person wearing the clothing item "
        f"from the reference image. "
        f"The outfit must be suitable for this weather: {weather_prompt} "
        f"Product name: {input_data.productName}. "
        f"Category: {input_data.category}. "
        f"Keep the clothing item visually consistent with the reference image. "
        f"Show a full-body fashion model wearing the item, natural pose, realistic body, "
        f"clean background, premium online shopping mall style, realistic lighting, "
        f"high resolution, commercial fashion photography."
    )

    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        headers={
            "Authorization": f"Bearer {STABLE_DIFFUSION_API_KEY}",
            "Accept": "image/*",
        },
        files={
            "image": ("cutout.png", cutout_buffer, "image/png"),
        },
        data={
            "model": "sd3.5-large-turbo",
            "mode": "image-to-image",
            "prompt": prompt,
            "strength": "0.55",
            "output_format": "jpeg",
        },
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"AI image generation failed: {response.status_code} - {response.text}"
        )

    ai_image_url = upload_ai_image_to_s3(response.content, input_data.productId)

    return {
        "productId": input_data.productId,
        "aiImageUrl": ai_image_url
    }
def upload_ai_image_to_s3(image_bytes: bytes, product_id: int) -> str:
    s3_client = boto3.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

    object_key = f"products/{product_id}/ai/{uuid.uuid4()}.jpg"

    s3_client.put_object(
        Bucket=AWS_S3_BUCKET,
        Key=object_key,
        Body=image_bytes,
        ContentType="image/jpeg",
    )

    return f"{AWS_S3_PUBLIC_BASE_URL}/{object_key}"