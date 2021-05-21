let P = [];

export default function fitter(y) {
  let x = [];
  for (let i = 0; i < y.length; i++) {
    x[i] = i;
  }

  polyfit(x, y, 5);

  const res = [];
  for (let i of x) {
    res.push(P[5] * Math.pow(i, 5) + P[4] * Math.pow(i, 4) + P[3] * Math.pow(i, 3) + P[2] * Math.pow(i, 2) + P[1] * Math.pow(i, 1) + P[0]);
  }

  return res;
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} poly_n 次数
 */
function polyfit(x, y, poly_n) {
  const n = x.length;
  const tempX = Array(n).fill(1), tempY = [...y];
  const sumX = [], sumY = [], ata = [];
  let j = 0;

  for (let i = 0; i < 2 * poly_n + 1; i++) {
    for (sumX[i] = 0, j = 0; j < n; j++) {
      sumX[i] += tempX[j];
      tempX[j] *= x[j];
    }
  }

  for (let i = 0; i < poly_n + 1; i++) {
    for (sumY[i] = 0, j = 0; j < n; j++) {
      sumY[i] += tempY[j];
      tempY[j] *= x[j];
    }
  }

  for (let i = 0; i < poly_n + 1; i++) {
    for (j = 0; j < poly_n + 1; j++) {
      ata[i * (poly_n + 1) + j] = sumX[i + j];
    }
  }
  gauss_solve(poly_n + 1, ata, sumY);
}

/**
 * 高斯消元法
 * @param {*} n 
 * @param {*} A 
 * @param {*} b 
 */
function gauss_solve(n, A, b) {
  let i, j, k, r, max;

  for (k = 0; k < n - 1; k++) {
    max = Math.abs(A[k * n + k]);
    r = k;
    for (i = k + 1; i < n - 1; i++) {
      if (max < Math.abs(A[i * n + i])) {
        max = Math.abs(A[i * n + i]);
        r = i;
      }
    }
    if (r != k) {
      for (i = 0; i < n; i++) {
        max = A[k * n + i];
        A[k * n + i] = A[r * n + i];
        A[r * n + i] = max;
      }
      max = b[k];
      b[k] = b[r];
      b[r] = max;
    }

    for (i = k + 1; i < n; i++) {
      for (j = k + 1; j < n; j++) {
        A[i * n + j] -= A[i * n + k] * A[k * n + j] / A[k * n + k];
      }
      b[i] -= A[i * n + k] * b[k] / A[k * n + k];
    }
  }

  for (i = n - 1; i >= 0; P[i] /= A[i * n + i], i--) {
    for (j = i + 1, P[i] = b[i]; j < n; j++) {
      P[i] -= A[i * n + j] * P[j];
    }
  }
}
