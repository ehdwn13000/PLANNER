import { usePlanner } from "../context/PlannerContext";
import { getItemContext } from "../data/selectors";
import { isThisWeek } from "../utils/date";
import ItemRow from "./ItemRow";

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

export default function WeekView() {
  const planner = usePlanner();
  const incomplete = planner.data.items.filter((i) => !i.completed);

  const dueThisWeek = incomplete
    .filter((i) => isThisWeek(i.dueDate))
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));

  const inProgress = incomplete.filter((i) => !isThisWeek(i.dueDate));

  return (
    <div className="week-view">
      <section className="week-section due-section">
        <h2>이번 주 마감</h2>
        {dueThisWeek.length === 0 && <p className="empty-hint">이번 주 마감인 할 일이 없습니다.</p>}
        <div className="item-list">
          <ItemList items={dueThisWeek} data={planner.data} planner={planner} />
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
