
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const logFile = path.resolve('bitbloom-backend/logs/purchases.json');
const promptsDir = path.resolve('bitbloom-backend/prompts');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const handlePromptPurchase = (req, res) => {
  const { title, userEmail } = req.body;

  const purchaseLog = {
    title,
    userEmail,
    btcAmount: 0.00001,
    timestamp: new Date().toISOString()
  };

  fs.appendFileSync(logFile, JSON.stringify(purchaseLog) + ',\n');

  const promptFile = path.join(promptsDir, `${title}.pdf`);
  if (!fs.existsSync(promptFile)) {
    return res.status(404).json({ message: 'Prompt file not found' });
  }

  transporter.sendMail({
    from: '"BitBloom" <noreply@bitbloom.com>',
    to: userEmail,
    subject: `Your BitBloom Prompt: ${title}`,
    text: `🌸 Thank you for supporting BitBloom!\n\nAttached is your prompt: ${title}`,
    attachments: [
      {
        filename: `${title}.pdf`,
        path: promptFile
      }
    ]
  }, (err, info) => {
    if (err) {
      console.error('Email failed:', err);
      return res.status(500).json({ message: 'Failed to send prompt email' });
    }
    res.status(200).json({ message: 'Prompt sent via email' });
  });
};
