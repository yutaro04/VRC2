import { prisma } from "@/lib/prisma";

/**
 * すべてのデバイスを取得
 */
export async function getAllDevices() {
  return await prisma.device.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      id: 'asc',
    },
  });
}

/**
 * IDでデバイスを取得
 */
export async function getDeviceById(id: number) {
  return await prisma.device.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}
