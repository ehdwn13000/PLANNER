import { useState } from "react";
import { isOverdue } from "../utils/date";
import { confirmDelete } from "../utils/confirm";

export default function ItemRow({ item, context, onUpdate, onComplete, onDelete }) {
  const [name, setName] = useState(item.name);
  const overdue = isOverdue(item.dueDate) && !item.completed;

  function commitName() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== item.name) onUpdate(item.id, { name: trimmed });
    else setName(item.name);
  }

  return (
    <div className={overdue ? "item-row overdue" : "item-row"}>
      {context && <div className="item-context">{context}</div>}
      <div className="item-row-main">
        <input type="checkbox" checked={item.completed} onChange={() => onComplete(item.id)} />
        <input
          className="item-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
        />
        <input
          type="date"
          className="item-date"
          value={item.dueDate || ""}
          onChange={(e) => onUpdate(item.id, { dueDate: e.target.value || null })}
        />
        <select
          className={`priority priority-${item.priority}`}
          value={item.priority}
          onChange={(e) => onUpdate(item.id, { priority: e.target.value })}
        >
          <option value="상">상</option>
          <option value="중">중</option>
          <option value="하">하</option>
        </select>
        <button type="button" className="icon-btn" title="삭제" onClick={() => confirmDelete() && onDelete(item.id)}>
          ✕
        </button>
      </div>
    </div>
  );
}
