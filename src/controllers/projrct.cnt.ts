import { Request, Response } from "express";
import prisma from "../utils/prisma";

const GetAllPrroject = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        members: true,
      },
    });
    return res.status(200).json({ projects: projects });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProjectbyId = async (req: Request, res: Response) => {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: "Id is needed" });
  }
  try {
    const user = await prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
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

export { GetAllPrroject, getProjectbyId };
