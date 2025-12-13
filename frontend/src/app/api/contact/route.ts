import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create transporter - using Gmail SMTP
    // Requires SMTP_USER and SMTP_PASS environment variables
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error('SMTP credentials not configured');
      console.error('SMTP_USER:', smtpUser ? 'Set' : 'Not set');
      console.error('SMTP_PASS:', smtpPass ? 'Set' : 'Not set');
      return NextResponse.json(
        { 
          error: 'Email service not configured. Please set SMTP_USER and SMTP_PASS environment variables in .env.local file.',
          details: 'Create a .env.local file in the frontend directory with SMTP_USER and SMTP_PASS variables.'
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email content
    const mailOptions = {
      from: smtpUser,
      to: 'tamaramakrtchyan78@gmail.com',
      subject: subject || `Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from the HI.BIONIC.HAND contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${subject ? `Subject: ${subject}` : ''}

Message:
${message}
      `,
    };

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (verifyError: any) {
      console.error('SMTP verification failed:', verifyError);
      throw new Error(`SMTP configuration error: ${verifyError.message}`);
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH' || error.message?.includes('Invalid login') || error.message?.includes('BadCredentials')) {
      errorMessage = 'Gmail authentication failed. Please ensure:\n1. You are using a Gmail App Password (not your regular password)\n2. 2-Factor Authentication is enabled on your Google account\n3. Generate a new App Password at: https://myaccount.google.com/apppasswords\n4. Use the 16-character App Password in SMTP_PASS';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

