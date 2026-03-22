import axios, { type AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const apiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };
  if (search) {
    params.search = search;
  }

  const response: AxiosResponse<FetchNotesResponse> = await apiClient.get(
    "/notes",
    { params },
  );
  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.post(
    "/notes",
    noteData,
  );
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.delete(
    `/notes/${noteId}`,
  );
  return response.data;
};
