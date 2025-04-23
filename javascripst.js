const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countiesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const path = d3.geoPath();
const colorScale = d3.scaleThreshold()
  .domain([10, 20, 30, 40, 50, 60])
  .range(["#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"]);

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
          ${edu?.bachelorsOrHigher}% が大学教育を受けた
        `);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

   // プロフェッショナルなSVG凡例
const legendWidth = 300;
const legendHeight = 10;
const legendColors = colorScale.range();
const legendThresholds = colorScale.domain();

const legendSvg = d3.select("#legend");

const xScale = d3.scaleLinear()
  .domain([d3.min(legendThresholds), d3.max(legendThresholds)])
  .range([0, legendWidth]);

// メイングループを作成
const legendGroup = legendSvg.append("g")
  .attr("transform", "translate(40,20)");

// カラーブロックを作成
legendGroup.selectAll("rect")
  .data(legendColors)
  .enter()
  .append("rect")
  .attr("x", (d, i) => xScale(legendThresholds[i] || 0))
  .attr("y", 0)
  .attr("width", (d, i) => {
    const next = legendThresholds[i + 1] || xScale.domain()[1];
    return xScale(next) - xScale(legendThresholds[i] || 0);
  })
  .attr("height", legendHeight)
  .attr("fill", d => d);

// 値付き軸
const xAxis = d3.axisBottom(xScale)
  .tickSize(13)
  .tickValues(legendThresholds)
  .tickFormat(d => d + "%");

legendGroup.append("g")
  .attr("transform", `translate(0,${legendHeight})`)
  .call(xAxis)
  .select(".domain")
  .remove();

});