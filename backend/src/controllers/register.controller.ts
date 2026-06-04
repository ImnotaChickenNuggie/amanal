import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db.js";
import { AppError } from "../middlewares/error.middleware.js";

const HACKATHON_START = new Date("2026-08-14T09:00:00-06:00");

const VALID_SECTIONS = [
  "manantiales-de-datos",
  "el-gran-acueducto",
  "memorias-del-ahuehuete",
] as const;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "El nombre es requerido").max(120),
    email: z.string().email("Correo electronico invalido").max(255),
    phone: z
      .string()
      .min(10, "El telefono debe tener al menos 10 digitos")
      .max(20)
      .regex(/^[+\d\s()-]+$/, "Formato de telefono invalido"),
    section: z.enum(VALID_SECTIONS, { message: "Track invalido" }),
    message: z.string().min(1, "El manifiesto es requerido").max(500),
  }),
});

export const getByUuidSchema = z.object({
  params: z.object({
    uuid: z.string().uuid("UUID invalido"),
  }),
});

export const searchByEmailSchema = z.object({
  query: z.object({
    email: z.string().email("Correo electronico invalido"),
  }),
});

export async function createRegistration(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, section, message } = req.body;

    const existing = await prisma.registration.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Este correo electronico ya esta registrado", 409);
    }

    const registration = await prisma.registration.create({
      data: { name, email, phone, section, message },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        section: registration.section,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function searchByEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email as string;

    const registration = await prisma.registration.findUnique({ where: { email } });
    if (!registration) {
      throw new AppError("No se encontro un registro con ese correo", 404);
    }

    res.json({
      status: "success",
      data: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        section: registration.section,
        message: registration.message,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRegistration(req: Request, res: Response, next: NextFunction) {
  try {
    const uuid = req.params.uuid as string;

    const registration = await prisma.registration.findUnique({ where: { id: uuid } });
    if (!registration) {
      throw new AppError("Registro no encontrado", 404);
    }

    const now = new Date();
    const diff = HACKATHON_START.getTime() - now.getTime();
    const countdown = {
      started: diff <= 0,
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      minutes: Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))),
    };

    res.json({
      status: "success",
      data: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        section: registration.section,
        message: registration.message,
        registeredAt: registration.createdAt,
        hackathon: {
          name: "AMANAL // 2026",
          location: "Complejo Cultural de Los Pinos, Seccion I",
          date: "14 al 16 de Agosto, 2026",
          countdown,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
