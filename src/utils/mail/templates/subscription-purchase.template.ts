export const subscriptionPurchaseTemplate = (
  email: string,
  subscription: any,
  invoice: any,
  startDate: Date,
  endDate: Date,
  invoiceUrl: string,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Subscription Payment Success</title>
      <style>
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #111111; /* match your site header */
          color: #ffffff;
          text-align: center;
          padding: 20px;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
          color: #333333;
          line-height: 1.6;
        }
        .content h2 {
          color: #111111;
          margin-bottom: 10px;
        }
        .button {
          display: inline-block;
          margin: 20px 0;
          padding: 12px 25px;
          background-color: #ff6b6b; /* accent color similar to website */
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          PriveeEstate
        </div>
        <div class="content">
          <h2>Hi ${email || 'User'},</h2>
          <p>We are thrilled to inform you that your subscription has been successfully renewed.</p>
          <ul>
            <li><strong>Plan:</strong> ${subscription.items.data[0]?.price?.id || 'Unknown Plan'}</li>
            <li><strong>Amount Paid:</strong> $${(invoice.amount_paid / 100).toFixed(2)}</li>
            <li><strong>Start Date:</strong> ${startDate.toDateString()}</li>
            <li><strong>Expiry Date:</strong> ${endDate.toDateString()}</li>
          </ul>
          <p>You can view your invoice by clicking the button below:</p>
          <a href="${invoiceUrl}" class="button">View Invoice</a>
          <p>Thank you for staying with us! If you have any questions, feel free to reply to this email or contact our support team.</p>
          <p>Best regards,<br><strong>PriveeEstate Team</strong></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} PriveeEstate. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;
};
