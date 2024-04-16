if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function<T>(this: T[]): T[] {
    const copy = [].slice.call(this);
    copy.sort();
    return copy;
  };
}
