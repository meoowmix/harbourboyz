
export const fetchTideDataForToday = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const begin_date = `${year}${month}${day}`;
    const end_date = `${year}${month}${day}`;
  
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=${begin_date}&end_date=${end_date}&datum=MLLW&station=8721804&time_zone=lst_ldt&units=english&interval=hilo&format=json`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Tide Data for Today:', data);
      return data.predictions;
    } catch (error) {
      console.error('Error fetching tide data:', error);
      return [];
    }
  };
  
  export const fetchSunriseSunset = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const begin_date = `${year}${month}${day}`;
    
    const lat = 28.1483; // Indian Harbour Beach, FL latitude
    const lng = -80.5887; // Indian Harbour Beach, FL longitude
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${begin_date}&formatted=0`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Sunrise/Sunset Data:', data); // Check the response from the API
      return {
        sunrise: new Date(data.results.sunrise),
        sunset: new Date(data.results.sunset),
      };
    } catch (error) {
      console.error('Error fetching sunrise/sunset data:', error);
      return { sunrise: null, sunset: null };
    }
  };
