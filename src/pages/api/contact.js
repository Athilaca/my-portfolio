import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, message } = req.body;
    

    // Create a transporter object using your email service
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // E.g., for Gmail, use 'smtp.gmail.com'
      port: 587,
      secure: false, // True for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email username (use environment variables for security)
        pass: process.env.EMAIL_PASSWORD, // Your email password (use environment variables for security)
      },
    });
  

    // Set up email data
    const mailOptions = {
      from: 'athilaca2002@gmail.com>', // Sender address
      to: 'athilaca26@gmail.com', // List of recipients
      subject: 'Form Submission from portfolio', // Subject line
      text: `You have a new contact form submission.

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}`,
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' }); // Handle methods other than POST
  }
}
