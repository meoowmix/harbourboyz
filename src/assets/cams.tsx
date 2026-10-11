
//NORTH

export const pier = "https://cams.cdn-surfline.com/cdn-ec/ec-cocoabeachpierss/chunklist.m3u8"

export const pierov = "https://cams.cdn-surfline.com/cdn-ec/ec-cocoabeachpierssov/chunklist.m3u8"

export const loriwilsonn = "https://cams.cdn-surfline.com/cdn-ec/ec-loriwilsonnorth/chunklist.m3u8"

export const loriwilsons = "https://cams.cdn-surfline.com/cdn-ec/ec-loriwilsonnorth/chunklist.m3u8"

export const hilton = "https://cams.cdn-surfline.com/cdn-ec/ec-cocoabeachhilton/chunklist.m3u8"

export const sixteenth = "https://cams.cdn-surfline.com/cdn-ec/ec-cocoastreets/chunklist.m3u8"

//CENTRAL

export const hightower = "https://cams.cdn-surfline.com/cdn-ec/ec-hightowerpark/chunklist.m3u8"

export const pelican = "https://cams.cdn-surfline.com/cdn-ec/ec-pelicanbeachpark/chunklist.m3u8"

export const indialanticn = "https://hls.cdn-surfline.com/ohio/ec-hightowerpark/playlist.m3u8"

export const indialantic = "https://cams.cdn-surfline.com/cdn-ec/ec-indialantic/chunklist.m3u8"

//SOUTH

export const oceanave = "https://cams.cdn-surfline.com/cdn-ec/ec-melbournebeach/chunklist.m3u8"

export const inlet = "https://cams.cdn-surfline.com/cdn-ec/ec-sebastianinlet/chunklist.m3u8"

export const inletov = "https://cams.cdn-surfline.com/cdn-ec/ec-sebastianinletov/chunklist.m3u8"

//CENTRAL (embeds)

export interface Cam {
  title: string;
  src: string;
  credit: string;
  creditUrl: string;
  embed: boolean; // false = link out instead of embedding
  hls?: boolean;  // true = play as HLS with hls.js instead of iframe
}

export const centralCams: Cam[] = [
  {
    title: 'Hightower',
    src: 'https://embed.cdn-surfline.com/cams/583499f1e411dc743a5d5297/b5a433655f33a2003d6031cc8a8357d699e8a3a3',
    credit: 'City of Satellite Beach',
    creditUrl: 'https://www.satellitebeach.gov/residents/beach-surf-cams/',
    embed: true,
  },
  {
    title: 'Pelican',
    src: 'https://embed.cdn-surfline.com/cams/58349ed8e411dc743a5d52c9/c97936cc71147ad6ee0d408ab6e55893806b4325',
    credit: 'City of Satellite Beach',
    creditUrl: 'https://www.satellitebeach.gov/residents/beach-surf-cams/',
    embed: true,
  },
  {
    title: 'Indian Harbour',
    src: 'https://g1.ipcamlive.com/player/player.php?alias=5a03b2517977d&autoplay=1&mute=1',
    credit: 'Harbour House',
    creditUrl: 'https://www.harbourhouseevents.com/surfcam',
    embed: true,
  },
  {
    title: "RC's",
    src: 'https://s69.ipcamlive.com/streams/459rknunop6mhjv5b/stream.m3u8',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/satellite-beach-rcs-surf-report-live-surf-cam-conditions-forecast/',
    embed: true,
    hls: true,
  },
];











