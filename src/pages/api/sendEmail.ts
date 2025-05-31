/*import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  if (!to || !subject || !html) {
    return NextResponse.json({ message: "Campos incompletos" }, { status: 400 });
  }

  try {
    await sgMail.send({
      to,
      from: "tu-correo-verificado@polleriasabrosito.com",
      subject,
      html,
    });

    return NextResponse.json({ message: "Correo enviado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error enviando correo" }, { status: 500 });
  }
}
*/