import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // Check for Resend API key (no password needed!)
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        { 
          error: 'Email service not configured. Please set RESEND_API_KEY in .env.local file.',
          details: 'Get your free API key at https://resend.com/api-keys (no password needed!)'
        },
        { status: 500 }
      );
    }

    // Send email using Resend SDK
    try {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: 'onboarding@resend.dev', // You can change this after verifying your domain
        to: 'alisamkrtchyan91@gmail.com', // Temporary test email
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
      });

      console.log('Email sent successfully to delivered@resend.dev');

      return NextResponse.json(
        { 
          message: 'Your message has been sent successfully. We will get back to you soon.',
          emailSent: true
        },
        { status: 200 }
      );
    } catch (emailErr: any) {
      console.error('Error sending email:', emailErr);
      
      return NextResponse.json(
        { 
          error: emailErr.message || 'Failed to send email. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? emailErr.message : undefined
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process contact form submission',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

