export function buildReceiptEmail(options: {
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}): string {
  const { title, message, buttonText, buttonUrl, footerText } = options;

  return `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color: #4CAF50; text-align: center;">${title}</h2>
      
      <p style="font-size: 16px; color: #333;">
        ${message}
      </p>

      ${
        buttonText && buttonUrl
          ? `
      <div style="text-align: center; margin: 20px 0;">
        <a href="${buttonUrl}" target="_blank" 
          style="background: #4CAF50; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 16px;">
          ${buttonText}
        </a>
      </div>
      `
          : ''
      }

      <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
        ${footerText || 'Thank you for choosing us 💚'}
      </p>
    </div>
  </div>
  `;
}
