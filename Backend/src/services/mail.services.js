import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({to , subject , html}) => {
  try {
    const response = await resend.emails.send({
      from: "CoWorkingSpace <onboarding@resend.dev>",
      to,
      subject,
      html,
    })
    console.log("Email Sent: ",  response)
  }catch(err){
    console.error("Email sending failed: ", err)
    throw new Error("Emial could not be sent")
  }
}