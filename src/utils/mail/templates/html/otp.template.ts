export function buildOtpEmail(options: { otp: string; year?: number }): string {
  const { otp, year = new Date().getFullYear() } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 480px;
      margin: 40px auto;
      background: #ffffff;
      padding: 28px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      text-align: center;
    }
    .logo {
      font-size: 20px;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 18px;
    }
    h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 12px;
      color: #111827;
    }
    p {
      color: #374151;
      font-size: 14px;
      margin: 8px 0;
    }
    .otp {
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 6px;
      background: #eef2ff;
      color: #1e3a8a;
      padding: 14px 24px;
      border-radius: 8px;
      margin: 22px auto;
      display: inline-block;
      border: 1px solid #c7d2fe;
    }
    .footer {
      font-size: 12px;
      color: #6b7280;
      margin-top: 24px;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <div class="container"> 
    <div class="logo">🔐 Secure Verification</div>
    <h2>Email Verification</h2>
    
    <p>Please use the following One-Time Password (OTP) to verify your email:</p>
    
    <div class="otp">${otp}</div>
    
    <p>This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>
    
    <div class="footer">
      This is an automated message, please do not reply.<br>
      &copy; ${year} All rights reserved.
    </div>
  </div>
</body>
</html>`;
}
