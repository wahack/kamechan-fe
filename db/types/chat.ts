import { Message } from "ai";

export type Chat = {
  id: string;
  messages: Message[];
  tagline: string | null;
  userId: string;
};
