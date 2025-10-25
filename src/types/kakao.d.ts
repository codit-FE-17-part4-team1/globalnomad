// types/kakao.d.ts

export {};

declare global {
  interface Window {
    kakao?: {
      maps: {
        Map: new (container: HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        event: {
          addListener: (
            target: any,
            event: string,
            handler: () => void
          ) => void;
        };
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: any, status: string) => void
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
        load: (callback: () => void) => void;
      };
    };
  }
}
