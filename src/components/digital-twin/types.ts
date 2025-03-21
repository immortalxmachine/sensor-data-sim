
export interface ViewerState {
  zoom: number;
  rotation: number;
  activeComponent: string | null;
  showDetails: boolean;
}

export interface ComponentData {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'default';
}
