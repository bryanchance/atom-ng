export function showError(title, description, points) {
    const renderedPoints = points.map(item => `  • ${item}`);
    atom.notifications.addWarning(`[Linter] ${title}`, {
        dismissable: true,
        detail: `${description}\n${renderedPoints.join('\n')}`,
    });
}
//# sourceMappingURL=helpers.js.map