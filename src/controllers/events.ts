import { Request, Response } from "express";
import prisma from "../utils/prisma";

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.events.findMany();
    return res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getEventById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);

  if (!id) {
    return res.status(400).json({ message: "Id is needed" });
  }

  try {
    const event = await prisma.events.findUnique({
      where: { id: id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllEvents, getEventById };
