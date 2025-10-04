// export function buildOtpEmail(options: { otp: string; year?: number }): string {
//   const { otp, year = new Date().getFullYear() } = options;

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Email Verification</title>
//   <style>
//     body {
//       font-family: 'Segoe UI', Arial, sans-serif;
//       background: linear-gradient(135deg, #eef2ff, #f8fafc);
//       margin: 0;
//       padding: 0;
//       color: #1f2937;
//     }

//     .container {
//       max-width: 480px;
//       margin: 60px auto;
//       background: #ffffff;
//       border-radius: 16px;
//       padding: 40px 30px;
//       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
//       text-align: center;
//     }

//     .header {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       margin-bottom: 24px;
//     }

//     .logo {
//       background: linear-gradient(135deg, #2563eb, #4f46e5);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       font-size: 24px;
//       font-weight: 700;
//       letter-spacing: 0.5px;
//     }

//     h2 {
//       font-size: 22px;
//       font-weight: 700;
//       color: #111827;
//       margin: 10px 0 16px;
//     }

//     p {
//       font-size: 15px;
//       color: #4b5563;
//       line-height: 1.6;
//       margin: 6px 0;
//     }

//     .otp-box {
//       background: linear-gradient(135deg, #eef2ff, #e0e7ff);
//       border: 1px solid #c7d2fe;
//       border-radius: 12px;
//       padding: 18px 0;
//       margin: 28px auto;
//       width: 220px;
//       font-size: 32px;
//       font-weight: 800;
//       letter-spacing: 8px;
//       color: #1e3a8a;
//       box-shadow: inset 0 0 10px rgba(79, 70, 229, 0.1);
//     }

//     .info {
//       font-size: 14px;
//       color: #374151;
//       background: #f3f4f6;
//       padding: 10px 16px;
//       border-radius: 8px;
//       display: inline-block;
//       margin-top: 8px;
//     }

//     .footer {
//       font-size: 12px;
//       color: #9ca3af;
//       margin-top: 36px;
//       padding-top: 16px;
//       border-top: 1px solid #e5e7eb;
//       line-height: 1.5;
//     }

//     .footer b {
//       color: #6b7280;
//     }

//     @media (max-width: 500px) {
//       .container {
//         margin: 30px 16px;
//         padding: 32px 20px;
//       }
//       .otp-box {
//         width: 180px;
//         font-size: 28px;
//         letter-spacing: 6px;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="container">


//     <h2>Verify Your Email Address</h2>
//     <p>Use the following One-Time Password (OTP) to complete your verification:</p>

//     <div class="otp-box">${otp}</div>

//     <p class="info">This OTP will expire in <b>5 minutes</b>. Please do not share it with anyone.</p>

//     <div class="footer">
//       This is an automated message — please do not reply.<br>
//       &copy; ${year} <b>Your Company</b>. All rights reserved.
//     </div>
//   </div>
// </body>
// </html>`;
// }



export function buildOtpEmail(options: {
  otp: string;
  year?: number;
  companyName?: string;
  brandColor?: string;
}): string {
  const {
    otp,
    year = new Date().getFullYear(),
    companyName = "Privé Estates",
    brandColor = "#2563eb" // Azul principal (puedes cambiarlo a tu color)
  } = options;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Verificación de Correo</title>

  <style>
    :root {
      --brand: ${brandColor};
      --accent: #f59e0b; /* dorado elegante */
      --text-dark: #111827;
      --text-light: #6b7280;
      --bg-light: #f9fafb;
    }

    body {
      font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg-accent);
      color: var(--text-dark);
      margin: 0;
      padding: 40px 16px;
    }

    .container {
      max-width: 560px;
      margin: 0 auto;
      background: #fff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      animation: fadeIn 0.8s ease-out;
    }

    .header {
      background: linear-gradient(135deg, var(--brand), #1e40af);
      color: #fff;
      padding: 36px 24px;
      text-align: center;
    }

    .logo {
    color: #f59e0b;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 0px 28px 40px 28px;
      text-align: center;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .subtitle {
      font-size: 15px;
      color: var(--text-light);
      margin-bottom: 32px;
    }

    .otp-box {
      background: linear-gradient(145deg, #eff6ff, #e0e7ff);
      border: 1px solid #c7d2fe;
      border-radius: 10px;
      padding: 22px 16px;
      display: inline-block;
      margin-bottom: 28px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .otp-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--brand);
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .otp-code {
      font-family: "Courier New", monospace;
      font-size: 34px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #1e3a8a;
    }

    .info {
      background: #fff7ed;
      border-left: 4px solid var(--accent);
      border-radius: 6px;
      padding: 12px 16px;
      text-align: left;
      margin: 20px 0;
    }

    .info p {
      font-size: 14px;
      color: #92400e;
      margin: 0;
    }

    .tips {
      margin: 28px 0;
      text-align: left;
    }

    .tips h3 {
      font-size: 15px;
      margin-bottom: 10px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .tips ul {
      margin: 0;
      padding-left: 18px;
    }

    .tips li {
      font-size: 14px;
      color: var(--text-light);
      margin: 6px 0;
    }

    .footer {
      background: var(--bg-light);
      border-top: 1px solid #e5e7eb;
      padding: 18px 20px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }

    .footer strong {
      color: var(--text-dark);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>

<body bgcolor="#f9fafb" style="background-color:#f9fafb; margin:0; padding:40px 16px; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#111827;">
   <div class="container" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.06);">
    <div class="header">
      <div class="logo">${companyName}</div>
    </div>

    <div class="content">
      <h1>Verificación de Correo</h1>
      <p class="subtitle">Introduce el siguiente código para completar la verificación de tu cuenta.</p>

      <div class="otp-box">
        <div class="otp-label">Código de verificación</div>
        <div class="otp-code">${otp}</div>
      </div>

      <div class="info">
        <p>⏳ <strong>Expira en 5 minutos.</strong> Mantén este código confidencial y no lo compartas.</p>
      </div>

      <div class="tips">
        <h3>🔒 Consejos de seguridad</h3>
        <ul>
          <li>No compartas este código con nadie, ni siquiera con el personal de ${companyName}.</li>
          <li>Nunca solicitaremos tu código por teléfono, chat o correo.</li>
          <li>Si no solicitaste este código, puedes ignorar este mensaje.</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      &copy; ${year} <strong>${companyName}</strong>. Todos los derechos reservados.<br/>
      Este es un mensaje automático — no respondas a este correo.
    </div>
  </div>
</body>
</html>`;
}