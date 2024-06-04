import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { members } from "@prisma/client";
import { generateNumericOTP, getCapitalizedFullName } from "../utils";
import { Sendmail } from "../utils/mailer";
import { compilerwelcome } from "../compiler";

const Register = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    bio,
    address,
    whatsappnumber,
    image,
    preferedName,
  }: members = req.body;
  if (!fullName || !email || !bio || !address) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const member = await prisma.members.findFirst({
      where: {
        OR: [{ email }, { preferedName }],
      },
    });
    if (member) {
      return res
        .status(400)
        .json({
          message:
            "Member with this email and PreferedName already already exists",
        });
    }
    const capitalizedFirstName = getCapitalizedFullName(fullName);
    const otp = generateNumericOTP(6);
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    const newmember = await prisma.members.create({
      data: {
        fullName,
        email,
        bio,
        address,
        whatsappnumber,
        preferedName: preferedName ? preferedName : "",
        image: image ? image : "",
        otp,
        otpExpires,
      },
    });

    await Sendmail({
      from: `STARTERSHOUSE <support@startershouse.com>`,
      to: email,
      subject: "OTP VERIFICATION",
      html: compilerwelcome(capitalizedFirstName, parseInt(otp)),
    });
    return res
      .status(201)
      .json({ message: "Member added successfully", data: newmember });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const VerifyOtp = async (req: Request, res: Response) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const user = await prisma.members.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.members.update({
      where: { id: userId },
      data: {
        otp: null,
        otpExpires: null,
        verified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Your account is now active.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { Register, VerifyOtp };
