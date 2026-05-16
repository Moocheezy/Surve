export type Typology = 'Residential' | 'Industrial' | 'Retail' | 'Mixed-Use';

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
}

export interface Scheme {
  id: string;
  name: string;
  typology: Typology;
  site: Site;
  blocks: BuildingBlock[];
  proForma: ProForma;
  timestamp: number;
}

export interface SolverParams {
  siteWidth: number;
  siteLength: number;
  setback: number;
  typology: Typology;
  targetHeight: number;
}
