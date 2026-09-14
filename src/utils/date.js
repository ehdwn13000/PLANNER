export function todayISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;
  return dueDate < todayISODate();
}

export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isThisWeek(dueDate) {
  if (!dueDate) return false;
  const start = startOfWeek(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const target = new Date(dueDate);
  return target >= start && target < end;
}

export function isNextWeek(dueDate) {
  if (!dueDate) return false;
  const start = startOfWeek(new Date());
  start.setDate(start.getDate() + 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const target = new Date(dueDate);
  return target >= start && target < end;
}
