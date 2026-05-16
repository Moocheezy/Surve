import { SolverParams, Scheme, BuildingBlock, ProForma } from '@/types';

export function solveSite(params: SolverParams): Scheme {
  const { siteWidth, siteLength, setback, typology, targetHeight } = params;

  const usableWidth = Math.max(0, siteWidth - setback * 2);
  const usableLength = Math.max(0, siteLength - setback * 2);

  const blocks: BuildingBlock[] = [];

  // Basic generative logic:
  // For simplicity, we create a central building block and a parking area
  const buildingWidth = usableWidth * 0.7;
  const buildingLength = usableLength * 0.8;
  const buildingHeight = targetHeight;

  blocks.push({
    id: 'main-building',
    x: 0,
    y: buildingHeight / 2,
    z: 0,
    width: buildingWidth,
    height: buildingHeight,
    length: buildingLength,
    type: 'building',
  });

  // Add a parking block if there's space
  if (usableWidth > buildingWidth) {
    blocks.push({
      id: 'parking-surface',
      x: (buildingWidth / 2 + (usableWidth - buildingWidth) / 2) + 2,
      y: 0.1,
      z: 0,
      width: usableWidth - buildingWidth - 4,
      height: 0.2,
      length: buildingLength,
      type: 'parking',
    });
  }

  const nrsf = buildingWidth * buildingLength * (buildingHeight / 10) * 0.85; // 85% efficiency, 10ft per floor
  const unitCount = Math.floor(nrsf / 850); // 850 sqft average unit
  const parkingStalls = Math.floor((usableWidth - buildingWidth) * buildingLength / 350); // 350 sqft per stall

  const estimatedCost = nrsf * 250 + parkingStalls * 5000;
  const revenue = nrsf * 1.5 * 12; // $1.5/sqft/mo rent
  const yieldOnCost = (revenue / estimatedCost) * 100;

  const proForma: ProForma = {
    unitCount,
    parkingStalls,
    totalNRSF: Math.round(nrsf),
    efficiency: 85,
    estimatedCost,
    yieldOnCost: Number(yieldOnCost.toFixed(2)),
  };

  return {
    id: 'scheme-1',
    name: 'Default Scheme',
    typology,
    site: { width: siteWidth, length: siteLength, setback },
    blocks,
    proForma,
    timestamp: Date.now(),
  };
}
