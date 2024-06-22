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
      return res.status(400).json({
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.members.findMany({
      include: {
        projects: true,
        publication: true,
      },
    });
    return res.status(200).json({ members: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMemberById = async (req: Request, res: Response) => {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: "Id is needed" });
  }
  try {
    const user = await prisma.members.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            members: true,
          },
        },
        publication: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ member: user });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const upDateRegistraion = async (req: Request, res: Response) => {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: "Id is needed" });
  }

  const {
    image,
    stack,
    programminglanguage,
    expetations,
    intrests,
    whatdoyoubringtothetable,
    commetmentlevel,
    portfolio,
    experience,
    mentor,
  }: members = req.body;

  try {
    const user = await prisma.members.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.members.update({
      where: { id },
      data: {
        image: image ? image : "",
        stack: Array.isArray(stack) ? stack : [stack],
        programminglanguage: Array.isArray(programminglanguage)
          ? programminglanguage
          : [programminglanguage],
        whatdoyoubringtothetable: whatdoyoubringtothetable
          ? whatdoyoubringtothetable
          : "",
        expetations: expetations ? expetations : "",
        intrests: intrests ? intrests : "",
        commetmentlevel: commetmentlevel ? commetmentlevel : 2,
        portfolio: portfolio ? portfolio : "",
        experience: experience ? experience : "",
        mentor: mentor ? mentor : false,
      },
    });

    return res.status(200).json({ member: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getPublication = async (req: Request, res: Response) => {
  try {
    const publications = await prisma.publication.findMany({
      include: {
        owner: {
          select: {
            fullName: true,
            image: true,
            preferedName: true,
            id: true,
          },
        },
      },
    });
    return res.status(200).json({ publications });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export {
  Register,
  VerifyOtp,
  getAllUsers,
  getMemberById,
  upDateRegistraion,
  getPublication,
};
