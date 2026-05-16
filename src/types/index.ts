import { Point } from '@/components/SiteBoundaryTool';

export type Typology = 'Residential' | 'Industrial' | 'Retail' | 'Mixed-Use';

export type RoadType = 'Highway' | 'Arterial' | 'Local' | 'Specialized';

export type LayerId = 'site' | 'urban' | 'architecture';

export interface LayerState {
  id: LayerId;
  name: string;
  visible: boolean;
  locked: boolean;
}

export interface Road {
  id: string;
  type: RoadType;
  centerline: Point[];
  width: number;
  lanes: number;
  assets: InfrastructureAsset[];
}

export interface InfrastructureAsset {
  id: string;
  type: 'Light' | 'Sign' | 'Tree' | 'Drainage';
  position: Point;
  rotation: number;
}

export interface Site {
  width: number;
  length: number;
  setback: number;
}

export interface BuildingBlock {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  length: number;
  type: 'building' | 'parking' | 'amenity';
}

export interface ProForma {
  unitCount: number;
  parkingStalls: number;
  totalNRSF: number;
  efficiency: number;
  estimatedCost: number;
  yieldOnCost: number;
  far: number;
  coverage: number;
}

export interface Suggestion {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  action?: string;
}

export interface Scheme {
  id: string;
  name: string;
  typology: Typology;
  site: Site;
  blocks: BuildingBlock[];
  roads: Road[];
  proForma: ProForma;
  suggestions: Suggestion[];
  timestamp: number;
}

export interface SolverParams {
  siteWidth: number;
  siteLength: number;
  setback: number;
  typology: Typology;
  targetHeight: number;
  maxFAR?: number;
  maxCoverage?: number;
}
