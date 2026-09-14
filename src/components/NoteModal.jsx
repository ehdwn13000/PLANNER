import { useState } from "react";

export default function NoteModal({ project, onSave, onClose }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(project.note || "");

  function handleSave() {
    onSave(text.trim());
    setEditing(false);
  }

  function handleCancelEdit() {
    setText(project.note || "");
    setEditing(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{project.name} 메모</h3>
          <button type="button" className="icon-btn" title="닫기" onClick={onClose}>
            ✕
          </button>
        </div>
        {editing ? (
          <>
            <textarea
              className="modal-textarea"
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="이 프로젝트에서 기억해야 할 것들을 적어두세요..."
            />
            <div className="modal-actions">
              <button type="button" onClick={handleSave}>
                저장
              </button>
              <button type="button" onClick={handleCancelEdit}>
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="modal-note-text">
              {project.note ? project.note : <span className="empty-hint">메모가 없습니다.</span>}
            </p>
            <div className="modal-actions">
              <button type="button" onClick={() => setEditing(true)}>
                수정
              </button>
              <button type="button" onClick={onClose}>
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
