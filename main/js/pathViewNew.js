var firstTime =1;
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


var nodes = [];
var links = [];

function getCompanyType(companyName){
  for(var i=0;i<companies.length;i++){
    if(companies[i]['name']==companyName){
      return companies[i]['type'];
    }
  }
  console.log("company type not found!");
}

function companyExistsInNodes(companyName){
    for(var i=0 ; i<nodes.length;i++){
        if(companyName==nodes[i]['name']){
            //console.log("found")
            return i;
            break;
        }
    }
    return -1;
}

function addNewNode(){
    var companyToAdd = document.getElementById("newCompany");
    if(companyExistsInNodes(companyToAdd.value)==-1){
        nodes.push(JSON.parse('{"name":"'+companyToAdd.value+'", "expanded":"false","selected":"false","type":"'+getCompanyType(companyToAdd.value)+'"}'));
        var sourceVal,targetVal;
        for(var i = 0; i < alliances.length; i++){
            // to check if the new company is a target node for any alliance
            if(alliances[i]['company2']==companyToAdd.value){
                sourceVal = companyExistsInNodes(alliances[i]['company1']);
                targetVal = companyExistsInNodes(alliances[i]['company2']);
                if(sourceVal!=-1){
                    links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
                }
            }// to check if the new company is a source node for any of the existing companies
            else if(alliances[i]['company1']==companyToAdd.value){
                sourceVal = companyExistsInNodes(alliances[i]['company1']);
                targetVal = companyExistsInNodes(alliances[i]['company2']);
                if(targetVal!=-1){
                    links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));   
                }
            }
        }
        
    } 
    //console.log(nodes);
    //console.log(links);  
    /*console.log("type of nodes:" + typeof(nodes));
    setTimeout(function(){
      document.getElementById("myP").style.visibility="hidden";
      drawStuff();},5000);
      
document.getElementById("myP").style.visibility="visible";*/
//firstTime=0;
$("#newCompany > option").each(function() {
    //alert(this.text + ' ' + this.value);
    for(var i=0;i<nodes.length;i++){
        if(this.text==nodes[i]['name']){
            //$(this).find('value:'+this.text).css('background-color', 'red');
            //$(this).css('background-color', '#81DAF5');
             $(this).css('color', '#c3c3c3');
        }
    }
});

drawStuff();
}

function addPartners(forCompany){
    var targetVal, addedCompany ;
    var partnerCompany;

    for(var i =0 ; i<nodes.length; i++){
      if(nodes[i]['name']==forCompany){
        nodes[i]['expanded']="true";
      }
    }


    for (var i = 0; i < alliances.length; i++) {
        if(alliances[i]['company1']==forCompany){
            sourceVal = companyExistsInNodes(alliances[i]['company1']);
            targetVal = companyExistsInNodes(alliances[i]['company2']);
            if(targetVal==-1){
                nodes.push(JSON.parse('{"name":"'+alliances[i]['company2']+'", "expanded":"false","selected":"false","type":"'+getCompanyType(alliances[i]['company2'])+'"}'));
                targetVal = companyExistsInNodes(alliances[i]['company2']);
                links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
            }
            else{
                links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));   
            }
        }else if(alliances[i]['company2']==forCompany){
          partnerCompany = alliances[i]['company1'];
          targetVal = companyExistsInNodes(alliances[i]['company2']);
          sourceVal = companyExistsInNodes(alliances[i]['company1']);
          if(sourceVal==-1){
                nodes.push(JSON.parse('{"name":"'+alliances[i]['company1']+'", "expanded":"false","selected":"false","type":"'+getCompanyType(alliances[i]['company1'])+'"}'));
                sourceVal = companyExistsInNodes(alliances[i]['company1']);
                links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
            }
            else{
                links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));   
            }

        }
    }
   // console.log(nodes);
    console.log("in addPartners()");
   // console.log("nodes: " + JSON.stringify(nodes));

/*    setTimeout(function(){
      document.getElementById("myP").style.visibility="hidden";
      drawStuff();},5000);
      
document.getElementById("myP").style.visibility="visible";
*/
//console.log(firstTime);
$("#newCompany > option").each(function() {
    //alert(this.text + ' ' + this.value);
    for(var i=0;i<nodes.length;i++){
        if(this.text==nodes[i]['name']){
            //$(this).find('value:'+this.text).css('background-color', 'red');
            //$(this).css('background-color', '#81DAF5');
             $(this).css('color', '#c3c3c3');
        }
    }
});
drawStuff();
}

function removePartners(forCompany){
  console.log("In removePartners()");
  console.log("forCompany: "+forCompany);

  for(var i =0 ; i<nodes.length; i++){
    if(nodes[i]['name']==forCompany){
      nodes[i]['expanded']="false";
    }
  }
 // console.log("nodes before delete: " + JSON.stringify(nodes));


  var partners = getPartners(forCompany);
  console.log(partners);
  //removing links
  for(var i =0 ;i<partners.length;i++){
     for(var j=0; j<links.length;j++){
       if(links[j]['source']['name']==partners[i] && links[j]['target']['name']==forCompany){
          //console.log("company: "+ links[j]['source']['name'] + " hasLinksOnScreen: "+hasLinksOnScreen(links[j]['source']['name']));
          if(!hasAnyOtherLinksOnScreen(links[j]['source']['name'],forCompany)){
            console.log("removing link: " + JSON.stringify(links[j]));
            links.splice(j,1);
          }
    }
    else if(links[j]['target']['name']==partners[i] && links[j]['source']['name']==forCompany){
          //console.log("company: "+ links[j]['target']['name'] + " hasLinksOnScreen: "+hasLinksOnScreen(links[j]['target']['name']));
          if(!hasAnyOtherLinksOnScreen(links[j]['target']['name'],forCompany)){
            console.log("removing link: " + JSON.stringify(links[j]));
            links.splice(j,1);
          }
    }
     }
  }

  //removing nodes
  for(var i =0; i<partners.length; i++){
    for(var j=0; j<nodes.length;j++){
      if(nodes[j]['name']==partners[i] && nodes[j]['expanded']=="false" && !hasLinksOnScreen(nodes[j]['name'])){
        nodes.splice(j,1);
      }
    }
  }

 // console.log("nodes after delete: " + JSON.stringify(nodes));
/*
    setTimeout(function(){
      document.getElementById("myP").style.visibility="hidden";
      drawStuff();},5000); 
document.getElementById("myP").style.visibility="visible";  */
$("#newCompany > option").each(function() {
    //alert(this.text + ' ' + this.value);
    for(var i=0;i<nodes.length;i++){
        if(this.text==nodes[i]['name']){
            //$(this).find('value:'+this.text).css('background-color', 'red');
            //$(this).css('background-color', '#81DAF5');
             $(this).css('color', '#c3c3c3');
        }
    }
});
drawStuff();
}

function hasLinksOnScreen(forCompany){
  //console.log("in hasLinksOnScreen():");
  for(var i =0 ; i<links.length; i++){
    if(links[i]['source']['name']==forCompany || links[i]['target']['name']==forCompany){
      return true;
    }
  }
  return false;
}

function hasAnyOtherLinksOnScreen(forCompany,exceptCompany){
  for(var i =0 ; i<links.length;i++){
    if(links[i]['source']['name']==forCompany ){
      if(links[i]['target']['name']!=exceptCompany){
        return true;
      }
    }else if(links[i]['target']['name']==forCompany){
      if(links[i]['source']['name']!=exceptCompany){
        return true;
      }
    }
  }
  return false;
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

function isExpanded(forCompany){
  for(var i =0; i<nodes.length; i++){
    if(nodes[i]['name']==forCompany){
      if(nodes[i]['expanded']=="true"){
        return 1;
      }
    }
  }
  return 0;
}

function getNumberOfAlliances(forCompany){
  var count = 0;
  for(var i = 0; i < alliances.length; i++){
    if(alliances[i]['company1']==forCompany || alliances[i]['company2']==forCompany){
      count+=1;
    }
  }
  return count;
}

var linkedByIndex = {};

function neighboring(a, b) {
return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}
    
function mouseover(d) {

      d3.selectAll(".link").transition().duration(500)
        //.style("opacity", function(o) {
        //return o.source === d || o.target === d ? 1 : 0.5;
        .style("stroke", function(o) {
          return o.source === d || o.target === d ? "red" : "#ccc";
      }).style("opacity", function(o) {
           return o.source === d || o.target === d ? 1 : 0.4;
        });
      
      d3.selectAll(".node").transition().duration(500)
        .style("opacity", function(o) {
           return neighboring(d, o) ? 1 : 0.6;
        });
      
      d3.selectAll(".node")
        .append("text")
        .attr("fill","black")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("style", "font-size: 10; font-family:sans-serif;")
        .text(function(o) { return neighboring(d, o) ? o.name : ""; });

      /*
      d3.select(this).append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
    */

}

function mouseout(d) {
  /*d3.selectAll(".link").transition().duration(500)
        .style("opacity", 1);
  */
  d3.selectAll(".link").transition().duration(500)
        .style("stroke", "#ccc");
  d3.selectAll(".node").transition().duration(500)
        .style("opacity", 1);
  
  d3.selectAll("text").remove();
}

function mouseClick(d){
  console.log("NOW I'M CLICKED!");
  for(var i=0;i<nodes.length;i++){
    nodes[i]['selected']="false";
    if(nodes[i]['name']==d.name){
      nodes[i]['selected']="true";
    }
  }
  d3.selectAll("circle")
    .attr("stroke",function(i){ 
      if(i.selected=="true") return "orange";
      else return "black";
    })
    .attr("stroke-width",function(i){ 
      if(i.selected=="true") return "1";
      else return "1";
    });
  /*
  d3.selectAll("circle")
    .attr("stroke",function(i){ 
      if(d.name==i.name) return "orange";
      else return "black";
    })
    .attr("stroke-width",function(i){ 
      if(d.name==i.name) return "4";
      else return "2";
    });
  */
}

function clearSelections(){
  for(var i=0;i<nodes.length;i++){
    nodes[i]['selected']="false";
  }
  drawStuff();
}

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  prevScale=d3.event.scale;
  prevTranslate=d3.event.translate;
}
function dragstarted(d) {
  console.log("dragstarted");
  //force.start();
  
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
  //force.start();
 
}

function dragged(d) {
  console.log("DRAGGED");
  d.fixed=false;
  d3.timer(force.resume);
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  //tick();
}

function dragended(d) {
  console.log("dragended");
  d.fixed=true;
  d3.select(this).classed("dragging", false);
  /*.call(force.drag().origin(function() {
    var t = d3.transform(d3.select(this).attr("transform")).translate;
    return {x: t[0], y: t[1]}
  }));*/

  
  /*.call(force.drag().origin(function() {
    var t = d3.transform(d3.select(this).attr("transform")).translate;
    return {x: t[0], y: t[1]}
  }));*/
  //tick();
}


if(firstTime==1){
  var force = d3.layout.force()
    .gravity(0)
    .distance(250)
    .charge(-100)
    .size([document.getElementById("mainContent").offsetWidth, $(document).height()]);
}
var container;
var prevTranslate = [0,0];
var prevScale = 0; 
var zoom = d3.behavior.zoom()
    .scaleExtent([0.5, 50])
    .on("zoom", zoomed);

function drawStuff() {
  console.log(firstTime);
if(firstTime==0){
  force.stop();
}
d3.selectAll("svg").remove(); 




var svgWidth=document.getElementById("viz").offsetWidth;
var svgHeight=document.getElementById("viz").offsetHeight;
//var width = 1380;
//    height = 860;


    

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

var svg = d3.select("#viz").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .call(zoom).on("dblclick.zoom", null);
/*
svg.on("contextmenu",function(d){
         d3.event.preventDefault();
         clearSelections();
      });
*/

container = svg.append("g");
if(prevTranslate!=[0,0] && prevScale!=0){
  container.attr("transform", "translate(" + prevTranslate + ")scale(" + prevScale + ")");  
}

force.nodes(nodes)
      .links(links)
      .start();

  var link = container.selectAll(".link")
      .data(links)
      .enter()
      .append("line").attr("class","link");
      /*.append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "link");*/
      
      links.forEach(function(d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
          linkedByIndex[d.target.index + "," + d.source.index] = 1;
        });


  var node = container.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .on("mouseover", mouseover)
      //.on("click", mouseover)
      .on("click", mouseClick)
      .on("mouseout", mouseout)
      .attr("fill",function(d){
        return isExpanded(d.name)==1? "#4747D1" : "#77777E";//"#F5F5F0";
      })
      //.call(force.drag);
      .call(drag);


  node.append("circle")
      .attr("r", "4")
      //.attr("r", function(d){return (getNumberOfAlliances(d.name)) ;})
      .attr("stroke","black")
      .attr("stroke-width","1")
      .on("dblclick", function(d){
        isExpanded(d.name)==1?removePartners(d.name):addPartners(d.name);
       });



  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    /*   
        link.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
    });*/
  
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
  
  if(firstTime==1){
    firstTime=0;
  }
}