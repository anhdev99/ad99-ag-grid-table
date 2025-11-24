import React from 'react';

/**
 * Helper function to create AG Grid cell renderer compatible with library usage
 * This ensures React components work correctly when the package is installed externally
 * 
 * @example
 * const StatusRenderer = createCellRenderer((props) => (
 *   <span style={{ color: 'green' }}>{props.value}</span>
 * ));
 * 
 * // Use in columnDefs
 * { field: 'status', cellRenderer: StatusRenderer }
 */
export function createCellRenderer<T = any>(
  Component: React.ComponentType<any>
): React.ComponentType<any> {
  return React.memo(Component);
}

export default createCellRenderer;
