export function difference<T>(array1: T[], array2: T[]): T[] {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const differenceSet1 = new Set([...set1].filter(item => !set2.has(item)));
  const differenceSet2 = new Set([...set2].filter(item => !set1.has(item)));

  return [...differenceSet1, ...differenceSet2];
}

export function differenceArrayOB(arr: any[]) {
  // console.log(Array.from(new Set(arr.map(item => item.id)))); lấy ra mảng chưa id duy nhất
   const uniqueGrades = Array.from(new Set(arr.map(item => item.id))).map(id => {
    return arr.find(item => item.id === id);
   });
  return uniqueGrades;
}