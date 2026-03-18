import 'dotenv/config';
import { sendEmail } from './utils/emailService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing email configuration...');
console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);

const testEmail = async () => {
    console.log('Attempting to send test email...');
    const result = await sendEmail({
        email: process.env.SMTP_USER, // Send to self
        subject: 'Test Email from Debugger',
        html: '<p>This is a test email to verify credentials.</p>'
    });

    console.log('Result:', result);
};

testEmail();
