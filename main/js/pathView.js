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

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}


var nodes = [];
var links = [];
var optArray = [];

function updateoptArr(){
for (var i = 0; i < nodes.length ; i++) {
    optArray.push(nodes[i].name);
}
optArray=unique(optArray.sort());
$(function(){
$("#search").autocomplete({
        source: optArray
});});
}


function searchNode() {
    //find the node
    //console.log("here");
    var selectedVal = document.getElementById('search').value.toLowerCase();
    var allNodesOnScreen ;
    //console.log(selectedVal);
    d3.selectAll(".searchLabel").remove();
    if (selectedVal=="") {
      allNodesOnScreen = d3.selectAll(".node")
    .each(function(d) {
          if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#088A08" : (d.type=="public"?"#4747D1":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#088A08" : (d.type=="public"?"#4747D1":"#FF8000");
            });
          }
          else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#4747D1" : "#77777E";
            });
          }
    });
    }
    else{
    var selectedNode;
    allNodesOnScreen = d3.selectAll(".node")
    .each(function(d) {
      if(d.name!="" && d.name.toLowerCase().indexOf(selectedVal) > -1)
      {
        d3.select(this).attr("fill","black").append("text")
        .attr("class","searchLabel")
        .attr("fill","black")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("style", "font-size: 10; font-family:sans-serif;")
        .text(function() { return d.name;});
      }
      else{
          if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#088A08" : (d.type=="public"?"#4747D1":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#088A08" : (d.type=="public"?"#4747D1":"#FF8000");
            });
          }else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#4747D1" : "#77777E";
            });
          }
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
  $("#networknodecount").text(nodes.length);
  $("#networkalliancecount").text(links.length);
}

function getCompanyType(companyName){
  for(var i=0;i<companies.length;i++){
    if(companies[i]['name']==companyName){
      return companies[i]['type'];
    }
  }
  //console.log("company type not found!");
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

function addNewNodeWithLoading(){
$('#spinner').fadeIn(function(){
        addNewNode(function() {
            $('#spinner').fadeOut();
        })
      });
$('#viz').fadeIn();
}


function getSector(forCompany){
  for (var i = 0; i < companies.length; i++){
    if(companies[i]['name']==forCompany){
      return companies[i]['sector'];
    }
  }
}

function getSectorColor(forCompany){
  for (var i = 0; i < companies.length; i++){
    if(companies[i]['name']==forCompany){
      return companies[i]['sectorColor'].toLowerCase();
    }
  }
}

function getSectorDesc(forCompany){
  for (var i = 0; i < companies.length; i++){
    if(companies[i]['name']==forCompany){
      return companies[i]['sectorDesc'];
    }
  }
}


function colorBasedOnSector(sectorColor){
  if (sectorColor=="red") {return "#DC3912"; }
  else if(sectorColor=="blue") {return "#3366CC";}
  else if(sectorColor=="orange") {return "#FF9900";}
  else if(sectorColor=="green") {return "#109618";}
  else if(sectorColor=="purple") {return "#990099";}
  else {return "#77777E";}
}

function colorLinkBasedOnNodes(node1Color,node2Color){
  if($('#coloring').val()=="bysector"){
    if(node1Color=="red"){//red and ...
      if(node2Color=="red"){// red and red
        return "#8B0707"; 
      }else if(node2Color=="blue"){//red and blue
        return "#465066";
      }else if(node2Color=="orange"){ // red and orange
        return "#B83D04";
      }else if(node2Color=="green"){ //red and green
        return "#4E4E10";
      }else if(node2Color=="purple"){ // red and purple
        return "#922650";
      }
      else{ // red and unknown
        return "#ccc";
      }
    }
    else if(node1Color=="blue"){//blue and ...
      if(node2Color=="red"){ // blue and red
        return "#465066";
      }else if(node2Color=="blue"){// blue and blue
        return "#0099C6";
      }else if(node2Color=="orange"){// blue and orange
        return "#738663";
      }else if(node2Color=="green"){// blue and green
        return "#08986F";
      }else if(node2Color=="purple"){// blue and purple
        return "#4C6EB0";
      }else{// blue and unknown
        return "#ccc";
      }
    }
    else if(node1Color=="orange"){//orange and ...
      if(node2Color=="red"){ // orange and red
        return "#B83D04"; 
      }else if(node2Color=="blue"){// orange and blue
        return "#738663";
      }else if(node2Color=="orange"){// orange and orange
        return "#E67300"; 
      }else if(node2Color=="green"){// orange and green
        return "#7B840C";
      }else if(node2Color=="purple"){// orange and purple
        return "#C05C4C";
      }else{// orange and unknown
        return "#ccc";
      }
    }
    else if(node1Color=="green"){//green and ...
      if(node2Color=="red"){// green and red
        return "#4E4E10";
      }else if(node2Color=="blue"){// green and blue
        return "#08986F";
      }else if(node2Color=="orange"){// green and orange
        return "#7B840C";
      }else if(node2Color=="green"){// green and green
        return "#109618";
      }else if(node2Color=="purple"){// green and purple
        return "#546D58";
      }else{// green and unknown
        return "#ccc";
      }
    }
    else if(node1Color=="purple"){//purple and ...
      if(node2Color=="red"){// purple and red
        return "#922650";
      }else if(node2Color=="blue"){// purple and blue
        return "#4C6EB0";
      }else if(node2Color=="orange"){// purple and orange
        return "#C05C4C";
      }else if(node2Color=="green"){// purple and green
        return "#546D58";
      }else if(node2Color=="purple"){// purple and purple
        return "#994499";
      }else{// purple and unknown
        return "#ccc";
      }
    }
    else{//safety condition
      return "#ccc";
    }
  }
  else{ // no coloring condition selected
    return "#ccc";
  }
}


function addNewNode(callback){
    var companyToAdd = document.getElementById("newCompany");
    if(companyExistsInNodes(companyToAdd.value)==-1){
        nodes.push(JSON.parse('{"name":"'+companyToAdd.value+'", "expanded":"false","selected":"false","type":"'+getCompanyType(companyToAdd.value)+'","sectorColor":"'+getSectorColor(companyToAdd.value)+'"}'));
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
updateoptArr();
drawStuff();
callback.call(this);
}

function addPartners(forCompany,callback){
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
                nodes.push(JSON.parse('{"name":"'+alliances[i]['company2']+'", "expanded":"false","selected":"false","type":"'+getCompanyType(alliances[i]['company2'])+'","sectorColor":"'+getSectorColor(alliances[i]['company2'])+'"}'));
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
                nodes.push(JSON.parse('{"name":"'+alliances[i]['company1']+'", "expanded":"false","selected":"false","type":"'+getCompanyType(alliances[i]['company1'])+'","sectorColor":"'+getSectorColor(alliances[i]['company1'])+'"}'));
                sourceVal = companyExistsInNodes(alliances[i]['company1']);
                links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));
            }
            else{
                links.push(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'));   
            }

        }
    }
    //console.log(nodes);
    //console.log("in addPartners()");
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


updateoptArr();
drawStuff();
callback.call(this);
}

function removePartners(forCompany,callback){
  //console.log("In removePartners()");
  //console.log("forCompany: "+forCompany);

  for(var i =0 ; i<nodes.length; i++){
    if(nodes[i]['name']==forCompany){
      nodes[i]['expanded']="false";
    }
  }
 // console.log("nodes before delete: " + JSON.stringify(nodes));


  var partners = getPartners(forCompany);
  //console.log(partners);
  //removing links
  for(var i =0 ;i<partners.length;i++){
     for(var j=0; j<links.length;j++){
       if(links[j]['source']['name']==partners[i] && links[j]['target']['name']==forCompany){
          //console.log("company: "+ links[j]['source']['name'] + " hasLinksOnScreen: "+hasLinksOnScreen(links[j]['source']['name']));
          if(!hasAnyOtherLinksOnScreen(links[j]['source']['name'],forCompany)){
            //console.log("removing link: " + JSON.stringify(links[j]));
            links.splice(j,1);
          }
    }
    else if(links[j]['target']['name']==partners[i] && links[j]['source']['name']==forCompany){
          //console.log("company: "+ links[j]['target']['name'] + " hasLinksOnScreen: "+hasLinksOnScreen(links[j]['target']['name']));
          if(!hasAnyOtherLinksOnScreen(links[j]['target']['name'],forCompany)){
            //console.log("removing link: " + JSON.stringify(links[j]));
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
updateoptArr();
drawStuff();
callback.call(this);
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
        /*.style("stroke", function(o) {
          return o.source === d || o.target === d ? "#101010" : colorLinkBasedOnNodes(o.source.sectorColor,o.target.sectorColor);
      })*/.style("opacity", function(o) {
           return o.source === d || o.target === d ? 1 : 0.05;
        });
      
      d3.selectAll(".node").transition().duration(500)
        .style("opacity", function(o) {
           return neighboring(d, o) ? 1 : 0.05;
        });
      
      d3.selectAll(".node")
        .append("text")
        .attr("class","tempLabel")
        .attr("fill","black")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("style", "font-size: 10; font-family:sans-serif;")
        .text(function(o) { return neighboring(d, o) ? o.name : ""; });

  if($('#shaping').val()=="bytype"){
    var allRects = d3.selectAll(".node")
        .select("rect");
    var allCircles = d3.selectAll(".node")
        .select("circle");

    allCircles.transition().duration(500)
        .attr("r",function(i){
          if(i.name==d.name){
            return "12";
          }else{
            if($('#sizing').val()=="alliancecount"){
              return (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
            }else{
              return "4";
            }
          }
        });

    allRects.transition().duration(500)
        .attr("width",function(i){
          if(i.name==d.name){
            return "12";
          }else{
            if($('#sizing').val()=="alliancecount"){
              return (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;
            }else{
              return "5";
            }
          }
        })
        .attr("height",function(i){ 
          if(i.name==d.name){
            return "12";
          }else{
            if($('#sizing').val()=="alliancecount"){
              return (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;
            }else{
              return "5";
            }
          }
        });

  }
  else{
    d3.selectAll(".node")
        .select("circle")
        .transition().duration(500)
        .attr("r",function(i){
          if(i.name==d.name){
            return "12";
          }else{
            if($('#sizing').val()=="alliancecount"){
              return (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
            }else{
              return "4";
            }
          }
        });
  }

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
        .style("stroke", function(i){
          return colorLinkBasedOnNodes(i.source.sectorColor,i.target.sectorColor);
        })
        .style("opacity", 1);

  d3.selectAll(".node").transition().duration(500)
        .style("opacity", 1);
  

  if($('#shaping').val()=="bytype"){
    var allRects = d3.selectAll(".node")
        .select("rect");
    var allCircles = d3.selectAll(".node")
        .select("circle");

    allCircles.transition().duration(500)
        .attr("r", function(i){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
        });

    allRects.transition().duration(500)
        .attr("width",function(i){
          if($('#sizing').val()=="alliancecount"){
            var nodeWidth = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeWidth;
          }else{
            return "5";
          }
        })
        .attr("height",function(i){
          if($('#sizing').val()=="alliancecount"){
            var nodeHeight = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeHeight;
          }else{
            return "5";
          }
        });
  }
  else{
    d3.selectAll(".node").select("circle").transition().duration(500)
          .attr("r", function(i){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
          });
  }

  d3.selectAll(".tempLabel").remove();
}

function mouseClick(d){
  //console.log("NOW I'M CLICKED!");
  for(var i=0;i<nodes.length;i++){
    nodes[i]['selected']="false";
    if(nodes[i]['name']==d.name){
      nodes[i]['selected']="true";
    }
  }
  

if($('#shaping').val()=="bytype"){
  var allRects = d3.selectAll("rect");
  var allCircles = d3.selectAll("circle");

  allRects.attr("stroke",function(i){ 
      if(i.selected=="true") return "black";
    })
    .attr("stroke-width",function(i){ 
      if(i.selected=="true") return "2";
    });
    
  allCircles.attr("stroke",function(i){ 
      if(i.selected=="true") return "black";
    })
    .attr("stroke-width",function(i){ 
      if(i.selected=="true") return "2";
    });
}
else{
  d3.selectAll("circle")
    .attr("stroke",function(i){ 
      if(i.selected=="true") return "black";
    })
    .attr("stroke-width",function(i){ 
      if(i.selected=="true") return "2";
    });
}
  showCompanyInfo(d.name);
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
  //console.log("dragstarted");
  //force.start();
  
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
  //force.start();
 
}

function dragged(d) {
  //console.log("DRAGGED");
  d.fixed=false;
  d3.timer(force.resume);
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  //tick();
}

function dragended(d) {
  //console.log("dragended");
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
    .gravity(0.1)
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
//console.log($('#coloring').val())
updateNetworkInfo();

  //console.log(firstTime);
if(firstTime==0){
  force.gravity(0);
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
      /*.append("line").attr("class","link");*/
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "link")
      .style("stroke",function(d){
        return colorLinkBasedOnNodes(d.source.sectorColor,d.target.sectorColor);
      });
      
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
        if($('#coloring').val()=="bytype"){
            return isExpanded(d.name)==1? "#088A08" : (d.type=="public"?"#4747D1":"#FF8000");//"#F5F5F0";
        }
        else if($('#coloring').val()=="bysector"){
            return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#088A08" : (d.type=="public"?"#4747D1":"#FF8000");
        }
        else{
              return isExpanded(d.name)==1? "#4747D1" : "#77777E";
        }
      })
      //.call(force.drag);
      .call(drag);

  if($('#shaping').val()=="bytype"){
    
    node.each(function(d){
      if(d.type=="private"){
        d3.select(this).append("circle")
        .attr("r", function(d){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(d.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
        })
        .on("dblclick",function(d){
          $('#viz').fadeOut();
          $('#spinner').fadeIn(function(){
          isExpanded(d.name)==1?removePartners(d.name,function() {
              $('#spinner').fadeOut();
          }):addPartners(d.name,function() {
              $('#spinner').fadeOut();
          });
      });
          $('#viz').fadeIn();
        });
      }else{
        d3.select(this).append("rect")
        .attr("width",function(d){
          if($('#sizing').val()=="alliancecount"){
            var nodeWidth = (((10-5)*(getNumberOfAlliances(d.name))))/(767)+5;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeWidth;
          }else{
            return "5";
          }
        })
        .attr("height",function(d){
          if($('#sizing').val()=="alliancecount"){
            var nodeHeight = (((10-5)*(getNumberOfAlliances(d.name))))/(767)+5;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeHeight;
          }else{
            return "5";
          }
        })
        .on("dblclick",function(d){
          $('#viz').fadeOut();
          $('#spinner').fadeIn(function(){
          isExpanded(d.name)==1?removePartners(d.name,function() {
              $('#spinner').fadeOut();
          }):addPartners(d.name,function() {
              $('#spinner').fadeOut();
          });
      });
          $('#viz').fadeIn();
        });
      }
    });  
  }
  else{
    node.append("circle")
        .attr("r", function(d){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(d.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
        })
        .on("dblclick",function(d){
          $('#viz').fadeOut();
          $('#spinner').fadeIn(function(){
          isExpanded(d.name)==1?removePartners(d.name,function() {
              $('#spinner').fadeOut();
          }):addPartners(d.name,function() {
              $('#spinner').fadeOut();
          });
      });
          $('#viz').fadeIn();
        });
  }

  

  d3.selectAll(".node")
  .append("text")
  .attr("class",function(d){
          if(isExpanded(d.name)==1){
            return "fixedLabel";
          }})
  .attr("fill","black")
  .attr("dx", 12)
  .attr("dy", ".35em")
  .attr("style", "font-size: 10; font-family:sans-serif;")
  .text(function(d){if(isExpanded(d.name)){return d.name;}});

  force.on("tick", function() {
    /*link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
      */ 
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
    });
  
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
  
  if(firstTime==1){
    firstTime=0;
  }
}