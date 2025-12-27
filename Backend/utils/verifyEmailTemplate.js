const verifyEmailTemplate = ({ name, url }) => {
  return `
    <p>Dear ${name},</p>
    <p>Thank you for registering TP.</p>
    <a href="${url}" 
       style="display:inline-block;padding:10px 20px;
              background:blue;color:white;text-decoration:none;
              margin-top:10px;border-radius:5px;">
      Verify Email
    </a>
  `;
};
export default verifyEmailTemplate; 
