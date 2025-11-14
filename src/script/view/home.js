import Utils from "../utils.js";
import NotesApi from "../data/remote/notes-api.js";

const home = () => {
  const inputControlContainer = document.querySelector(
    "#input-control-container",
  );
  const loadingIndicator = document.querySelector("loading-indicator");
  const noteListElement = document.querySelector("note-list");
  const inputBarElement = document.querySelector("input-bar");

  const setLoading = (isLoading) => {
    const inputBar = inputControlContainer.querySelector('input-bar');

    if (isLoading) {
        Utils.hideElement(inputBar);
        Utils.showElement(loadingIndicator);

        inputBarElement.setAttribute('disabled', 'true'); 
    } else {
        Utils.showElement(inputBar);
        Utils.hideElement(loadingIndicator);
        
        inputBarElement.removeAttribute('disabled');
    }
};

  const renderNotes = (data) => {
    noteListElement.textContent = "";

    if (data.length === 0) {
      noteListElement.innerHTML =
        '<p class="text-center text-gray-500">No notes found. Start creating one! 📝</p>';
      return;
    }

    const fragment = document.createDocumentFragment();

    data.forEach((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.setAttribute("data-id", note.id);
      noteItemElement.note = note;
      fragment.appendChild(noteItemElement);
    });

    noteListElement.appendChild(fragment);
  };

  const loadAndRenderNotes = async (apiMethod) => {
    setLoading(true);
    const response = await apiMethod();

    if (!response.error) {
      renderNotes(response.data);
    } else {
      console.error("Failed to load notes:", response.message);
      noteListElement.innerHTML = `<p class="text-center text-red-500">Error loading notes: ${response.message}</p>`;
    }

    setLoading(false);
  };

  const loadNotes = () => loadAndRenderNotes(NotesApi.getAll);
  const loadArchivedNotes = () => loadAndRenderNotes(NotesApi.getArchived);

  const loadAllNotes = async () => {
    setLoading(true);
    const [activeResponse, archivedResponse] = await Promise.all([
      NotesApi.getAll(),
      NotesApi.getArchived(),
    ]);

    if (!activeResponse.error && !archivedResponse.error) {
      const allNotes = [...activeResponse.data, ...archivedResponse.data];

      allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      renderNotes(allNotes);
    } else {
      const errorMessage = activeResponse.error
        ? activeResponse.message
        : archivedResponse.message;
      console.error("Failed to load all notes:", errorMessage);
      noteListElement.innerHTML = `<p class="text-center text-red-500">Error loading notes: ${errorMessage}</p>`;
    }

    setLoading(false);
  };
  const onInputSubmit = async (event) => {
    const { title, body } = event.detail;

    setLoading(true);
    const inputResponse = await NotesApi.inputNotes(title, body);
    setLoading(false);

    if (inputResponse.error) {
      alert(`Failed to add note: ${inputResponse.message}`);
      return;
    }

    await loadNotes();
  };

  const handleNoteAction = async (event, apiMethod, actionName) => {
    const { id } = event.detail;

    setLoading(true);
    const response = await apiMethod(id);
    setLoading(false);

    if (!response.error) {
      await loadNotes();
    } else {
      alert(`Failed to ${actionName} note: ${response.message}`);
    }
  };

  const onArchiveNote = (event) =>
    handleNoteAction(event, NotesApi.archiveNote, "archive");
  const onUnarchiveNote = (event) =>
    handleNoteAction(event, NotesApi.unarchiveNote, "unarchive");

  const onDeleteNote = async (event) => {
    const { id } = event.detail;
    if (!confirm("Are you sure you want to delete this note permanently? 🗑️")) {
      return;
    }

    setLoading(true);
    const response = await NotesApi.deleteNote(id);
    setLoading(false);

    if (!response.error) {
      await loadNotes();
    } else {
      alert(`Failed to delete note: ${response.message}`);
    }
  };

  loadNotes();
  inputBarElement.addEventListener("input-bar", onInputSubmit);
  noteListElement.addEventListener("archive-note", onArchiveNote);
  noteListElement.addEventListener("unarchive-note", onUnarchiveNote);
  noteListElement.addEventListener("delete-note", onDeleteNote);

  return { loadNotes, loadArchivedNotes, loadAllNotes };
};

export default home;
