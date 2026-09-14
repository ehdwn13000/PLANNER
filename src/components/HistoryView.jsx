import { usePlanner } from "../context/PlannerContext";
import { getHistoryTree } from "../data/selectors";
import { categoryColor, projectColor } from "../utils/color";

export default function HistoryView() {
  const planner = usePlanner();
  const tree = getHistoryTree(planner.data);

  return (
    <div className="history-view">
      {tree.length === 0 && <p className="empty-hint">아직 완료된 기록이 없습니다.</p>}
      {tree.map(({ category, projects }) => {
        const catColor = categoryColor(category.id, planner.data.categories);
        const categoryProjects = planner.data.projects.filter((p) => p.categoryId === category.id);
        return (
          <div key={category.id} className="history-category">
            <h2>
              <span className="color-dot" style={{ background: catColor.border }} />
              {category.name}
            </h2>
            {projects.map(({ project, items }) => {
              const color = projectColor(category.id, project.id, planner.data.categories, categoryProjects);
              return (
                <div key={project.id} className="history-project" style={{ borderLeftColor: color.border }}>
                  <div className="history-project-header">
                    <span className="history-project-name">{project.name}</span>
                    {project.completed && (
                      <>
                        <span className="history-badge">완료됨</span>
                        <button type="button" onClick={() => planner.restoreProject(project.id)}>
                          프로젝트 복구
                        </button>
                      </>
                    )}
                  </div>
                  <div className="history-item-list">
                    {items.map((item) => (
                      <div key={item.id} className="history-item">
                        <span className={item.completed ? "history-item-name done" : "history-item-name"}>
                          {item.name}
                        </span>
                        {item.completed && (
                          <>
                            <span className="history-item-date">
                              {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : ""}
                            </span>
                            <button type="button" onClick={() => planner.restoreItem(item.id)}>
                              복구
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    {items.length === 0 && <p className="empty-hint">기록된 항목이 없습니다.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
