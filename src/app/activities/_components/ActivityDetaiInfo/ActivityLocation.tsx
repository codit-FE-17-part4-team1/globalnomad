'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import type { ActivityDetailInfo } from '@/types/activity';

export interface ActivityLocationProps {
  address: ActivityDetailInfo['address'];
}

// Kakao 지도 Geocoder 결과 타입
interface GeocoderResult {
  address_name: string;
  x: string;
  y: string;
}

const ActivityLocation = ({ address }: ActivityLocationProps) => {
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  // 지도 초기화 함수
  const initializeMap = useCallback(() => {
    const kakao = window.kakao;
    if (!address || !mapRef.current || !kakao?.maps) return;

    const maps = kakao.maps;
    const container = mapRef.current;

    // 처음 로딩되는 지도
    const mapOption = {
      center: new maps.LatLng(37.5665, 126.978), // 초기 중심 좌표
      level: 3,
    };
    const map = new maps.Map(container, mapOption);

    const geocoder = new maps.services.Geocoder();

    geocoder.addressSearch(
      address,
      (result: GeocoderResult[], status: string) => {
        if (status === maps.services.Status.OK && result.length > 0) {
          const coords = new maps.LatLng(
            Number(result[0].y),
            Number(result[0].x)
          );
          map.setCenter(coords);

          // 마커
          const marker = new maps.Marker({
            map,
            position: coords,
          });

          // 인포윈도우
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

          const infowindow = new maps.InfoWindow({
            content: iwContent,
            position: coords,
            removable: true,
          });

          infowindow.open(map, marker);

          // 마커 클릭 이벤트
          let isOpen = true;
          maps.event.addListener(marker, 'click', () => {
            if (isOpen) infowindow.close();
            else infowindow.open(map, marker);
            isOpen = !isOpen;
          });

          setLoading(false); // 지도 로딩 완료
        } else {
          console.error('주소 변환 실패:', status, address);
          setLoading(false);
        }
      }
    );
  }, [address]);

  // SDK 로드 후 지도 초기화
  useEffect(() => {
    // mapRef가 존재하고 Kakao SDK가 이미 로드된 경우 초기화
    if (mapRef.current && window.kakao?.maps) {
      window.kakao.maps.load(initializeMap);
    }
  }, [initializeMap]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Kakao Map SDK 로드 */}
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=f0b27e2a9ba99a3eb688c3aba9e9d651&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => {
          if (mapRef.current && window.kakao?.maps) {
            window.kakao.maps.load(initializeMap); // setIsKakaoLoaded 제거
          }
        }}
        onError={() => console.error('Kakao SDK 로드 실패')}
      />
      {/* 지도 영역 */}
      <div
        ref={mapRef}
        id="map"
        className="w-full h-[450px] rounded-2xl bg-gray-200 relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl">
            <span className="text-gray-500">지도 로딩 중...</span>
          </div>
        )}
      </div>

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
