import { useState } from "react";
import { usePlanner } from "../context/PlannerContext";
import { getHistoryTree } from "../data/selectors";
import { categoryColor, projectColor } from "../utils/color";
import { confirmDelete } from "../utils/confirm";

function CategoryHistoryBlock({ category, projects, planner }) {
  const catColor = categoryColor(category.id, planner.data.categories);
  const categoryProjects = planner.data.projects.filter((p) => p.categoryId === category.id);

  return (
    <div className="history-category">
      <h2>
        <span className="color-dot" style={{ background: catColor.border }} />
        {category.name}
        {category.ended && (
          <>
            <span className="history-badge">종료됨</span>
            <button type="button" onClick={() => planner.restoreCategory(category.id)}>
              업무 복구
            </button>
          </>
        )}
        <select
          className="history-folder-select"
          value={category.folderId ?? ""}
          onChange={(e) => planner.updateCategory(category.id, { folderId: e.target.value || null })}
        >
          <option value="">미분류</option>
          {planner.data.folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </h2>
      {projects.length === 0 && <p className="empty-hint">프로젝트가 없습니다.</p>}
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
}

function FolderForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  }

  return (
    <form className="quick-add-form" onSubmit={submit}>
      <input autoFocus placeholder="폴더 이름... (예: 26년상반기)" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">추가</button>
      <button type="button" onClick={onCancel}>취소</button>
    </form>
  );
}

export default function HistoryView() {
  const planner = usePlanner();
  const [addingFolder, setAddingFolder] = useState(false);
  const [collapsedFolders, setCollapsedFolders] = useState({});

  const tree = getHistoryTree(planner.data);
  const folders = planner.data.folders;
  const unassigned = tree.filter(({ category }) => !category.folderId);
  const isEmpty = tree.length === 0 && folders.length === 0;

  function commitFolderName(folder, value) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== folder.name) planner.updateFolder(folder.id, { name: trimmed });
  }

  function toggleFolder(folderId) {
    setCollapsedFolders((c) => ({ ...c, [folderId]: !c[folderId] }));
  }

  return (
    <div className="history-view">
      {isEmpty && <p className="empty-hint">아직 완료된 기록이 없습니다.</p>}

      {folders.map((folder) => {
        const entries = tree.filter(({ category }) => category.folderId === folder.id);
        const collapsed = Boolean(collapsedFolders[folder.id]);
        return (
          <div key={folder.id} className="history-folder">
            <div className="history-folder-header">
              <button
                type="button"
                className="history-folder-toggle"
                title={collapsed ? "펼치기" : "접기"}
                onClick={() => toggleFolder(folder.id)}
              >
                {collapsed ? "▸" : "▾"}
              </button>
              <input
                className="history-folder-name"
                defaultValue={folder.name}
                onBlur={(e) => {
                  commitFolderName(folder, e.target.value);
                  e.target.value = folder.name;
                }}
              />
              <button
                type="button"
                className="icon-btn"
                title="폴더 삭제"
                onClick={() => confirmDelete() && planner.deleteFolder(folder.id)}
              >
                ✕
              </button>
            </div>
            {!collapsed && (
              <>
                {entries.length === 0 && <p className="empty-hint">이 폴더에 배정된 업무가 없습니다.</p>}
                {entries.map(({ category, projects }) => (
                  <CategoryHistoryBlock key={category.id} category={category} projects={projects} planner={planner} />
                ))}
              </>
            )}
          </div>
        );
      })}

      <div className="history-unassigned">
        {folders.length > 0 && unassigned.length > 0 && <h3>미분류</h3>}
        {unassigned.map(({ category, projects }) => (
          <CategoryHistoryBlock key={category.id} category={category} projects={projects} planner={planner} />
        ))}
      </div>

      <div className="history-folder-add">
        {addingFolder ? (
          <FolderForm
            onSubmit={(name) => {
              planner.addFolder(name);
              setAddingFolder(false);
            }}
            onCancel={() => setAddingFolder(false)}
          />
        ) : (
          <button type="button" onClick={() => setAddingFolder(true)}>
            + 폴더 추가
          </button>
        )}
      </div>
    </div>
  );
}
