import { Sender } from "./SenderType";

export type Email = {
  id: string;
  subject: string;
  sender: Sender;
};
