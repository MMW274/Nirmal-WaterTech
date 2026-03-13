export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, phone, email, service, message } = req.body;

  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Nirmal Water Tech Website <quotes@nirmalwatertech.com>',
        to: ['nirmalwater@hotmail.com'],
        subject: `New Quote Request — ${service}`,
        html: `
          <h2 style="color:#1859d4;font-family:sans-serif">New Quote Request</h2>
          <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%">
            <tr><td style="padding:8px 12px;background:#f2f6fe;font-weight:700;width:140px">Name</td><td style="padding:8px 12px;border-bottom:1px solid #e5eaf2">${name}</td></tr>
            <tr><td style="padding:8px 12px;background:#f2f6fe;font-weight:700">Company</td><td style="padding:8px 12px;border-bottom:1px solid #e5eaf2">${company || '—'}</td></tr>
            <tr><td style="padding:8px 12px;background:#f2f6fe;font-weight:700">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #e5eaf2"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding:8px 12px;background:#f2f6fe;font-weight:700">Email</td><td style="padding:8px 12px;border-bottom:1px solid #e5eaf2">${email || '—'}</td></tr>
            <tr><td style="padding:8px 12px;background:#f2f6fe;font-weight:700">Service</td><td style="padding:8px 12px;border-bottom:1px solid #e5eaf2"><strong style="color:#1859d4">${service}</strong></td></tr>
            <tr><td style="padding:8px 12px;background:#f2f6fe;font-weight:700">Message</td><td style="padding:8px 12px">${message || '—'}</td></tr>
          </table>
          <p style="font-family:sans-serif;font-size:13px;color:#718096;margin-top:24px">Sent from nirmalwatertech.com contact form</p>
        `
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
