import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text, smtpConfig, senderName, senderEmail } = body;

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and html or text' },
        { status: 400 }
      );
    }

    if (!smtpConfig?.host || !smtpConfig?.port || !smtpConfig?.username || !smtpConfig?.password) {
      return NextResponse.json(
        { error: 'SMTP configuration incomplete. Please check your email settings.' },
        { status: 400 }
      );
    }

    // Create transporter based on encryption type
    const isSSL = smtpConfig.port === 465 || smtpConfig.encryption === 'ssl';
    
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: isSSL, // true for port 465, false for 587
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
      // For STARTTLS on port 587
      ...(isSSL ? {} : { 
        requireTLS: true,
        tls: { rejectUnauthorized: false }
      }),
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection
    try {
      await transporter.verify();
    } catch (verifyError: unknown) {
      const errMsg = verifyError instanceof Error ? verifyError.message : 'Unknown error';
      console.error('SMTP verification failed:', errMsg);
      return NextResponse.json(
        { 
          error: `Could not connect to email server: ${errMsg}`,
          code: 'CONNECTION_FAILED'
        },
        { status: 401 }
      );
    }

    // Send email
    const fromAddress = senderName 
      ? `"${senderName}" <${senderEmail || smtpConfig.username}>`
      : senderEmail || smtpConfig.username;

    const result = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html: html || undefined,
      text: text || undefined,
    });

    await transporter.close();

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully',
    });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email send error:', errMsg);
    
    // Give user-friendly error messages
    let userMessage = errMsg;
    if (errMsg.includes('EAUTH') || errMsg.includes('authentication')) {
      userMessage = 'Authentication failed. Check your email and password. For Gmail, you may need an App Password.';
    } else if (errMsg.includes('ECONNECTION') || errMsg.includes('ETIMEDOUT')) {
      userMessage = 'Could not connect to the email server. Check your SMTP host and port settings.';
    } else if (errMsg.includes('ENOTFOUND')) {
      userMessage = 'Email server not found. Check the SMTP host address.';
    }

    return NextResponse.json(
      { error: userMessage, code: 'SEND_FAILED' },
      { status: 500 }
    );
  }
}