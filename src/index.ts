import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Ensure AG Grid community features are registered when the package is imported
ModuleRegistry.registerModules([AllCommunityModule]);

export { default as Ad99DataTable } from './components/DataTable';
export * from './types/table.types';
