import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import {
  fetchNotes,
  deleteNote,
  createNote,
  type CreateNoteData,
  type FetchNotesResponse,
} from "../types/noteService";
import NoteList from "./NoteList";
import Modal from "./Modal";
import NoteForm from "./NoteForm";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";

import css from "./App.module.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage: 12, search: searchQuery }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: (newNote: CreateNoteData) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModal();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const debouncedSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 500);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageClick}
            forcePage={currentPage - 1}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <div className={css.status}>Loading...</div>}
      {isError && (
        <div className={css.status} style={{ color: "red" }}>
          Error: {error?.message || "Something went wrong fetching notes."}
        </div>
      )}
      {!isLoading && !isError && notes.length === 0 && (
        <div className={css.status}>
          No notes found. Create your first note!
        </div>
      )}

      {notes.length > 0 && (
        <NoteList notes={notes} onDelete={deleteNoteMutation.mutate} />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onSubmit={createNoteMutation.mutate}
            onCancel={closeModal}
            isLoading={createNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
