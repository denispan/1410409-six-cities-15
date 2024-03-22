import {useEffect, useRef} from 'react';
import {Icon, layerGroup, Marker} from 'leaflet';

import {CITIES, URL_MARKER_CURRENT, URL_MARKER_DEFAULT} from '../../const';
import 'leaflet/dist/leaflet.css';
import useMap from '../../hooks/use-map.tsx';
import {OfferShortInfo} from '../../types/offer.ts';
import {Nullable} from 'vitest';

type MapProps = {
  city: typeof CITIES[number];
  offers: OfferShortInfo[];
  activeOffer: Nullable<OfferShortInfo>;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function Map({city, offers, activeOffer}: MapProps) {

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      offers.forEach((offer) => {
        const marker = new Marker({
          lat: offer.location.latitude,
          lng: offer.location.longitude
        });

        marker
          .setIcon(
            activeOffer !== undefined && activeOffer !== null && offer.id === activeOffer.id
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);
      });

      map.flyTo([city.location.latitude, city.location.longitude], 12);

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [city, map, offers, activeOffer]);

  return <section ref={mapRef} className="cities__map map" />;
}

export default Map;
