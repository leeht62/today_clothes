import os
import requests
import xmltodict
from datetime import datetime

SERVICE_KEY = os.getenv("SERVICE_KEY")
API_URL = "https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst"

def get_current_date_string():
    return datetime.now().strftime("%Y%m%d")

def get_current_hour_string():
    now = datetime.now()

    if now.minute < 45:
        hour = now.hour - 1
        if hour < 0:
            hour = 23
    else:
        hour = now.hour

    return f"{hour:02d}30"

def make_weather_prompt():
    params = {
        "authKey": SERVICE_KEY,
        "pageNo": "1",
        "numOfRows": "1000",
        "dataType": "XML",
        "base_date": get_current_date_string(),
        "base_time": get_current_hour_string(),
        "nx": "55",
        "ny": "127",
    }

    res = requests.get(API_URL, params=params, timeout=10, verify=False)
    res.raise_for_status()

    dict_data = xmltodict.parse(res.text)
    items = dict_data["response"]["body"]["items"]["item"]

    if not isinstance(items, list):
        items = [items]

    weather_data = {}

    for item in items:
        category = item["category"]
        value = item["obsrValue"]

        if category == "T1H":
            weather_data["temperature"] = value
        elif category == "REH":
            weather_data["humidity"] = value
        elif category == "PTY":
            weather_data["precipitation"] = value

    precipitation_map = {
        "0": "no rain",
        "1": "rainy",
        "2": "rain and snow",
        "3": "snowy",
        "5": "drizzle",
        "6": "sleet",
        "7": "light snow",
    }

    temperature = weather_data.get("temperature", "unknown")
    humidity = weather_data.get("humidity", "unknown")
    precipitation = precipitation_map.get(
        weather_data.get("precipitation", "0"),
        "normal weather"
    )

    return (
        f"Today's weather in Seoul: {temperature} degrees Celsius, "
        f"{humidity}% humidity, {precipitation}."
    )