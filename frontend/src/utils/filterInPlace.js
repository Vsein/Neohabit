export default function filterInPlace(arr, predicate) {
  let write = 0;

  for (let read = 0; read < arr.length; read++) {
    if (predicate(arr[read], read, arr)) {
      arr[write] = arr[read];
      write++;
    }
  }

  arr.length = write;
}
