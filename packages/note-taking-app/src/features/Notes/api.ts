import { Note } from './types';

const notes: Note[] = [];

export async function getNotes(): Promise<Note[]> {
  return notes;
}

export async function getNote(id: number): Promise<Note> {
  return notes[id];
}

export async function createNote(body: string): Promise<Note> {
  const note = { id: notes.length, body };

  notes.push(note);

  return note;
}

export async function saveNote(note: Note): Promise<Note> {
  notes[note.id] = note;

  return note;
}
