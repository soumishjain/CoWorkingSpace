import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({to , subject , html}) => {
  console.log("API KEY: " , process.env.RESEND_API_KEY)
  try {
    const response = await resend.emails.send({
      from: "CoWorkingSpace <onboarding@resend.dev>",
      to,
      subject,
      html,
    })
    console.log("Email Sent: ",  JSON.stringify(response, null , 2))
  }catch(err){
    console.error("Email sending failed: ", err)
    throw new Error("Email could not be sent")
  }
}