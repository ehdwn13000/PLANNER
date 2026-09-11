import { createContext, useContext, useEffect, useState } from "react";
import { loadData, saveData, generateId } from "../data/plannerStore";

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [data, setData] = useState(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  function addCategory(name) {
    const category = { id: generateId(), name, createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, categories: [...d.categories, category] }));
  }

  function updateCategory(id, updates) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }

  function deleteCategory(id) {
    setData((d) => {
      const projectIds = d.projects.filter((p) => p.categoryId === id).map((p) => p.id);
      return {
        ...d,
        categories: d.categories.filter((c) => c.id !== id),
        projects: d.projects.filter((p) => p.categoryId !== id),
        items: d.items.filter((i) => !projectIds.includes(i.projectId)),
      };
    });
  }

  function addProject(categoryId, name) {
    const project = {
      id: generateId(),
      categoryId,
      name,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, projects: [...d.projects, project] }));
  }

  function updateProject(id, updates) {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }

  function completeProject(id) {
    updateProject(id, { completed: true, completedAt: new Date().toISOString() });
  }

  function restoreProject(id) {
    updateProject(id, { completed: false, completedAt: null });
  }

  function deleteProject(id) {
    setData((d) => ({
      ...d,
      projects: d.projects.filter((p) => p.id !== id),
      items: d.items.filter((i) => i.projectId !== id),
    }));
  }

  function addItem(projectId, { name, dueDate, priority }) {
    const item = {
      id: generateId(),
      projectId,
      name,
      dueDate: dueDate || null,
      priority: priority || "중",
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, items: [...d.items, item] }));
  }

  function updateItem(id, updates) {
    setData((d) => ({
      ...d,
      items: d.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  }

  function completeItem(id, completed = true) {
    updateItem(id, { completed, completedAt: completed ? new Date().toISOString() : null });
  }

  function restoreItem(id) {
    completeItem(id, false);
  }

  function deleteItem(id) {
    setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== id) }));
  }

  function addQuickNote(text, tag) {
    const note = {
      id: generateId(),
      text,
      tag,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, quickNotes: [...d.quickNotes, note] }));
  }

  function toggleQuickNote(id) {
    setData((d) => ({
      ...d,
      quickNotes: d.quickNotes.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n)),
    }));
  }

  function deleteQuickNote(id) {
    setData((d) => ({ ...d, quickNotes: d.quickNotes.filter((n) => n.id !== id) }));
  }

  const value = {
    data,
    addCategory,
    updateCategory,
    deleteCategory,
    addProject,
    updateProject,
    completeProject,
    restoreProject,
    deleteProject,
    addItem,
    updateItem,
    completeItem,
    restoreItem,
    deleteItem,
    addQuickNote,
    toggleQuickNote,
    deleteQuickNote,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
