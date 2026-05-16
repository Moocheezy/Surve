import { Point } from '@/components/SiteBoundaryTool';
import { Road, RoadType, InfrastructureAsset } from '@/types';

export const ROAD_CONFIGS: Record<RoadType, { width: number; lanes: number; assetSpacing: number }> = {
  Highway: { width: 60, lanes: 4, assetSpacing: 100 },
  Arterial: { width: 40, lanes: 2, assetSpacing: 60 },
  Local: { width: 24, lanes: 2, assetSpacing: 40 },
  Specialized: { width: 12, lanes: 1, assetSpacing: 30 },
};

export function generateRoadAssets(centerline: Point[], type: RoadType): InfrastructureAsset[] {
  const assets: InfrastructureAsset[] = [];
  const config = ROAD_CONFIGS[type];

  if (centerline.length < 2) return [];

  for (let i = 0; i < centerline.length - 1; i++) {
    const p1 = centerline[i];
    const p2 = centerline[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const numAssets = Math.floor(distance / config.assetSpacing);

    for (let j = 1; j <= numAssets; j++) {
      const ratio = (j * config.assetSpacing) / distance;
      assets.push({
        id: `asset-${type}-${Date.now()}-${i}-${j}`,
        type: i % 2 === 0 ? 'Light' : 'Tree',
        position: {
          x: p1.x + dx * ratio,
          y: p1.y + dy * ratio,
        },
        rotation: angle,
      });
    }
  }

  return assets;
}

export function buildRoad(centerline: Point[], type: RoadType): Road {
  const config = ROAD_CONFIGS[type];
  return {
    id: `road-${Date.now()}`,
    type,
    centerline,
    width: config.width,
    lanes: config.lanes,
    assets: generateRoadAssets(centerline, type),
  };
}
