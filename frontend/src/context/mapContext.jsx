

import { useState } from 'react';
import {createContext} from 'react';

export const MapLocationContext = createContext();

export const MapLocationProvider = ({ children }) => {
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  
    // const value = useMemo(() => ({ ...location, setLocation }), [location]);
  
    return (
      <MapLocationContext.Provider value={ {location, setLocation }}>
        {children}
      </MapLocationContext.Provider>
    );
  };