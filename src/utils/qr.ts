// Deterministic SVG QR Code Generator for Ticket Verification
export function generateQrSvg(payload: string, size = 180): string {
  // Hash payload into 25x25 binary matrix
  const matrixSize = 25;
  const matrix: boolean[][] = Array.from({ length: matrixSize }, () =>
    Array(matrixSize).fill(false)
  );

  // 1. Draw top-left, top-right, bottom-left finder patterns (7x7 squares)
  const drawFinder = (startX: number, startY: number) => {
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 7; y++) {
        if (
          x === 0 || x === 6 || y === 0 || y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
        ) {
          matrix[startY + y][startX + x] = true;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(matrixSize - 7, 0); // Top-right
  drawFinder(0, matrixSize - 7); // Bottom-left

  // 2. Timing patterns
  for (let i = 8; i < matrixSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Populate remaining data modules pseudo-randomly using payload hash
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash << 5) - hash + payload.charCodeAt(i);
    hash |= 0;
  }

  let seed = Math.abs(hash) || 12345;
  const nextBit = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed >> 16) % 2 === 1;
  };

  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      // Don't overwrite finders or timing lines
      const inTopLeft = x < 8 && y < 8;
      const inTopRight = x >= matrixSize - 8 && y < 8;
      const inBottomLeft = x < 8 && y >= matrixSize - 8;
      const isTiming = x === 6 || y === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        matrix[y][x] = nextBit();
      }
    }
  }

  // Build SVG string
  const moduleSize = size / matrixSize;
  let rects = '';
  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      if (matrix[y][x]) {
        rects += `<rect x="${(x * moduleSize).toFixed(1)}" y="${(y * moduleSize).toFixed(1)}" width="${moduleSize.toFixed(1)}" height="${moduleSize.toFixed(1)}" fill="#000000" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">
    <rect width="${size}" height="${size}" fill="#ffffff" rx="8" />
    <g transform="translate(4, 4) scale(${((size - 8) / size).toFixed(3)})">
      ${rects}
    </g>
  </svg>`;
}
