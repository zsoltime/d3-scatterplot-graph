import * as d3 from 'd3';
import 'styles';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

function visualize(data) {}

d3.json(url, (err, data) => {
  if (err) throw err;
  visualize(data);
});
