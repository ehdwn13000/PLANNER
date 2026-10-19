import { usePlanner } from "../context/PlannerContext";
import { getItemContext } from "../data/selectors";
import { todayISODate } from "../utils/date";
import ItemRow from "./ItemRow";
import NoteRow from "./NoteRow";

export default function TodayView() {
  const planner = usePlanner();
  const today = todayISODate();

  const todayItems = planner.data.items
    .filter((i) => !i.completed && i.dueDate === today)
    .sort((a, b) => (a.priority < b.priority ? -1 : 1));

  const todayNotes = planner.data.quickNotes.filter((n) => !n.completed && n.dueDate === today);

  return (
    <div className="today-view">
      <h2>오늘 할 일</h2>
      {todayItems.length === 0 && todayNotes.length === 0 && (
        <p className="empty-hint">오늘 마감인 할 일이 없습니다.</p>
      )}
      <div className="item-list">
        {todayItems.map((item) => {
          const { categoryName, projectName } = getItemContext(item, planner.data);
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
        })}
        {todayNotes.map((note) => (
          <NoteRow
            key={note.id}
            note={note}
            onUpdate={planner.updateQuickNote}
            onToggle={planner.toggleQuickNote}
            onDelete={planner.deleteQuickNote}
          />
        ))}
      </div>
    </div>
  );
}
