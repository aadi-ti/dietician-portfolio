const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const { name, email } = JSON.parse(event.body);

    if (!email || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing name or email." }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or your SMTP provider
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Dt. Nirmala Joshi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Form Confirmation | HPlus Foundation",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for submitting your form. Please Book Your consultation slot from the link below.</p>
        <p>https://calendly.com/nirmala-joshi30/30min</p>
        <p>Hope to hear from you soon!</p>
        <p>Warm regards,<br/>Dt. Nirmala Joshi<br/>HPlus Foundation</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
