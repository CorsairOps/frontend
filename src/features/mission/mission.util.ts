
export function getMissionPriorityColor(priority: number) {
  const priorityColors: string[] = ['red', 'darkorange', 'orange', 'blue', 'green'];
  return priorityColors.at(priority - 1) || 'grey';
}