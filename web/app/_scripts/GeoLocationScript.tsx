"use client";
import Script from "next/script";
import React, { createContext, Fragment, PropsWithChildren, useState } from "react";

export interface GeoLocationInfo {
   request: string,
   status: string;
   credit: string;
   city: string;
   region: string;
   regionCode: string;
   regionName: string
   areaCode: string;
   dmaCode: string;
   countryCode: string;
   countryName: string;
   inEU: string;
   euVATrate: string;
   continentCode: string;
   latitude: string;
   longitude: string;
   timezone: string;
   currencyCode: string;
   currencySymbol: string
   currencySymbol_UTF8: string;
}

const PLUGIN_SCRIPT = `http://www.geoplugin.net/javascript.gp`;
export const GeoLocationContext = createContext<GeoLocationInfo>(null!);

export interface GeoLocationScriptProps extends PropsWithChildren {
}

const GeoLocationProvider = ({ children }: GeoLocationScriptProps) => {
   const [geoLocation, setGeoLocation] = useState<GeoLocationInfo>(null!);
   return (
      <Fragment>
         <Script onLoad={_ => {
            const pluginFunctions = Object
               .keys(window)
               .filter(x => x.startsWith("geoplugin_") && typeof window[x] === "function");
            const res = pluginFunctions.reduce((acc, curr) => {
               // @ts-ignore
               acc[curr.replaceAll(`geoplugin_`, ``).trim()] = window[curr]?.();
               return acc;
            }, {});
            setGeoLocation(res as GeoLocationInfo);
         }} src={PLUGIN_SCRIPT} />
         <GeoLocationContext.Provider value={geoLocation}>
            {children}
         </GeoLocationContext.Provider>
      </Fragment>
   );
};

export default GeoLocationProvider;