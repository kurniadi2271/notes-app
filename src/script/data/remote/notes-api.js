const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static _handleResponse(fetchPromise) {
    return fetchPromise
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`${response.status} : ${response.statusText}`);
      })
      .catch((error) => {
        return { error: true, message: error.message };
      });
  }

  static inputNotes(title, body) {
    
    const fetchPromise = fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    return NotesApi._handleResponse(fetchPromise);
  }

  static getAll() {
    return NotesApi._handleResponse(fetch(`${BASE_URL}/notes`));
  }

  static getArchived() {
    return NotesApi._handleResponse(fetch(`${BASE_URL}/notes/archived`));
  }

  static archiveNote(note_id) {
    const fetchPromise = fetch(`${BASE_URL}/notes/${note_id}/archive`, {
      method: "POST", 
    });

    return NotesApi._handleResponse(fetchPromise);
  }

  static unarchiveNote(note_id) {
    const fetchPromise = fetch(`${BASE_URL}/notes/${note_id}/unarchive`, {
      method: "POST", 
    });

    return NotesApi._handleResponse(fetchPromise);
  }

  static deleteNote(note_id) {
    const fetchPromise = fetch(`${BASE_URL}/notes/${note_id}`, {
      method: "DELETE",
    });

    return NotesApi._handleResponse(fetchPromise);
  }
}

export default NotesApi;
