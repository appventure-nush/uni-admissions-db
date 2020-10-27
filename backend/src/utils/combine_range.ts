export default function (items: number[]): Array<string | number> {
  const output = new Array<string | number>();
  items.sort((x,y)=>x - y)
  let prev = items[0];
  let seq = false;
  output.push(prev);
  for (let i = 1; i < items.length; i++) {
    if (items[i] != prev + 1) {
      if(seq){
        output.push(prev);
      }
      seq = false;
      output.push(items[i]);
    } else if(!seq) {
      seq = true;
      output.push("..");
    }
    prev = items[i];
  }
  if (items[items.length - 1] != output[output.length - 1]) {
    output.push(items[items.length - 1]);
  }
  return output;
}
