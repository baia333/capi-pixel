export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { event_name, event_time, event_id, user_data, custom_data, event_source_url } = req.body;

  const payload = {
    data: [{
      event_name,
      event_time: event_time || Math.floor(Date.now() / 1000),
      event_id,
      event_source_url: event_source_url || '',
      action_source: 'website',
      user_data: user_data || {},
      custom_data: custom_data || {}
    }]
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/828793066043041/events?access_token=${process.env.CAPI_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
