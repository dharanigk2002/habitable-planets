const { parse } = require("csv-parse");
const { createReadStream } = require("fs");

const habitableList = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => isHabitable(data) && habitableList.push(data))
  .on("end", () => {
    console.log(
      habitableList.map(({ kepler_name }) => kepler_name),
      `\n${habitableList.length} habitable planets found!!!`
    );
    console.log("Data parsed successfully");
  })
  .on("error", (err) => console.error(err.message));
