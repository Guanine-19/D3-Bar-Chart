document.addEventListener("DOMContentLoaded",
   fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response =>{return response.json()})
      .then(data => {
         const dataset = data.data;
         const w = 1000;
         const h = 500;
         const padding = 80;
         const rw = w/dataset.length;

         var yearsDate = dataset.map((d)=>new Date(d[0]));

         var tooltip = d3.select("#chart").append("div")
         .attr("id", "tooltip")
         .style("opacity", 0);

         var overlay = d3.select('#chart').append('div')
         .attr('class', 'overlay')
         .style('opacity', 0);

         const xScale = d3.scaleTime()
                        .domain([d3.min(yearsDate), d3.max(yearsDate)])
                        .range([padding, w - padding]);

         const yScale = d3.scaleLinear()
                           .domain([0, d3.max(dataset, (d) => d[1])])
                           .range([0, h - padding - padding]);

         const yAxisScale = d3.scaleLinear()
                           .domain([0, d3.max(dataset, (d) => d[1])])
                           .range([h - padding , padding]);

         const xAxis = d3.axisBottom()
                         .scale(xScale);

         const yAxis = d3.axisLeft(yAxisScale)

         const svg = d3.select("#chart")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

         svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x",(d, i) => xScale(yearsDate[i]))
            .attr("y",(d, i) => h - padding - yScale(d[1]))
            .attr("width",rw)
            .attr("height",(d)=> yScale(d[1]))
            .attr("data-date",(d)=>d[0])
            .attr("data-gdp",(d)=>d[1])
            .attr("class","bar")
            .on('mouseover', function(d, i) {
               overlay.transition()
                 .duration(0)
                 .style('height', d + 'px')
                 .style('width', rw + 'px')
                 .style('opacity', .9)
                 .style('left', (i * rw) + 0 + 'px')
                 .style('top', h - d + 'px')
                 .style('transform', 'translateX(60px)');
               tooltip.transition()
                 .duration(200)
                 .style('opacity', .9);
               tooltip.html(yearsDate[i].getFullYear() + '<br>' + '$' + dataset[i][1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
                 .attr('data-date', dataset[i][0])
                 .style('left', (i * rw) + 30 + 'px')
                 .style('top', h - padding + 'px')
                 .style('transform', 'translateX(60px)');
             })
             .on('mouseout', function(d) {
               tooltip.transition()
                 .duration(200)
                 .style('opacity', 0);
               overlay.transition()
                 .duration(200)
                 .style('opacity', 0);
             });

         svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .attr("id","x-axis")
            .attr("class","tick")
            .call(xAxis);

         svg.append("g")
            .attr("transform", "translate(" + padding +",0)")
            .attr("id","y-axis")
            .attr("class","tick")
            .call(yAxis);

         svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -250)
            .attr('y', 100)
            .attr("class","source")
            .text('Gross Domestic Product');

         svg.append('text')
            .attr('x', w/2)
            .attr('y', h-30)
            .attr("class","source")
            .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf');
         
      })
      .catch(err => {
         console.log("Can't find json data"+err)
         window.alert("Can't load data"+err)
      })
)