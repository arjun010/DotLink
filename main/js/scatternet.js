//-----------------------------------------------------
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var scatterNetData = [];
var scatterNetLinks = [];

var companies = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "data/companies.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var alliances = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "data/alliances.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
//scatterNetData.push({"name":"","highPrice":0,"allianceCount":0,"expanded":"false"});
////console.log(companies);


function searchNode() {
    //find the node
    //console.log("here");
    var selectedVal = document.getElementById('search').value;
    var allNodesOnScreen ;
    console.log(selectedVal);
    if (selectedVal=="") {
      allNodesOnScreen = d3.selectAll(".dot")
        .each(function(d) {
           d3.select(this).attr("fill",function(d){
              if(d.expanded=="true"){
                return "#4747D1";
            }else{
                return "#77777E";
            }
       
            });
    });
    }
    else{
    var selectedNode;
    allNodesOnScreen = d3.selectAll(".dot")
    .each(function(d) {
      if(d.name!="" && d.name.toLowerCase().indexOf(selectedVal) > -1)
      {
        d3.select(this).attr("fill","red");
      }
      else{
          d3.select(this).attr("fill",function(d){
           if(d.expanded=="true"){
                return "#4747D1";
            }else{
                return "#77777E";
            }
            });
      }
    });
    }
    
}

function showCompanyInfo(forCompany){
  for(var i=0;i<companies.length;i++){
    if(forCompany==companies[i]['name']){
      $("#companyName").text(forCompany);
      $("#companyAllianceCount").text(companies[i]['allianceCount']);
    }
  }
}

function updateNetworkInfo(){
  $("#networknodecount").text(scatterNetData.length);
  $("#networkalliancecount").text(scatterNetLinks.length);
}

function isReversedLink(curLink){
    for (var i =0; i<scatterNetLinks.length;i++){
        if(curLink['source']==scatterNetLinks[i]['target'] && curLink['target']==scatterNetLinks[i]['source']){
            return 1;
        }
    }
    return 0;
}

function getPartners(forCompany){
  var partners = [];
  for (var i =0 ;i<alliances.length; i++){
    if(alliances[i]['company1']==forCompany){
      partners.push(alliances[i]['company2']);
    }else if(alliances[i]['company2']==forCompany){
      partners.push(alliances[i]['company1']);
    }
  }
  return partners;
}

function companyExistsInNodes(companyName){
    for(var i=0 ; i<scatterNetData.length;i++){
        if(companyName==scatterNetData[i]['name']){
            ////console.log("found")
            return i;
            break;
        }
    }
    return -1;
}

function isExpanded(forCompany){
  for(var i =0; i<scatterNetData.length; i++){
    if(scatterNetData[i]['name']==forCompany){
      if(scatterNetData[i]['expanded']=="true"){
        return 1;
      }
    }
  }
  return 0;
}


function addNewCompanyToScatterNet(){
    ////console.log(companies);
    var companyToAdd = document.getElementById("newCompany").value;
    for(var i =0; i<companies.length;i++){
        if(companies[i]['name']==companyToAdd){
            if(companyExistsInNodes(companyToAdd)==-1){
                scatterNetData.push({"name":companies[i]['name'],"highPrice":companies[i]['highPrice'],"allianceCount":companies[i]['allianceCount'],"companySize":companies[i]['companySize'],"expanded":"false","selected":"false"});
            }
        }
    }
    var sourceVal,targetVal;
    var partnerCompanies=getPartners(companyToAdd);
    //console.log("partners");
    //console.log(partnerCompanies);
    for(var i=0;i<partnerCompanies.length;i++){
        for(var j=0; j<scatterNetData.length;j++){
            //console.log("checking: "+scatterNetData[j]['name']);
            if(partnerCompanies[i]==scatterNetData[j]['name']){//partner company exists on screen
                sourceVal = companyExistsInNodes(companyToAdd);
                targetVal = companyExistsInNodes(scatterNetData[j]['name']);
                if(isReversedLink(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'))==0){
                    scatterNetLinks.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
                }
            }
        }
    }
    //console.log("nodes");
    //console.log(scatterNetData);
    //console.log("links");
    //console.log(scatterNetLinks);
    //just to make sure new nodes added are also linked to others on screen
    for(var i=0;i<scatterNetData.length;i++){
        for(var j=0;j<scatterNetData.length;j++){
            for(var k=0;k<alliances.length;k++){
                if((alliances[k]['company1']==scatterNetData[i]['name'] && alliances[k]['company2']==scatterNetData[j]['name']) || (alliances[k]['company2']==scatterNetData[i]['name'] && alliances[k]['company1']==scatterNetData[j]['name'])){
                   sourceVal=companyExistsInNodes(scatterNetData[i]['name']);
                   targetVal=companyExistsInNodes(scatterNetData[j]['name']);
                   if(isReversedLink(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'))==0){
                        scatterNetLinks.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
                    }
                }
            }
        }
    }

$("#newCompany > option").each(function() {
    //alert(this.text + ' ' + this.value);
    for(var i=0;i<scatterNetData.length;i++){
        if(this.text==scatterNetData[i]['name']){
            //$(this).find('value:'+this.text).css('background-color', 'red');
            //$(this).css('background-color', '#81DAF5');
            $(this).css('color', '#c3c3c3');
        }
    }
});    
    showScatterPlot();
    
}

function addPartners(forCompany,callback){
    var targetVal, addedCompany ;
    var partnerCompanies=getPartners(forCompany);
    var partnerCompany;
    //console.log("partnerCompanies");
    //console.log(partnerCompanies);
    for(var i =0 ; i<scatterNetData.length; i++){
      if(scatterNetData[i]['name']==forCompany){
        scatterNetData[i]['expanded']="true";
      }
    }
    var sourceVal,targetVal;

    for(var i=0;i<partnerCompanies.length;i++){
        for(var j =0;j<companies.length;j++){
            if(companies[j]['name']==partnerCompanies[i]){
                if(companyExistsInNodes(companies[j]['name'])==-1){
                    scatterNetData.push({"name":companies[j]['name'],"highPrice":companies[j]['highPrice'],"allianceCount":companies[j]['allianceCount'],"companySize":companies[j]['companySize'],"expanded":"false","selected":"false"});                
                    sourceVal = companyExistsInNodes(forCompany);
                    targetVal = companyExistsInNodes(companies[j]['name']);
                    if(isReversedLink(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'))==0){
                        scatterNetLinks.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
                    }
                }else{
                    sourceVal = companyExistsInNodes(forCompany);
                    targetVal = companyExistsInNodes(companies[j]['name']);
                    if(isReversedLink(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'))==0){
                        scatterNetLinks.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
                    }
                }
            }
        }
    }
    //console.log("In addPartners()");
    //console.log("nodes");
    //console.log(scatterNetData);
    //console.log("links");
    //console.log(scatterNetLinks);
    //just to make sure new nodes added are also linked to others on screen
    for(var i=0;i<scatterNetData.length;i++){
        for(var j=0;j<scatterNetData.length;j++){
            for(var k=0;k<alliances.length;k++){
                if((alliances[k]['company1']==scatterNetData[i]['name'] && alliances[k]['company2']==scatterNetData[j]['name']) || (alliances[k]['company2']==scatterNetData[i]['name'] && alliances[k]['company1']==scatterNetData[j]['name'])){
                   sourceVal=companyExistsInNodes(scatterNetData[i]['name']);
                   targetVal=companyExistsInNodes(scatterNetData[j]['name']);
                   if(isReversedLink(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'))==0){
                        scatterNetLinks.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
                    }
                }
            }
        }
    }

$("#newCompany > option").each(function() {
    //alert(this.text + ' ' + this.value);
    for(var i=0;i<scatterNetData.length;i++){
        if(this.text==scatterNetData[i]['name']){
            //$(this).find('value:'+this.text).css('background-color', 'red');
            //$(this).css('background-color', '#81DAF5');
            $(this).css('color', '#c3c3c3');
        }
    }
});

    showScatterPlot();
    callback.call(this);
}

//-----------------------------------------------------

var linkedByIndex = {};

function neighboring(a, b) {
return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}
    
function mouseover(d) {
    
      /*
      d3.selectAll(".node")
        .append("g")
        .append("text")
        .attr("fill","black")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("style", "font-size: 16; font-weight:bold;")
        .text(function(o) { return neighboring(d, o) ? o.name : ""; });
    */
      /*
      d3.select(this).append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
    */

}


// call the method below to draw scatterNet

function showScatterPlot() {
    console.log(scatterNetLinks);
    updateNetworkInfo();
    d3.select("svg")
      .remove();
    // just to have some space around items. 
    var margins = {
            "left": 60,
            "right": 15,
            "top": 30,
            "bottom": 30
    };

    var xAxisVal=document.getElementById("xAxis").value;
    var yAxisVal=document.getElementById("yAxis").value;
    var width = document.getElementById("viz").offsetWidth;
    var height = document.getElementById("viz").offsetHeight;
    
    // this will be our colour scale. An Ordinal scale.
    var colors = d3.scale.category10();

    // we add the SVG component to the scatter-load div
    var svg = d3.select("#viz").append("svg").attr("width", "100%").attr("height", height).append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // this sets the scale that we're using for the X axis. 
    // the domain define the min and max variables to show. In this case, it's the min and max highPrices of items.
    // this is made a compact piece of code due to d3.extent which gives back the max and min of the highPrice variable within the dataset
    var x = d3.scale.linear()
        .domain(d3.extent(scatterNetData, function (d) {
        if(document.getElementById("xAxis").value=="allianceCount"){
                return d.allianceCount;
        }else if(document.getElementById("xAxis").value=="highPrice"){
                return d.highPrice;
        }else if(document.getElementById("xAxis").value=="companySize"){
                return d.companySize;
        }
    }))
    // the range maps the domain to values from 0 to the width minus the left and right margins (used to space out the visualization)
        .range([0, width - margins.left - margins.right]);

    // this does the same as for the y axis but maps from the allianceCount variable to the height to 0. 
    var y = d3.scale.linear()
        .domain(d3.extent(scatterNetData, function (d) {
        if(document.getElementById("yAxis").value=="allianceCount"){
                return d.allianceCount;
        }else if(document.getElementById("yAxis").value=="highPrice"){
                return d.highPrice;
        }else if(document.getElementById("yAxis").value=="companySize"){
                return d.companySize;
        }
    }))
    // Note that height goes first due to the weird SVG coordinate system
    .range([height - margins.top - margins.bottom, 0]);

    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "x_axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "y_axis");

    // this is our X axis label. Nothing too special to see here.
    /*svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height - 35)
        .text(document.getElementById("xAxis").value);
    */

    // this is the actual definition of our x and y axes. The orientation refers to where the labels appear - for the x axis, below or above the line, and for the y axis, left or right of the line. Tick padding refers to how much space between the tick and the label. There are other parameters too - see https://github.com/mbostock/d3/wiki/SVG-Axes for more information
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    // this is where we select the axis we created a few lines earlier. See how we select the axis item. in our svg we appended a g element with a x/y and axis class. To pull that back up, we do this svg select, then 'call' the appropriate axis object for rendering.    
    svg.selectAll("g.y_axis").call(yAxis);
    svg.selectAll("g.x_axis").call(xAxis);

    // now, we can get down to the data part, and drawing stuff. We are telling D3 that all nodes (g elements with class node) will have data attached to them. The 'key' we use (to let D3 know the uniqueness of items) will be the name. Not usually a great key, but fine for this example.
    var node = svg.selectAll("g.node").data(scatterNetData, function (d) {
        return d.name;
    });

    // we 'enter' the data, making the SVG group (to contain a circle and text) with a class node. This corresponds with what we told the data it should be above.
    
    var link;

    var nodeGroup = node.enter().append("g").attr("class", "node")
    // this is how we set the position of the items. Translate is an incredibly useful function for rotating and positioning items 
    .attr('transform', function (d) {
        return "translate(" + x(d[xAxisVal]) + "," + y(d[yAxisVal]) + ")";
        //return "translate(" + x(d.highPrice) + "," + y(d.allianceCount) + ")";
    })
    .on("click",function(d){
        for(var i=0;i<scatterNetData.length;i++){
    scatterNetData[i]['selected']="false";
    if(scatterNetData[i]['name']==d.name){
      scatterNetData[i]['selected']="true";
    }
  }
  d3.selectAll(".dot")
    .attr("stroke",function(i){ 
      if(i.selected=="true") return "orange";
    })
    .attr("stroke-width",function(i){ 
      if(i.selected=="true") return "1";
    });

    showCompanyInfo(d.name);

    })// end of click
    .on("dblclick",function(d){
        $('#viz').fadeOut();
        $('#spinner').fadeIn(function(){
        addPartners(d.name,function() {
            $('#spinner').fadeOut();
        });
        
      });$('#viz').fadeIn();}
    )
    .on("mouseover",function(d){ //MOUSEOVER behavior
       //console.log("mouseover"); 
      var selectedCompanyIndex=companyExistsInNodes(d.name);
/*
      link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1",function(d){
        if(d.source==selectedCompanyIndex || d.target==selectedCompanyIndex)
            {return x(data[d.source].highPrice);}
      }).attr("y1",function(d){
        if(d.source==selectedCompanyIndex || d.target==selectedCompanyIndex)
        {return y(data[d.source].allianceCount);}
      }).attr("x2",function(d){
        if(d.source==selectedCompanyIndex || d.target==selectedCompanyIndex)
        {return x(data[d.target].highPrice);}
      }).attr("y2",function(d){
        if(d.source==selectedCompanyIndex || d.target==selectedCompanyIndex)
        {return y(data[d.target].allianceCount);}
      });*/
link = svg.selectAll(".link")
      .data(scatterNetLinks)
      .enter()
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "link");


link.attr("d", function(d) {
    if(d.source==selectedCompanyIndex || d.target==selectedCompanyIndex){
        var dx = x(scatterNetData[d.target][xAxisVal]) - x(scatterNetData[d.source][xAxisVal]),
            dy = x(scatterNetData[d.target][yAxisVal]) - y(scatterNetData[d.source][yAxisVal]),
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            x(scatterNetData[d.source][xAxisVal]) + "," + 
            y(scatterNetData[d.source][yAxisVal]) + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            x(scatterNetData[d.target][xAxisVal]) + "," + 
            y(scatterNetData[d.target][yAxisVal]);
    }
    });
    
d3.selectAll(".dot")
.style("opacity", function(i) {
           if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1){
             return 1;
           }else{
                return 0.2;
           }
        })
.attr("fill",function(i) {
           if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1){
             return "orange";
           }
       });

nodeGroup.append("text")
        .attr("class","tempLabel")
        .style("text-anchor", "middle")
        .attr("dy", -10)
        .text(function (i) {
            if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1){
             return i.name;
           }else{
                return "";
           }
    });

    })
    .on("mouseout",function(){
        //console.log("mouseout");
        d3.selectAll(".link").remove();
        
        d3.selectAll(".dot").style("opacity","0.6");

        d3.selectAll(".tempLabel").remove();
        
        d3.selectAll(".dot")
        .attr("fill",function(d){
            if(d.expanded=="true"){
                return "#4747D1";
            }else{
                return "#77777E";
            }
        });
    });

    // we add our first graphics element! A circle!     
    nodeGroup.append("circle")
        .attr("r", "4")//function(d){return d.allianceCount/2;})
        .attr("class", "dot")
        .attr("fill",function(d){
            if(d.expanded=="true"){
                return "#4747D1";
            }else{
                return "#77777E";
            }
        })
        .append("title") // THIS IS THE PROPERTY WHICH adds the TOOLTIP 
               .text(function(d){
                    return " "+document.getElementById("xAxis").value+": " +d[document.getElementById("xAxis").value] + "," + " "+document.getElementById("yAxis").value+": " +d[document.getElementById("yAxis").value];
               });

    d3.selectAll(".node")
  .append("text")
  .attr("class",function(d){
          if(isExpanded(d.name)==1){
            return "fixedLabel";
          }})
  .attr("fill","black")
  .style("text-anchor", "middle")
  .attr("dy", -10)
  .text(function(d){if(isExpanded(d.name)){return d.name;}});
}