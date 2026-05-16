import { Point } from '@/components/SiteBoundaryTool';

export interface SGCoordinate {
  label: string;
  y: number; // In SA, Y is Easting
  x: number; // In SA, X is Northing (negative South)
}

export interface SGData {
  diagramNumber: string;
  description: string;
  coordinates: SGCoordinate[];
  sides: number[];
  angles: string[];
  areaHectares: number;
}

export function generateSGData(points: Point[]): SGData {
  // Simulate SA Coordinate System (Lo27 or similar)
  // Converting local canvas pixels to simulated formal coordinates
  const coords: SGCoordinate[] = points.map((p, i) => ({
    label: String.fromCharCode(65 + i),
    y: +(2700000 + p.x * 10).toFixed(2),
    x: +(-3100000 - p.y * 10).toFixed(2),
  }));

  // Calculate sides and area
  const sides: number[] = [];
  for (let i = 0; i < coords.length; i++) {
    const next = coords[(i + 1) % coords.length];
    const dx = next.y - coords[i].y;
    const dy = next.x - coords[i].x;
    sides.push(+Math.sqrt(dx * dx + dy * dy).toFixed(2));
  }

  // Simple Area in Hectares
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    area += coords[i].y * coords[j].x;
    area -= coords[j].y * coords[i].x;
  }
  const hectares = Math.abs(area) / 20000;

  return {
    diagramNumber: `SG No. ${Math.floor(Math.random() * 9000 + 1000)}/2025`,
    description: "Proposed Subdivision of Erf 1234, Cape Town",
    coordinates: coords,
    sides,
    angles: coords.map(() => `${Math.floor(Math.random() * 360)}°${Math.floor(Math.random() * 60)}'`),
    areaHectares: +hectares.toFixed(4),
  };
}
