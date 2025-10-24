'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import type { ActivityDetailInfo } from '@/types/activity';

declare global {
  interface Window {
    kakao: any;
  }
}

export interface ActivityLocationProps {
  address: ActivityDetailInfo['address'];
}

const ActivityLocation: React.FC<ActivityLocationProps> = ({ address }) => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // 지도 초기화 함수
  const initializeMap = () => {
    if (!address || !mapRef.current || !window.kakao?.maps) {
      console.warn('지도 초기화 조건 미충족:', {
        address,
        mapRef: !!mapRef.current,
        kakao: !!window.kakao?.maps,
      });
      return;
    }

    const container = mapRef.current;
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, mapOption);
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result: any, status: any) => {
      if (
        status === window.kakao.maps.services.Status.OK &&
        result.length > 0
      ) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        map.setCenter(coords);

        const marker = new window.kakao.maps.Marker({
          map,
          position: coords,
        });

        const iwContent = `
          <div style="padding:15px 10px;text-align:left;font-size:13px;line-height:1.4;width:250px;">
            <div style="font-weight:600; margin-bottom:6px;">${address}</div>
            <div style="display:flex; gap:8px;">
              <a href="https://map.kakao.com/link/map/${encodeURIComponent(
                address
              )},${result[0].y},${result[0].x}" target="_blank" style="color:#1f8cff;font-size:13px;font-weight:500;">큰지도보기</a>
              <a href="https://map.kakao.com/link/to/${encodeURIComponent(
                address
              )},${result[0].y},${result[0].x}" target="_blank" style="color:#1f8cff;font-size:13px;font-weight:500;">길찾기</a>
            </div>
          </div>
        `;

        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent,
          position: coords,
          removable: true,
        });

        infowindow.open(map, marker);

        let isOpen = true;
        window.kakao.maps.event.addListener(marker, 'click', () => {
          if (isOpen) infowindow.close();
          else infowindow.open(map, marker);
          isOpen = !isOpen;
        });
      } else {
        console.error('주소 변환 실패:', status, address);
      }
    });
  };

  // SDK 로드 후 지도 초기화
  useEffect(() => {
    // 이미 kakao 객체가 존재하는 경우 (새로고침 시 캐시된 경우)
    if (window.kakao && window.kakao.maps && !isKakaoLoaded) {
      setIsKakaoLoaded(true);
    }

    if (isKakaoLoaded && window.kakao?.maps) {
      window.kakao.maps.load(() => {
        initializeMap();
      });
    }
  }, [isKakaoLoaded, address]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Kakao Map SDK 로드 */}
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=f0b27e2a9ba99a3eb688c3aba9e9d651&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Kakao SDK 로드 완료');
          setIsKakaoLoaded(true);
        }}
        onError={() => {
          console.error('Kakao SDK 로드 실패');
        }}
      />

      {/* 지도 영역 */}
      <div
        ref={mapRef}
        id="map"
        className="w-full h-[450px] rounded-2xl bg-gray-200"
      />

      {/* 주소 표시 */}
      {address && (
        <div className="flex items-center gap-1 text-md font-normal text-black mt-2">
          <Image
            src="/icon/location.svg"
            alt="주소 아이콘"
            width={18}
            height={18}
          />
          <span className="font-semibold">주소:</span> {address}
        </div>
      )}
    </div>
  );
};

export default ActivityLocation;
