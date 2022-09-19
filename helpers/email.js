import nodemailer from 'nodemailer';

export const emailShipping = async data => {
  const { email, fullName, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email template
  const info = await transport.sendMail({
    from: 'UpTask - Project Management - <account@uptask.com>',
    to: email,
    subject: 'UpTask - Confirm your account',
    text: 'Confirm your account in UpTask and start handling your projects!',
    html: `
          <p>Hello: ${fullName}, just one step to confirm your account</p>
          
          <p>An account was created with your email, just confirm it with the link below and start creating and managing your projects: </p> 

          <a href="${process.env.FRONTEND_URL}/confirm-account/${token}"}>Confirm here right now!</a>

          <p>If you don't create this, just ignore it!</p>
        `
  });
};

export const emailForgotPass = async data => {
  const { email, fullName, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email template
  const info = await transport.sendMail({
    from: 'UpTask - Project Management - <account@uptask.com>',
    to: email,
    subject: 'UpTask - Reset your password',
    text: 'Reset your password in UpTask and recover your projects!',
    html: `
          <p>Hello: ${fullName}, just one step to reset your password</p>
          
          <p>You have requested a change on your password, to follow up click on the link below:</p> 

          <a href="${process.env.FRONTEND_URL}/forgotten-password/${token}"}>Confirm here right now!</a>

          <p>If you did not request this, just ignore it!</p>
        `
  });
};