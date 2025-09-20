import React, { useEffect, useState } from 'react';
import { fetchWeather } from '../api/weather';

export default function WeatherImage() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const getWeatherImage = async () => {
      try {
        const res = await fetchWeather();
        setImageUrl(res.imageUrl);
      } catch (err) {
        console.error('날씨 이미지 가져오기 실패:', err);
      }
    };

    getWeatherImage();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h5 className="card-title">오늘의 날씨 이미지</h5>
          {imageUrl ? (
            <img src={imageUrl} alt="weather" className="img-fluid rounded" />
          ) : (
            <p className="text-muted">이미지를 불러오는 중...</p>
          )}
        </div>
      </div>
    </div>
  );
}
