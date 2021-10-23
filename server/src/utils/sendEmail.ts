import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "j4yu4zb2i5alwdxo@ethereal.email", // generated ethereal user
      pass: "AqNeAcUCBE3NNVj9Wr", // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Lireddit Service" <service@lireddit.com>', // sender address
    to: to, // list of receivers
    subject: "Change Password", // Subject line
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
