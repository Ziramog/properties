const runTest = async () => {
  const url = 'https://res.cloudinary.com/dunkbcery/image/upload/v1778980516/roggero-roma/properties/unjandsxwqsshm541l6j.jpg';
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`Status: ${res.status}`);
  } catch (e) {
    console.error(e);
  }
};
runTest();
