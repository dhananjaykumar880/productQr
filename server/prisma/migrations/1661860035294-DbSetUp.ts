import {
  addYears,
  format,
  subYears,
  setMonth,
  setDate,
  setHours,
} from 'date-fns';
import { Migration } from '../cli/migration';
import { PrismaClient } from "@prisma/client";

export default class implements Migration {
  async up(prisma: PrismaClient) {
    try {
      await prisma.$queryRaw`CREATE TABLE "Products" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "product" TEXT NOT NULL,
        "quality" TEXT,
        "design" TEXT,
        "color" TEXT,
        "scale" TEXT,
        "materials" TEXT,
        "image" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      await prisma.$queryRaw`CREATE INDEX "Products_product_materials_idx" ON "Products"("product", "materials")`;
    } catch (e) {
      console.error(e);
    }
  }

  async down(prisma: PrismaClient) {
    await prisma.$queryRaw`DROP INDEX "Products_product_materials_idx"`;
    await prisma.$queryRaw`DROP TABLE "Products"`;
  }
}
