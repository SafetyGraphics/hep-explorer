export function clearRugs(axis) {
    this[axis + '_rug'].selectAll('*').remove();
}
