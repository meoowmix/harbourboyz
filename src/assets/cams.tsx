export interface Cam {
  title: string;
  camKey: string;
  credit: string;
  creditUrl: string;
}

const RESOLVER = 'https://cams-gns4.onrender.com';

// camKey -> resolver stream URL (redirects to the current .m3u8)

export const HLS_CAMS: Record<string, string> = {
  jetty_park: `${RESOLVER}/stream/ipcamlive/6abe8ff723663`,
  cocoa_beach_pier: `${RESOLVER}/stream/ipcamlive/6abece14b2d9a`,
  cocoa_beach_streets: `${RESOLVER}/stream/ipcamlive/6a7dcf1fdba07`,
  rcs: `${RESOLVER}/stream/ipcamlive/6ab5393e47a81`,
  indialantic: `${RESOLVER}/stream/ipcamlive/6ab53f2c001bd`,
  melbourne_beach: `${RESOLVER}/stream/ipcamlive/6ab59441a59bd`,
  sebastian_inlet: `${RESOLVER}/stream/ipcamlive/6abe8d06749e0`,
};

export const IFRAME_CAMS: Record<string, string> = {
  _iframe_hightower: 'https://embed.cdn-surfline.com/cams/583499f1e411dc743a5d5297/b5a433655f33a2003d6031cc8a8357d699e8a3a3',
  _iframe_pelican: 'https://embed.cdn-surfline.com/cams/58349ed8e411dc743a5d52c9/c97936cc71147ad6ee0d408ab6e55893806b4325',
  _iframe_harbour: 'https://g1.ipcamlive.com/player/player.php?alias=5a03b2517977d&mute=1',
};

// NORTH

export const northCams: Cam[] = [
  {
    title: 'Jetty Park',
    camKey: 'jetty_park',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/jetty-park-surf-report-live-surf-cam-conditions-forecast/',
  },
  {
    title: 'Cocoa Beach Pier',
    camKey: 'cocoa_beach_pier',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/cocoa-beach-pier-south-surf-cam-and-report/',
  },
  {
    title: 'Cocoa Beach Streets',
    camKey: 'cocoa_beach_streets',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/cocoa-beach-streets-surf-report-current-conditions-forecast-surf-cam/',
  },
];

// CENTRAL

export const centralCams: Cam[] = [
  {
    title: 'Hightower',
    camKey: '_iframe_hightower',
    credit: 'City of Satellite Beach',
    creditUrl: 'https://www.satellitebeach.gov/residents/beach-surf-cams/',
  },
  {
    title: 'Pelican',
    camKey: '_iframe_pelican',
    credit: 'City of Satellite Beach',
    creditUrl: 'https://www.satellitebeach.gov/residents/beach-surf-cams/',
  },
  {
    title: 'Indian Harbour',
    camKey: '_iframe_harbour',
    credit: 'Harbour House',
    creditUrl: 'https://www.harbourhouseevents.com/surfcam',
  },
  {
    title: "RC's",
    camKey: 'rcs',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/satellite-beach-rcs-surf-report-live-surf-cam-conditions-forecast/',
  },
];

// SOUTH

export const southCams: Cam[] = [
  {
    title: 'Indialantic Boardwalk',
    camKey: 'indialantic',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/indialantic-boardwalk-surf-report-live-surf-cam-conditions-forecast/',
  },
  {
    title: 'Melbourne Beach',
    camKey: 'melbourne_beach',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/melbourne-beach-surf-report-live-surf-cam-conditions-forecast/',
  },
  {
    title: 'Sebastian Inlet',
    camKey: 'sebastian_inlet',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/sebastian-inlet-surf-report-live-surf-cam-conditions-forecast/',
  },
];