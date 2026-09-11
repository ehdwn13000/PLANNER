import { useState } from "react";
import { usePlanner } from "../context/PlannerContext";
import ItemRow from "./ItemRow";
import { confirmDelete } from "../utils/confirm";
import { categoryColor, projectColor } from "../utils/color";

function computeProgress(items, projectId) {
  const projectItems = items.filter((i) => i.projectId === projectId);
  const total = projectItems.length;
  const done = projectItems.filter((i) => i.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
}

function ProjectBlock({ project, items, planner }) {
  const [name, setName] = useState(project.name);
  const progress = computeProgress(items, project.id);
  const activeItems = items.filter((i) => i.projectId === project.id && !i.completed);
  const color = projectColor(project.categoryId, project.id);

  function commitName() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== project.name) planner.updateProject(project.id, { name: trimmed });
    else setName(project.name);
  }

  return (
    <div className="project-block" style={{ borderLeftColor: color.border }}>
      <div className="project-header">
        <span className="color-dot" style={{ background: color.border }} />
        <input className="project-name" value={name} onChange={(e) => setName(e.target.value)} onBlur={commitName} />
        <span className="progress-label">
          {progress.done}/{progress.total} 완료 ({progress.percent}%)
        </span>
        <button type="button" onClick={() => planner.completeProject(project.id)}>
          프로젝트 완료
        </button>
        <button
          type="button"
          className="icon-btn"
          title="삭제"
          onClick={() => confirmDelete() && planner.deleteProject(project.id)}
        >
          ✕
        </button>
      </div>
      <div className="item-list">
        {activeItems.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onUpdate={planner.updateItem}
            onComplete={planner.completeItem}
            onDelete={planner.deleteItem}
          />
        ))}
        {activeItems.length === 0 && <p className="empty-hint">할 일이 없습니다.</p>}
      </div>
    </div>
  );
}

function CategoryBlock({ category, planner }) {
  const [name, setName] = useState(category.name);
  const activeProjects = planner.data.projects.filter((p) => p.categoryId === category.id && !p.completed);
  const color = categoryColor(category.id);

  function commitName() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== category.name) planner.updateCategory(category.id, { name: trimmed });
    else setName(category.name);
  }

  return (
    <div className="category-block" style={{ borderLeftColor: color.border }}>
      <div className="category-header">
        <span className="color-dot" style={{ background: color.border }} />
        <input className="category-name" value={name} onChange={(e) => setName(e.target.value)} onBlur={commitName} />
        <button
          type="button"
          className="icon-btn"
          title="삭제"
          onClick={() => confirmDelete() && planner.deleteCategory(category.id)}
        >
          ✕
        </button>
      </div>
      {activeProjects.map((project) => (
        <ProjectBlock key={project.id} project={project} items={planner.data.items} planner={planner} />
      ))}
      {activeProjects.length === 0 && <p className="empty-hint">프로젝트가 없습니다.</p>}
    </div>
  );
}

function CategoryForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  }

  return (
    <form className="quick-add-form" onSubmit={submit}>
      <input autoFocus placeholder="업무 이름... (예: 국내신입 온보딩)" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">추가</button>
      <button type="button" onClick={onCancel}>취소</button>
    </form>
  );
}

function ProjectForm({ categories, onSubmit, onCancel }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!categoryId || !name.trim()) return;
    onSubmit(categoryId, name.trim());
  }

  return (
    <form className="quick-add-form" onSubmit={submit}>
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input autoFocus placeholder="프로젝트 이름..." value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">추가</button>
      <button type="button" onClick={onCancel}>취소</button>
    </form>
  );
}

function ItemForm({ categories, projects, onSubmit, onCancel }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const projectsInCategory = projects.filter((p) => p.categoryId === categoryId);
  const [projectId, setProjectId] = useState(projectsInCategory[0]?.id ?? "");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("중");

  function handleCategoryChange(id) {
    setCategoryId(id);
    const firstProject = projects.find((p) => p.categoryId === id);
    setProjectId(firstProject?.id ?? "");
  }

  function submit(e) {
    e.preventDefault();
    if (!projectId || !name.trim()) return;
    onSubmit(projectId, { name: name.trim(), dueDate: dueDate || null, priority });
  }

  return (
    <form className="quick-add-form quick-add-form-item" onSubmit={submit}>
      <div className="quick-add-row">
        <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          {projectsInCategory.length === 0 && <option value="">(프로젝트 없음)</option>}
          {projectsInCategory.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="quick-add-row">
        <input autoFocus placeholder="할 일 입력..." value={name} onChange={(e) => setName(e.target.value)} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="상">상</option>
          <option value="중">중</option>
          <option value="하">하</option>
        </select>
        <button type="submit" disabled={!projectId}>추가</button>
        <button type="button" onClick={onCancel}>취소</button>
      </div>
    </form>
  );
}

export default function HomeView() {
  const planner = usePlanner();
  const [activeForm, setActiveForm] = useState(null); // "category" | "project" | "item" | null

  const categories = planner.data.categories;
  const activeProjects = planner.data.projects.filter((p) => !p.completed);

  function closeForm() {
    setActiveForm(null);
  }

  return (
    <div className="home-view">
      {categories.length === 0 && <p className="empty-hint">업무를 추가하며 시작해보세요.</p>}
      {categories.map((category) => (
        <CategoryBlock key={category.id} category={category} planner={planner} />
      ))}

      <div className="quick-add-bar">
        {activeForm === "category" && (
          <CategoryForm
            onSubmit={(name) => {
              planner.addCategory(name);
              closeForm();
            }}
            onCancel={closeForm}
          />
        )}
        {activeForm === "project" && (
          <ProjectForm
            categories={categories}
            onSubmit={(categoryId, name) => {
              planner.addProject(categoryId, name);
              closeForm();
            }}
            onCancel={closeForm}
          />
        )}
        {activeForm === "item" && (
          <ItemForm
            categories={categories}
            projects={activeProjects}
            onSubmit={(projectId, payload) => {
              planner.addItem(projectId, payload);
              closeForm();
            }}
            onCancel={closeForm}
          />
        )}
        {activeForm === null && (
          <div className="quick-add-buttons">
            <button type="button" onClick={() => setActiveForm("category")}>
              + 업무 추가
            </button>
            <button type="button" onClick={() => setActiveForm("project")} disabled={categories.length === 0}>
              + 프로젝트 추가
            </button>
            <button type="button" onClick={() => setActiveForm("item")} disabled={activeProjects.length === 0}>
              + 할 일 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
