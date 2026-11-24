
var findKthPositive = function (arr, k) {
  let left = 0,
    right = arr.length;
  while (left < right) {
    const mid = (left + right) >> 1;

    if (arr[mid] - (mid + 1) < k) left = mid + 1;
    else right = mid;
  }
  return left + k;
};

console.log(findKthPositive([2, 3, 4, 7, 11], 5)); // 9
console.log(findKthPositive([1, 2, 3, 4], 2)); // 6
