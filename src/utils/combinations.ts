
export const get_combinations = (values: string[]) => {

  const combi = [];
  const slent = Math.pow(2, values.length);

  for (var i = 0; i < slent; i++) {
    const temp = [];
    for (var j = 0; j < values.length; j++) {
      if ((i & Math.pow(2, j))) {
        temp.push(values[j]);
      }
    }
    if (temp.length > 0) {
      combi.push(temp);
    }
  }

  combi.sort((a, b) => a.length - b.length);
  return [[], ...combi];
}