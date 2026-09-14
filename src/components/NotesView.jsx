import { useState } from "react";
import { usePlanner } from "../context/PlannerContext";
import NoteRow from "./NoteRow";

function AddNoteForm({ tag, onAdd }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), tag, dueDate || null);
    setText("");
    setDueDate("");
  }

  return (
    <form className="add-note-form" onSubmit={submit}>
      <input placeholder="빠르게 적어두기..." value={text} onChange={(e) => setText(e.target.value)} />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit">추가</button>
    </form>
  );
}

export default function NotesView() {
  const planner = usePlanner();
  const personalNotes = planner.data.quickNotes.filter((n) => n.tag === "개인");
  const workNotes = planner.data.quickNotes.filter((n) => n.tag === "업무");

  return (
    <div className="notes-view">
      <section className="notes-section">
        <h2>개인</h2>
        <AddNoteForm tag="개인" onAdd={planner.addQuickNote} />
        <div className="note-list">
          {personalNotes.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
              showTag={false}
              onUpdate={planner.updateQuickNote}
              onToggle={planner.toggleQuickNote}
              onDelete={planner.deleteQuickNote}
            />
          ))}
          {personalNotes.length === 0 && <p className="empty-hint">항목이 없습니다.</p>}
        </div>
      </section>
      <section className="notes-section">
        <h2>업무(기타)</h2>
        <AddNoteForm tag="업무" onAdd={planner.addQuickNote} />
        <div className="note-list">
          {workNotes.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
              showTag={false}
              onUpdate={planner.updateQuickNote}
              onToggle={planner.toggleQuickNote}
              onDelete={planner.deleteQuickNote}
            />
          ))}
          {workNotes.length === 0 && <p className="empty-hint">항목이 없습니다.</p>}
        </div>
      </section>
    </div>
  );
}
