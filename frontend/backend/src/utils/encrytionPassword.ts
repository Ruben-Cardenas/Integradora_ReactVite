import bcrypt from "bcrypt";

export async function encryptionPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function verifyPassword(
  enteredPassword: string,
  savedHash: string
): Promise<boolean> {
  const match = await bcrypt.compare(enteredPassword, savedHash);
  return match;
}
