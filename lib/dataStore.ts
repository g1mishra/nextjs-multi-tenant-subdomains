import { Client } from "@/app/type";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "clients.json");

export async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

export async function writeData(data: Client[]) {
  const dirPath = path.dirname(DATA_FILE);
  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}
