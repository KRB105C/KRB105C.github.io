import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    // Ambil data dari Instagram
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error occurred while fetching the data' });
  }
}