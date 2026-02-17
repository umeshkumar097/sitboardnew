import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL || '"SiteBoard" <noreply@siteboard.in>',
            to,
            subject,
            html,
        });
        console.log(`Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}

export const emailTemplates = {
    newLeadAdmin: (lead: any) => `
    <h2>New Lead Received on SiteBoard</h2>
    <p>You have a receiver a new lead submission:</p>
    <ul>
      <li><strong>Name:</strong> ${lead.name}</li>
      <li><strong>Company:</strong> ${lead.company_name || 'N/A'}</li>
      <li><strong>City:</strong> ${lead.city || 'N/A'}</li>
      <li><strong>WhatsApp:</strong> ${lead.whatsapp}</li>
      <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin">View in Admin Panel</a></p>
  `,
    launchAnnouncement: (lead: any) => `
    <h2>SiteBoard is Live 🚀</h2>
    <p>Hi ${lead.name},</p>
    <p>We’re excited to inform you that SiteBoard is now live.</p>
    <p>Thank you for registering during our pre-launch. Our team will reach out shortly to discuss how SiteBoard can streamline your project's inventory management.</p>
    <br/>
    <p>Best regards,</p>
    <p>The SiteBoard Team</p>
    <br/>
    <small>Powered by Aiclex Technologies</small>
  `,
    resetPassword: (link: string) => `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your SiteBoard account.</p>
    <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
    <p><a href="${link}">${link}</a></p>
    <p>If you didn't request this, please ignore this email.</p>
    <br/>
    <small>SiteBoard Team</small>
  `
};
