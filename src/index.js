import * as d3 from 'd3';
import 'styles';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

function visualize(data) {
  const margins = {
    top: 10,
    right: 75,
    bottom: 20,
    left: 40,
  };
  const canvasWidth = 800;
  const canvasHeight = 400;
  const width = canvasWidth - margins.right - margins.left;
  const height = canvasHeight - margins.top - margins.bottom;
  const formatTime = d3.timeFormat('%M:%S');
  const offsetInSeconds = data[0].Seconds;

  // create svg canvas
  const svg = d3.select('#graph')
    .append('svg')
      .attr('class', 'graph')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  const graph = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // set ranges and scale the range of data
  const scaleX = d3.scaleTime()
    .domain([
      d3.max(data, d => (d.Seconds - offsetInSeconds) * 1000) + 5000,
      0,
    ])
    .rangeRound([0, width]);

  const scaleY = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Place))
    .range([height, 0]);

  // define axes
  const axisX = d3.axisBottom(scaleX)
    .tickFormat(formatTime)
    .ticks(12);
  const axisY = d3.axisLeft(scaleY)
    .ticks(10);

  // add x axis
  graph.append('g')
    .attr('class', 'graph__axis graph__axis--x')
    .attr('transform', `translate(0, ${height})`)
    .call(axisX)
    .append('text')
      .attr('class', 'graph__label')
      .attr('transform', `translate(${width}, ${-margins.bottom})`)
      .attr('dy', '0.875em')
      .attr('text-anchor', 'end')
      .text('Time behined #1');

  // add y axis
  graph.append('g')
    .attr('class', 'graph__axis graph__axis--y')
    .call(axisY)
    .append('text')
      .attr('class', 'graph__label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .text('Place');
}

d3.json(url, (err, data) => {
  if (err) throw err;
  visualize(data);
});
