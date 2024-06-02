import handlebars from "handlebars";
import { welcome } from "../email/index";

function compilerwelcome(name: string, otp_code: number) {
  const template = handlebars.compile(welcome);
  const htmlBody = template({
    name: name,
    otp_code: otp_code,
  });
  return htmlBody;
}

export { compilerwelcome };
