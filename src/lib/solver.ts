import { SolverParams, Scheme, BuildingBlock, ProForma, Suggestion } from '@/types';

export function solveSite(params: SolverParams): Scheme {
  const { siteWidth, siteLength, setback, typology, targetHeight, maxFAR = 3.0, maxCoverage = 0.6 } = params;

  const usableWidth = Math.max(0, siteWidth - setback * 2);
  const usableLength = Math.max(0, siteLength - setback * 2);
  const siteArea = siteWidth * siteLength;

  const blocks: BuildingBlock[] = [];

  // Deterministic building sizing
  const buildingWidth = usableWidth * 0.7;
  const buildingLength = usableLength * 0.8;
  const buildingHeight = targetHeight;
  const numFloors = Math.max(1, Math.floor(buildingHeight / 10));

  const footprintArea = buildingWidth * buildingLength;
  const totalGFA = footprintArea * numFloors;

  const far = totalGFA / siteArea;
  const coverage = footprintArea / siteArea;

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

  // Adaptive parking logic
  const parkingNeeded = typology === 'Residential' ? Math.floor(totalGFA / 1000) : Math.floor(totalGFA / 500);
  const surfaceParkingWidth = Math.max(0, usableWidth - buildingWidth - 4);
  const surfaceParkingLength = usableLength;
  const surfaceStalls = Math.floor((surfaceParkingWidth * surfaceParkingLength) / 350);

  if (surfaceParkingWidth > 10) {
    blocks.push({
      id: 'parking-surface',
      x: (buildingWidth / 2 + surfaceParkingWidth / 2) + 2,
      y: 0.1,
      z: 0,
      width: surfaceParkingWidth,
      height: 0.2,
      length: surfaceParkingLength,
      type: 'parking',
    });
  }

  // Analytics
  const efficiency = 0.85;
  const nrsf = totalGFA * efficiency;
  const unitCount = Math.floor(nrsf / 850);
  const parkingStalls = surfaceStalls;

  const estimatedCost = nrsf * 250 + parkingStalls * 5000;
  const revenue = nrsf * 1.5 * 12;
  const yieldOnCost = (revenue / estimatedCost) * 100;

  const proForma: ProForma = {
    unitCount,
    parkingStalls,
    totalNRSF: Math.round(nrsf),
    efficiency: 85,
    estimatedCost,
    yieldOnCost: Number(yieldOnCost.toFixed(2)),
    far: Number(far.toFixed(2)),
    coverage: Number((coverage * 100).toFixed(1)),
  };

  // Generate Suggestions
  const suggestions: Suggestion[] = [];
  if (far > maxFAR) {
    suggestions.push({
      id: 'far-warning',
      type: 'warning',
      message: `FAR (${proForma.far}) exceeds zoning limit of ${maxFAR}.`,
      action: 'Reduce height or footprint.'
    });
  }
  if (coverage > maxCoverage) {
    suggestions.push({
      id: 'coverage-warning',
      type: 'warning',
      message: `Site coverage (${proForma.coverage}%) exceeds limit of ${maxCoverage * 100}%.`,
      action: 'Increase setbacks.'
    });
  }
  if (parkingStalls < parkingNeeded) {
    suggestions.push({
      id: 'parking-info',
      type: 'info',
      message: `Parking shortfall: ${parkingNeeded - parkingStalls} stalls required by code.`,
      action: 'Consider structured parking.'
    });
  }
  if (yieldOnCost > 7) {
    suggestions.push({
      id: 'yield-success',
      type: 'success',
      message: 'High yield detected. This deal pencils exceptionally well.',
    });
  }

  return {
    id: 'scheme-1',
    name: 'Default Scheme',
    typology,
    site: { width: siteWidth, length: siteLength, setback },
    blocks,
    proForma,
    suggestions,
    timestamp: Date.now(),
  };
}
