// Configuración del SVG
const width = 960;
const height = 600;
const margin = {top: 60, right: 20, bottom: 20, left: 20};

// Crear SVG principal
const svg = d3.select("#visualization")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height]);

// URL de los datos
const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const url2 = " https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json ";