function findFirstIndexBsearch(array, predicate) {
  let l = 0;
  let r = array.length - 1;
  let result = -1;

  while (l <= r) {
    const m = Math.floor((l + r) / 2);

    if (predicate(array[m], m)) {
      result = m;
      r = m - 1;
    } else {
      l = m + 1;
    }
  }

  return result;
}

export { findFirstIndexBsearch };
