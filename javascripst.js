const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countiesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const path = d3.geoPath();
const colorScale = d3.scaleThreshold()
  .domain([10, 20, 30, 40])
  .range(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3", "#4a1486"]);

Promise.all([
  d3.json(countiesURL),
  d3.json(educationURL)
]).then(([us, education]) => {
  const educationMap = new Map(education.map(d => [d.fips, d]));

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
    .attr("class", "county")
    .attr("d", path)
    .attr("data-fips", d => d.id)
    .attr("data-education", d => educationMap.get(d.id)?.bachelorsOrHigher || 0)
    .attr("fill", d => {
      const edu = educationMap.get(d.id)?.bachelorsOrHigher || 0;
      return colorScale(edu);
    })
    .on("mouseover", function (event, d) {
      const edu = educationMap.get(d.id);
      tooltip
        .style("opacity", 0.9)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`)
        .attr("data-education", edu?.bachelorsOrHigher || 0)
        .html(`
          <strong>${edu?.area_name}, ${edu?.state}</strong><br>
          ${edu?.bachelorsOrHigher}% con educación universitaria
        `);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  // Leyenda
  const legend = d3.select("#legend");

  const legendScale = [0, 10, 20, 30, 40];
  const legendColors = colorScale.range();

  legend.selectAll("div")
    .data(legendColors)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .style("background-color", d => d);
});