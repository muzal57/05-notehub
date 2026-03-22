export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: NoteTag;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
