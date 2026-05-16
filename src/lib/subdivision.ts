import * as turf from '@turf/turf';
import { Point } from '@/components/SiteBoundaryTool';
import { Road } from '@/types';

export interface Parcel {
  id: string;
  points: Point[];
  area: number;
}

export function subdivideSite(boundaryPoints: Point[], roads: Road[]): Parcel[] {
  if (boundaryPoints.length < 3) return [];

  // Convert points to Turf polygon
  const boundaryCoords = [...boundaryPoints, boundaryPoints[0]].map(p => [p.x, p.y]);
  let sitePoly = turf.polygon([boundaryCoords]);

  // Subtract roads (simulating Right of Way buffers)
  // Assume 1 pixel = 1 meter for scaling
  roads.forEach(road => {
    if (road.centerline.length < 2) return;
    const line = turf.lineString(road.centerline.map(p => [p.x, p.y]));
    // Buffer the road to create a "no-build" zone
    const buffer = turf.buffer(line, road.width / 500, { units: 'kilometers' });

    try {
      const difference = turf.difference(turf.featureCollection([sitePoly, buffer as any]));
      if (difference && difference.geometry.type === 'Polygon') {
        sitePoly = difference as any;
      } else if (difference && difference.geometry.type === 'MultiPolygon') {
        // Just take the largest piece for simplicity in this MVP
        const polys = (difference.geometry as any).coordinates.map((coords: any) => turf.polygon(coords));
        sitePoly = polys.reduce((prev: any, current: any) =>
          turf.area(prev) > turf.area(current) ? prev : current
        );
      }
    } catch (e) {
      console.error("Subdivision subtraction failed", e);
    }
  });

  // Simple grid subdivision within the remaining polygon
  const bbox = turf.bbox(sitePoly);
  const parcels: Parcel[] = [];

  // Create 4 quadrants as a simple subdivision example
  const stepX = (bbox[2] - bbox[0]) / 3;
  const stepY = (bbox[3] - bbox[1]) / 2;

  const grid = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      grid.push(turf.bboxPolygon([
        bbox[0] + i * stepX,
        bbox[1] + j * stepY,
        bbox[0] + (i + 1) * stepX,
        bbox[1] + (j + 1) * stepY
      ]));
    }
  }

  grid.forEach((quad, i) => {
    try {
      const intersection = turf.intersect(turf.featureCollection([sitePoly, quad]));
      if (intersection && intersection.geometry.type === 'Polygon') {
        parcels.push({
          id: `parcel-${i}-${Date.now()}`,
          points: (intersection.geometry.coordinates[0] as any).map((coord: any) => ({ x: coord[0], y: coord[1] })),
          area: Math.round(turf.area(intersection)),
        });
      }
    } catch (e) {
      // Ignore intersection failures
    }
  });

  return parcels;
}
