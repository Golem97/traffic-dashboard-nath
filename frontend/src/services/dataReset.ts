const API_BASE_URL = import.meta.env.VITE_FORCE_PRODUCTION === 'true'
  ? 'https://us-central1-traffic-dashboard-nath.cloudfunctions.net'
  : 'http://127.0.0.1:5101/traffic-dashboard-nath/us-central1';

export const resetData = async (): Promise<void> => {
  const isProduction = import.meta.env.VITE_FORCE_PRODUCTION === 'true';
  
  try {
    // Call the reset endpoint
    const response = await fetch(`${API_BASE_URL}/resetData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environment: isProduction ? 'production' : 'local'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Reset result:', result);
  } catch (error) {
    console.error('Error resetting data:', error);
    throw error;
  }
}; 