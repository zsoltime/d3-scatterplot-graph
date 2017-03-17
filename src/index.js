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
  const canvasHeight = 500;
  const width = canvasWidth - margins.right - margins.left;
  const height = canvasHeight - margins.top - margins.bottom;
  const formatTime = d3.timeFormat('%M:%S');
  const offsetInSeconds = data[0].Seconds;
  const extendX = 4 * 1000;
  const extendY = 1;

  // create svg canvas
  const svg = d3.select('#graph')
    .append('svg')
      .attr('class', 'graph')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  const graph = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // add the tooltip
  const tooltip = d3.select('#graph')
    .append('div')
      .attr('class', 'tooltip');

  // set ranges and scale the range of data
  const scaleX = d3.scaleTime()
    .domain([
      d3.max(data, d => (d.Seconds - offsetInSeconds) * 1000) + extendX,
      0,
    ])
    .rangeRound([0, width]);

  const scaleY = d3.scaleLinear()
    .domain([
      d3.max(data, d => d.Place) + extendY,
      0,
    ])
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

  // add the circles
  const circles = graph.append('g')
    .attr('class', 'graph__circles')
    .selectAll('.graph__circle')
    .data(data)
    .enter();

  circles.append('circle')
    .attr('class', d => (
      d.Doping ?
      'graph__circle graph__circle--doping' :
      'graph__circle'))
    .attr('r', 7)
    .attr('cx', d => scaleX((d.Seconds - offsetInSeconds) * 1000))
    .attr('cy', d => scaleY(d.Place))
    .on('mouseover', (d) => {
      const html = `
      <p class="tooltip__header">
        <span class="name">${d.Name}</span>
        <span class="country">${d.Nationality}</span>
        <span class="year">${d.Year}</span>
        <span class="time">${d.Time}</span>
      </p>
      <p class="tooltip__footer">Doping: ${d.Doping || 'None'}</p>`;

      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      tooltip.html(html)
        .style('transform', 'translateY(0)');
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
      tooltip.html('')
        .style('transform', 'translateY(-100%)');
    });
  circles.append('text')
    .attr('class', 'graph__name')
    .attr('x', d => scaleX((d.Seconds - offsetInSeconds) * 1000) + 10)
    .attr('y', d => scaleY(d.Place) + 4)
    .text(d => d.Name);
}

d3.json(url, (err, data) => {
  if (err) throw err;
  visualize(data);
});
