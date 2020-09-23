import xlsx = require("xlsx");

export default function (file: Buffer) {
  const wb = xlsx.read(file, {
    type: "buffer"
  });
  console.log(wb.Sheets)
}
