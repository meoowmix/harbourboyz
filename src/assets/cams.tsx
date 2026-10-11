//CENTRAL (embeds)

export interface Cam {
  title: string;
  src: string;
  credit: string;
  creditUrl: string;
  embed: boolean; // false = link out instead of embedding
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
    src: 'https://surfguru.com/satellite-beach-rcs-surf-report-live-surf-cam-conditions-forecast/',
    credit: 'SurfGuru',
    creditUrl: 'https://surfguru.com/satellite-beach-rcs-surf-report-live-surf-cam-conditions-forecast/',
    embed: false,
  },
];