import { usePlanner } from "../context/PlannerContext";
import { getItemContext } from "../data/selectors";
import { isThisWeek, isNextWeek } from "../utils/date";
import ItemRow from "./ItemRow";
import NoteRow from "./NoteRow";

function ItemList({ items, data, planner }) {
  return items.map((item) => {
    const { categoryName, projectName } = getItemContext(item, data);
    return (
      <ItemRow
        key={item.id}
        item={item}
        context={`${categoryName} > ${projectName}`}
        onUpdate={planner.updateItem}
        onComplete={planner.completeItem}
        onDelete={planner.deleteItem}
      />
    );
  });
}

function NoteList({ notes, planner }) {
  return notes.map((note) => (
    <NoteRow
      key={note.id}
      note={note}
      onUpdate={planner.updateQuickNote}
      onToggle={planner.toggleQuickNote}
      onDelete={planner.deleteQuickNote}
    />
  ));
}

function byDueDate(a, b) {
  return (a.dueDate || "").localeCompare(b.dueDate || "");
}

export default function WeekView() {
  const planner = usePlanner();
  const incompleteItems = planner.data.items.filter((i) => !i.completed);
  const datedNotes = planner.data.quickNotes.filter((n) => !n.completed && n.dueDate);

  const itemsThisWeek = incompleteItems.filter((i) => isThisWeek(i.dueDate)).sort(byDueDate);
  const notesThisWeek = datedNotes.filter((n) => isThisWeek(n.dueDate)).sort(byDueDate);

  const itemsNextWeek = incompleteItems.filter((i) => isNextWeek(i.dueDate)).sort(byDueDate);
  const notesNextWeek = datedNotes.filter((n) => isNextWeek(n.dueDate)).sort(byDueDate);

  const inProgress = incompleteItems.filter((i) => !isThisWeek(i.dueDate) && !isNextWeek(i.dueDate));

  return (
    <div className="week-view">
      <section className="week-section due-section">
        <h2>이번 주</h2>
        {itemsThisWeek.length === 0 && notesThisWeek.length === 0 && (
          <p className="empty-hint">이번 주 마감인 할 일이 없습니다.</p>
        )}
        <div className="item-list">
          <ItemList items={itemsThisWeek} data={planner.data} planner={planner} />
          <NoteList notes={notesThisWeek} planner={planner} />
        </div>
      </section>
      <section className="week-section next-week-section">
        <h2>다음 주</h2>
        {itemsNextWeek.length === 0 && notesNextWeek.length === 0 && (
          <p className="empty-hint">다음 주 마감인 할 일이 없습니다.</p>
        )}
        <div className="item-list">
          <ItemList items={itemsNextWeek} data={planner.data} planner={planner} />
          <NoteList notes={notesNextWeek} planner={planner} />
        </div>
      </section>
      <section className="week-section progress-section">
        <h2>진행중</h2>
        {inProgress.length === 0 && <p className="empty-hint">진행중인 할 일이 없습니다.</p>}
        <div className="item-list">
          <ItemList items={inProgress} data={planner.data} planner={planner} />
        </div>
      </section>
    </div>
  );
}
