import { useState, useEffect } from 'react';

import { Location, Station } from './TrainComponents';

interface Stop {
  stopId: string;
  stopName: string;
  distance: number;
}

interface Train {
  arrivalTime: string;
  tripId: string;
  routeId: string;
}

interface BackendResponse {
  stopId: string;
  southbound: Train[];
  northbound: Train[];
}

const LOCATION_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
export const GRAND_CENTRAL = { lat: 40.7527, lng: -73.9772 };

function getSavedLocation() {
  const saved = localStorage?.getItem('userLocation');
  if (saved) {
    const parsed = JSON.parse(saved);
    const isRecent =
      new Date().getTime() - parsed.timestamp < LOCATION_EXPIRY_TIME;
    if (isRecent) {
      return parsed.location;
    }
  }
  return null;
}

function saveLocation(location: Location) {
  const data = {
    location,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem('userLocation', JSON.stringify(data));
}

async function fetchIPGeolocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return { lat: data.latitude, lng: data.longitude };
  } catch (error) {
    console.error('Failed to get IP geolocation:', error);
    return null;
  }
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [accessLocation, setAccessLocation] = useState(false);
  const [ipLocation, setIpLocation] = useState<boolean>(false);

  useEffect(() => {
    setIpLocation(false);
    const cachedLocation = getSavedLocation();
    if (cachedLocation) {
      setLocation(cachedLocation);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          saveLocation(newLocation);
        },
        async (error) => {
          await fetchIPGeolocation()
            .then((location) => {
              if (location) {
                setLocation(location);
                setIpLocation(true);
              }
            })
            .catch((error) => {
              console.error('Error getting location: ', error);
            });
          setAccessLocation(true);
          console.error('Error getting location: ', error);
        },
      );
    } else {
      console.error('Geolocation is not available.');
    }
  }, []);

  return { location, setLocation, accessLocation, ipLocation };
};

export const useNearestStations = (
  location: Location | null,
  searchRadius: string | number,
  setNearestStopsWithTrains: (stops: Station[]) => void,
) => {
  const [nearestStations, setNearestStations] = useState<Stop[]>([]);
  const [noTrainsFound, setNoTrainsFound] = useState(false);

  if (searchRadius === 'Demo') {
    location = GRAND_CENTRAL;
    searchRadius = 0.25;
  }

  useEffect(() => {
    const findNearestStations = async () => {
      if (!location || !searchRadius) return;
      try {
        const response = await fetch(`/trains/stops/api`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: location.lat,
            lon: location.lng,
            distance: searchRadius,
          }),
        });

        const stopsList = await response.json();
        setNearestStations(stopsList);
      } catch (error) {
        console.error('Error finding nearest stations: ', error);
      }
    };

    setNearestStopsWithTrains([]);
    setNoTrainsFound(false);
    findNearestStations();
  }, [location, searchRadius]);

  return { nearestStations, noTrainsFound, setNoTrainsFound };
};

export const useTrainData = (
  nearestStations: Stop[],
  refreshCounter: number,
) => {
  const [trainData, setTrainData] = useState<BackendResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (nearestStations.length > 0) {
        const stopIds = nearestStations.map((station) => station.stopId);
        try {
          const response = await fetch('/trains/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stopIds }),
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setTrainData(data);
        } catch (error) {
          console.error('Failed to fetch train data:', error);
        }
      } else {
        setTrainData([]);
      }
    };

    fetchData();
  }, [nearestStations, refreshCounter]);

  return trainData;
};

export const useContinuousCountdown = () => {
  const duration = 15;
  const [timer, setTimer] = useState(duration);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          setRefreshCounter((prevCounter) => prevCounter + 1);
          return duration;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { timer, refreshCounter };
};
