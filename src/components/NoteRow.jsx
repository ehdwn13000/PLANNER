import { isOverdue } from "../utils/date";
import { confirmDelete } from "../utils/confirm";

export default function NoteRow({ note, onUpdate, onToggle, onDelete, showTag = true }) {
  const overdue = isOverdue(note.dueDate) && !note.completed;

  return (
    <div className={overdue ? "note-row overdue" : "note-row"}>
      <label className="checkbox-circle">
        <input type="checkbox" checked={note.completed} onChange={() => onToggle(note.id)} />
        <span className="checkbox-face" />
      </label>
      {showTag && <span className="note-tag">{note.tag}</span>}
      <span className={note.completed ? "note-text done" : "note-text"}>{note.text}</span>
      <input
        type="date"
        className="item-date"
        value={note.dueDate || ""}
        onChange={(e) => onUpdate(note.id, { dueDate: e.target.value || null })}
      />
      <button type="button" className="icon-btn" title="삭제" onClick={() => confirmDelete() && onDelete(note.id)}>
        ✕
      </button>
    </div>
  );
}
