export function getItemContext(item, data) {
  const project = data.projects.find((p) => p.id === item.projectId);
  const category = project ? data.categories.find((c) => c.id === project.categoryId) : null;
  return {
    projectName: project ? project.name : "(알 수 없음)",
    categoryName: category ? category.name : "(알 수 없음)",
  };
}

// L1 -> L2 -> L3 구조를 유지한 채로 완료된 항목만 모은 트리를 만든다.
// - 완료된 프로젝트(Level 2): 모든 하위 실행항목을 그대로 보여준다 (완료/미완료 상관없이 기록으로 보존)
// - 완료되지 않은 프로젝트: 그 아래 완료된 실행항목만 모아서 보여준다
export function getHistoryTree(data) {
  return data.categories
    .map((category) => {
      const categoryProjects = data.projects.filter((p) => p.categoryId === category.id);
      const projects = categoryProjects
        .map((project) => {
          const projectItems = data.items.filter((i) => i.projectId === project.id);
          const items = project.completed ? projectItems : projectItems.filter((i) => i.completed);
          return { project, items };
        })
        .filter(({ project, items }) => project.completed || items.length > 0);
      return { category, projects };
    })
    .filter(({ projects }) => projects.length > 0);
}
