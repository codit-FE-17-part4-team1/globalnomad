// types/kakao.d.ts

export {};

declare global {
  interface Window {
    kakao?: {
      maps: {
        Map: new (container: HTMLElement, options: MapOptions) => MapInstance;
        LatLng: new (lat: number, lng: number) => LatLngInstance;
        Marker: new (options: MarkerOptions) => MarkerInstance;
        InfoWindow: new (options: InfoWindowOptions) => InfoWindowInstance;
        event: {
          addListener: <T extends object>(
            target: T,
            event: string,
            handler: () => void
          ) => void;
        };
        services: {
          Geocoder: new () => GeocoderInstance;
          Status: {
            OK: string;
          };
        };
        load: (callback: () => void) => void;
      };
    };
  }

  // Map 옵션
  interface MapOptions {
    center: LatLngInstance;
    level?: number;
    [key: string]: unknown;
  }

  interface MapInstance {
    setCenter: (latlng: LatLngInstance) => void;
    setLevel: (level: number) => void;
    addOverlayMapTypeId?: (typeId: string) => void;
  }

  interface LatLngInstance {
    getLat: () => number;
    getLng: () => number;
  }

  interface MarkerOptions {
    position: LatLngInstance;
    map?: MapInstance;
    title?: string;
  }

  interface MarkerInstance {
    setMap: (map: MapInstance | null) => void;
    setPosition?: (latlng: LatLngInstance) => void;
  }

  interface InfoWindowOptions {
    content: string;
    removable?: boolean;
    position?: LatLngInstance;
  }

  interface InfoWindowInstance {
    open: (map: MapInstance, marker?: MarkerInstance) => void;
    close: () => void;
  }

  interface GeocoderInstance {
    addressSearch: (
      address: string,
      callback: (result: GeocoderResult[], status: string) => void
    ) => void;
  }

  interface GeocoderResult {
    address_name: string;
    x: string;
    y: string;
    road_address?: {
      address_name: string;
      x: string;
      y: string;
    };
  }
}
