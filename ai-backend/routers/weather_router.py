from fastapi import APIRouter, HTTPException
import requests
import xmltodict
import os
from datetime import datetime
from services.image_service import generate_image_from_prompt, SimpleInput  # 이미지 생성 함수 import

router = APIRouter()

SERVICE_KEY = os.getenv("SERVICE_KEY")
API_URL = "https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst"

def get_current_date_string():
    current_date = datetime.now().date()
    return current_date.strftime("%Y%m%d")

def get_current_hour_string():
    now = datetime.now()
    if now.minute < 45:
        if now.hour == 0:
            base_time = "2330"
        else:
            pre_hour = now.hour - 1
            if pre_hour < 10:
                base_time = "0" + str(pre_hour) + "30"
            else:
                base_time = str(pre_hour) + "30"
    else:
        if now.hour < 10:
            base_time = "0" + str(now.hour) + "30"
        else:
            base_time = str(now.hour) + "30"
    return base_time

def fetch_ultra_short_weather():
    params = {
        'authKey': SERVICE_KEY,
        'pageNo': '1',
        'numOfRows': '1000',
        'dataType': 'XML',
        'base_date': get_current_date_string(),
        'base_time': get_current_hour_string(),
        'nx': '55',
        'ny': '127'
    }
    try:
        res = requests.get(API_URL, params=params, timeout=10, verify=False)
        res.raise_for_status()
        xml_data = res.text
        print(xml_data)
        dict_data = xmltodict.parse(xml_data)
        return dict_data
    except Exception as e:
        print("기상청 API 호출/파싱 실패:", e)
        return None

def make_weather_prompt():
    dict_data = fetch_ultra_short_weather()
    if not dict_data:
        return None

    try:
        items = dict_data['response']['body']['items']['item']
        if not isinstance(items, list):
            items = [items]
        weather_data = {}
        for item in items:
            # 기온
            if item['category'] == 'T1H':
                weather_data['tmp'] = item['obsrValue']
            # 습도
            if item['category'] == 'REH':
                weather_data['hum'] = item['obsrValue']
            # 하늘상태
            if item['category'] == 'SKY':
                weather_data['sky'] = item['obsrValue']
            # 강수형태
            if item['category'] == 'PTY':
                weather_data['sky2'] = item['obsrValue']

        # 프롬프트 생성
        str_sky = "서울 "
        if weather_data.get('sky') is not None or weather_data.get('sky2') is not None:
            str_sky += "날씨 : "
            if weather_data.get('sky2') == '0':
                if weather_data.get('sky') == '1':
                    str_sky += "맑음"
                elif weather_data.get('sky') == '3':
                    str_sky += "구름많음"
                elif weather_data.get('sky') == '4':
                    str_sky += "흐림"
            elif weather_data.get('sky2') == '1':
                str_sky += "비"
            elif weather_data.get('sky2') == '2':
                str_sky += "비와 눈"
            elif weather_data.get('sky2') == '3':
                str_sky += "눈"
            elif weather_data.get('sky2') == '5':
                str_sky += "빗방울이 떨어짐"
            elif weather_data.get('sky2') == '6':
                str_sky += "빗방울과 눈이 날림"
            elif weather_data.get('sky2') == '7':
                str_sky += "눈이 날림"
            str_sky += "\n"
        if weather_data.get('tmp') is not None:
            str_sky += "온도 : " + weather_data['tmp'] + 'ºC \n'
        if weather_data.get('hum') is not None:
            str_sky += "습도 : " + weather_data['hum'] + '%'
        return str_sky
    except Exception as e:
        print("날씨 프롬프트 생성 실패:", e)
        return None

@router.post("/weather/ai")
async def weather_to_image():
    prompt = make_weather_prompt()
    if not prompt:
        raise HTTPException(status_code=500, detail="날씨 데이터를 가져오는데 실패했습니다.")

    try:
        input_data = SimpleInput(prompt=prompt)
        result = await generate_image_from_prompt(input_data)
        return {
            "weather_prompt": prompt,
            "gpt_answer": result["gpt_answer"],
            "image": result["image"]
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        print("이미지 생성 요청 실패:", e)
        raise HTTPException(status_code=500, detail=f"Image generation failed: {e}")