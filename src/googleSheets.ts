export async function submitToGoogleSheets(formData: any) {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxiC2OmkTGLO2ZpZ4vq5FpMYWHtR_rA27QhlU5hM0okGxGXMh0kDod79rgvWQucmu9M/exec';

  // Format the data as expected by the Apps Script
  const payload = {
    data: {
      ...formData,
      // Add any missing fields that the sheet expects
      image1: '',  // Add if you plan to implement image upload later
      image2: '',  // Add if you plan to implement image upload later
      timestamp: new Date().toISOString()
    }
  };

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    throw new Error('Failed to submit form');
  }
}