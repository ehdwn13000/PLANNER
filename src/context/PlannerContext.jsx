import { createContext, useContext, useEffect, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { loadData, saveData, generateId } from "../data/plannerStore";

const PlannerContext = createContext(null);

const EMPTY_DATA = { categories: [], projects: [], items: [], quickNotes: [] };

export function PlannerProvider({ children }) {
  const [data, setData] = useState(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadData().then((loaded) => {
      if (cancelled) return;
      setData(loaded);
      hasLoaded.current = true;
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
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

  function reorderCategories(activeId, overId) {
    setData((d) => {
      const oldIndex = d.categories.findIndex((c) => c.id === activeId);
      const newIndex = d.categories.findIndex((c) => c.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return d;
      return { ...d, categories: arrayMove(d.categories, oldIndex, newIndex) };
    });
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

  function reorderProjects(categoryId, activeId, overId) {
    setData((d) => {
      const scoped = d.projects.filter((p) => p.categoryId === categoryId);
      const oldIndex = scoped.findIndex((p) => p.id === activeId);
      const newIndex = scoped.findIndex((p) => p.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return d;
      const reorderedScoped = arrayMove(scoped, oldIndex, newIndex);
      const others = d.projects.filter((p) => p.categoryId !== categoryId);
      return { ...d, projects: [...others, ...reorderedScoped] };
    });
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

  function reorderItems(projectId, activeId, overId) {
    setData((d) => {
      const scoped = d.items.filter((i) => i.projectId === projectId);
      const oldIndex = scoped.findIndex((i) => i.id === activeId);
      const newIndex = scoped.findIndex((i) => i.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return d;
      const reorderedScoped = arrayMove(scoped, oldIndex, newIndex);
      const others = d.items.filter((i) => i.projectId !== projectId);
      return { ...d, items: [...others, ...reorderedScoped] };
    });
  }

  function deleteItem(id) {
    setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== id) }));
  }

  function addQuickNote(text, tag, dueDate) {
    const note = {
      id: generateId(),
      text,
      tag,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, quickNotes: [...d.quickNotes, note] }));
  }

  function updateQuickNote(id, updates) {
    setData((d) => ({
      ...d,
      quickNotes: d.quickNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
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

  function replaceAll(newData) {
    setData({
      categories: newData?.categories ?? [],
      projects: newData?.projects ?? [],
      items: newData?.items ?? [],
      quickNotes: newData?.quickNotes ?? [],
    });
  }

  const value = {
    data,
    isLoading,
    replaceAll,
    addCategory,
    updateCategory,
    reorderCategories,
    deleteCategory,
    addProject,
    updateProject,
    completeProject,
    restoreProject,
    reorderProjects,
    deleteProject,
    addItem,
    updateItem,
    completeItem,
    restoreItem,
    reorderItems,
    deleteItem,
    addQuickNote,
    updateQuickNote,
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
