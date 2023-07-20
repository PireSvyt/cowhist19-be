const serviceSendMail = require("./serviceSentMail");
const mails = require("./mails.json");

module.exports = async function serviceMailing(mail, details = {}) {
  /*
    
    service sending email
    
    input
    * mail : String capturing email to be sent (signup, reset, invited...)
    * details : Object including relevant details for email to be included

    possible response types
    * mail.mailing.success
    * mail.mailing.error.onsend
    * mail.mailing.error.nomailtosend
    
    */

  console.log("mail.mailing");

  const lang = "en";

  return new Promise((resolve, reject) => {
    // Prep email
    let mailToSend = null;
    let replacements = [];
    switch (mail) {
      case "signup":
        replacements = [
          { token: "{{PSEUDO}}", value: details.pseudo },
          {
            token: "{{ACTIVATION_URL}}",
            value:
              "https://cowhist19.vercel.app/activation/" +
              details.activationtoken,
          },
        ];
        mailToSend = {
          to: details.login,
          subject: mails.signup[lang].subject,
          text: replaceTokens(mails.signup[lang].text, replacements),
          html: replaceTokens(mails.signup[lang].html, replacements),
        };
        break;
      case "resetpassword":
        replacements = [
          { token: "{{PSEUDO}}", value: details.pseudo },
          {
            token: "{{PASSWORD_RESET_URL}}",
            value:
              "https://cowhist19.vercel.app/passwordreset/" +
              details.passwordresettoken,
          },
        ];
        mailToSend = {
          to: details.login,
          subject: mails.signup[lang].subject,
          text: replaceTokens(mails.signup[lang].text, replacements),
          html: replaceTokens(mails.signup[lang].html, replacements),
        };
        break;
      default:
        // mail not found
        break;
    }
    // Send email
    if (mailToSend) {
      serviceSendMail(mailToSend).then((outcome) => {
        if (outcome.type === "mail.sentmail.success") {
          resolve({
            type: "mail.mailing.success",
          });
        } else {
          resolve({
            type: "mail.mailing.error.onsend",
            error: outcome.error,
          });
        }
      });
    } else {
      resolve({
        type: "mail.mailing.error.nomailtosend",
      });
    }
  });
};

function replaceTokens(text, tokenList) {
  let replacedText = text;
  if (replacedText) {
    tokenList.forEach((replacement) => {
      replacedText = replacedText.replace(replacement.token, replacement.value);
    });
  }
  return replacedText;
}
