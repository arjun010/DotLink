var filteredPathViewLinks = [];
var filteredPathViewNodes = [];
var filteredScatterNetLinks = [];
var filteredScatterNetNodes = [];
var filteredSegmentViewLinks=[];
var filteredSegmentViewNodes=[];
var firstTime =1;
function getCompanyAtIndex(index){
  for(var i=0;i<globalNodes.length;i++){
    if(index == i){
      return globalNodes[i];
    }
  }
}

function returnMin(list){
  var min = list[0];
  for(var i=1;i<list.length;i++){
    if(min>list[i]){
      min=list[i];
    }
  }
  return min;
}

function returnMax(list){
  var max = list[0];
  for(var i=1;i<list.length;i++){
    if(max<list[i]){
      max=list[i];
    }
  }
  return max;
}

function getEffectiveQuarterOfAlliancesBetweenCompanies(company1,company2){
  var list = [];
  for(var i=0;i<globalAllAlliances.length;i++){
    if((globalAllAlliances[i]['company1']==company1 && globalAllAlliances[i]['company2']==company2) || (globalAllAlliances[i]['company1']==company2 && globalAllAlliances[i]['company2']==company1)){
      list.push(globalAllAlliances[i]['effectivequarter']);
    }
  }
  return returnMin(list);
}

function getEffectiveYearOfAlliancesBetweenCompanies(company1,company2){
  var list = [];
  for(var i=0;i<globalAllAlliances.length;i++){
    if((globalAllAlliances[i]['company1']==company1 && globalAllAlliances[i]['company2']==company2) || (globalAllAlliances[i]['company1']==company2 && globalAllAlliances[i]['company2']==company1)){
      list.push(globalAllAlliances[i]['effectiveyear']);
    }
  }
  return returnMin(list);
}

function getTerminatedQuarterOfAlliancesBetweenCompanies(company1,company2){
  var list = [];
  for(var i=0;i<globalAllAlliances.length;i++){
    if((globalAllAlliances[i]['company1']==company1 && globalAllAlliances[i]['company2']==company2) || (globalAllAlliances[i]['company1']==company2 && globalAllAlliances[i]['company2']==company1)){
      list.push(globalAllAlliances[i]['terminatedquarter']);
    }
  }
  return returnMax(list);
}

function getTerminatedYearOfAlliancesBetweenCompanies(company1,company2){
  var list = [];
  for(var i=0;i<globalAllAlliances.length;i++){
    if((globalAllAlliances[i]['company1']==company1 && globalAllAlliances[i]['company2']==company2) || (globalAllAlliances[i]['company1']==company2 && globalAllAlliances[i]['company2']==company1)){
      list.push(globalAllAlliances[i]['terminatedyear']);
    }
  }
  return returnMax(list);
}

function getAllAllianceTypesBetween(company1,company2){
  var allTypes = [],curTypeList=[];
  for(var i=0;i<globalDetailedAlliances.length;i++){
    if((globalDetailedAlliances[i]['source']==company1 && globalDetailedAlliances[i]['target']==company2) || (globalDetailedAlliances[i]['source']==company2 && globalDetailedAlliances[i]['target']==company1)){
      curTypeList=globalDetailedAlliances[i]['type'];
      for(var x=0;x<curTypeList.length;x++){
        allTypes.push(curTypeList[x]);
      }
    }
  }
  return allTypes;
}

function edgeHasCrossBorderAlliance(company1,company2){
  for(var i=0;i<globalDetailedAlliances.length;i++){
    if((globalDetailedAlliances[i]['source']==company1 && globalDetailedAlliances[i]['target']==company2) || (globalDetailedAlliances[i]['source']==company2 && globalDetailedAlliances[i]['target']==company1)){
      if(globalDetailedAlliances[i]['cross_border']=="true"){
        return 1;
      }
    }
  }
  return 0; 
}

function edgeHasJointVenture(company1,company2){
  for(var i=0;i<globalDetailedAlliances.length;i++){
    if((globalDetailedAlliances[i]['source']==company1 && globalDetailedAlliances[i]['target']==company2) || (globalDetailedAlliances[i]['source']==company2 && globalDetailedAlliances[i]['target']==company1)){
      if(globalDetailedAlliances[i]['joint_venture']=="true"){
        return 1;
      }
    }
  }
  return 0; 
}

function refreshData(){
  globalNodes=[];
  globalLinks=[];
  if(view==1){
    d3.selectAll("svg").remove();
  }else if(view==2){
    d3.selectAll(".scatternetdot").remove();
    d3.selectAll(".scatternetnode").remove();
    d3.selectAll(".scatternetlink").remove();
    d3.selectAll("text").remove();
    d3.selectAll(".tick").select("line").remove();
  }else if(view==3){
    d3.selectAll(".segmentViewCompleteNode").remove();
    d3.selectAll(".segmentViewNode").remove();
  }
  firstTime=1;
  
  /*
  $("#newCompany > option").each(function() {
               $(this).css('color', 'black');  
    });
  */
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateoptArr(){
for (var i = 0; i < globalNodes.length ; i++) {
    optArray.push(globalNodes[i].name);
}
optArray=unique(optArray.sort());
$(function(){
$("#search").autocomplete({
        source: optArray
});});
}

$(function(){
$("#newCompany").autocomplete({
        source: allCompanyNames
});});


function searchNode() {
    var selectedVal = document.getElementById('search').value.toLowerCase();
    if(view==3){
      segmentViewSearch(selectedVal);
    }else{
    
    var allNodesOnScreen ;
    
    d3.selectAll(".searchLabel").remove();

    var nodeClassToSelect;
    if(view==1){
      nodeClassToSelect=".pathviewnode";
    }else if(view==2){
      nodeClassToSelect=".scatternetdot";
    }
    if (selectedVal=="") {
      allNodesOnScreen = d3.selectAll(nodeClassToSelect)
    .each(function(d) {
          d3.select(this).style("opacity",1);
          if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }
          else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
    });
    }
    else{
    var selectedNode;
    allNodesOnScreen = d3.selectAll(nodeClassToSelect)
    .each(function(d) {
      if(d.name!="" && d.name.toLowerCase().indexOf(selectedVal) > -1)
      {
        d3.select(this).style("opacity",1).append("text")
        .attr("class","searchLabel")
        .attr("fill","black")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("style", "font-family:sans-serif;")
        .attr("style", function(d){
          var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
          return "font-size:"+size; 
        })
        .text(function() { return d.name;});
      }
      else{
        d3.select(this).style("opacity",0.05);
          if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);
            });
          }else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
      }
    });
    if(view==2){
      allNodesOnScreen = d3.selectAll(".scatternetnode")
    .each(function(d) {
      if(d.name!="" && d.name.toLowerCase().indexOf(selectedVal) > -1)
      {
        if(isExpanded(d.name)!=1){
          d3.select(this).append("text")
          .attr("class","searchLabel")
          .attr("fill","black")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .attr("style", "font-family:sans-serif;")
          .attr("style", function(d){
            var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
            return "font-size:"+size; 
          })
          .text(function() { return d.name;});
        }
      }
    });
    }
    }
    }
}

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}
function getCompanyType(companyName){
  for(var i=0;i<globalAllCompanies.length;i++){
    if(globalAllCompanies[i]['name']==companyName){
      return globalAllCompanies[i]['type'];
    }
  }
  //console.log("company type not found!");
}

function companyExistsInNodes(companyName){
    for(var i=0 ; i<globalNodes.length;i++){
        if(companyName==globalNodes[i]['name']){
            return i;
            break;
        }
    }
    return -1;
}
function getSector(forCompany){
  for (var i = 0; i < globalAllCompanies.length; i++){
    if(globalAllCompanies[i]['name']==forCompany){
      return globalAllCompanies[i]['sector'];
    }
  }
}

function getSectorColor(forCompany){
  for (var i = 0; i < globalAllCompanies.length; i++){
    if(globalAllCompanies[i]['name']==forCompany){
      return globalAllCompanies[i]['sectorColor'].toLowerCase();
    }
  }
}

function getHighPrice(forCompany){
  for (var i = 0; i < globalAllCompanies.length; i++){
      if(globalAllCompanies[i]['name']==forCompany){
        return globalAllCompanies[i]['highPrice'];
      }
    } 
}

function getAllianceCount(forCompany){
  for (var i = 0; i < globalAllCompanies.length; i++){
      if(globalAllCompanies[i]['name']==forCompany){
        return globalAllCompanies[i]['allianceCount'];
      }
    } 
}

function getCompanySize(forCompany){
  for (var i = 0; i < globalAllCompanies.length; i++){
      if(globalAllCompanies[i]['name']==forCompany){
        return globalAllCompanies[i]['companySize'];
      }
    } 
}

function getSectorDesc(forCompany){
  for (var i = 0; i < globalAllCompanies.length; i++){
    if(globalAllCompanies[i]['name']==forCompany){
      return globalAllCompanies[i]['sectorDesc'];
    }
  }
}

function isReversedLink(curLink){
    for (var i =0; i<globalLinks.length;i++){
        if(curLink['source']==globalLinks[i]['target'] && curLink['target']==globalLinks[i]['source']){
            return 1;
        }
    }
    return 0;
}

function entryExistsInLinks(entry,links){
  for(var i=0;i<links.length;i++){
    if(entry['source']==links[i]['source'] && entry['target']==links[i]['target']){
      return 1;
    }else if(entry['source']==links[i]['target'] && entry['target']==links[i]['source']){
      return 1;
    }
  }
  return 0;
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

function getAllSectors(forCompany){
  for(var i =0;i<globalAllCompanies.length;i++){
    if(globalAllCompanies[i]['name']==forCompany){
      return globalAllCompanies[i]['allSectors'];
    }
  }
}

function objectIsInList(object,list){
  for(var i=0;i<list.length;i++){
    if(list[i]==object){
      return 1;
    }
  }
  return 0;
}

function addNewNodeLoadingWrapper(){
  $('#spinner').fadeIn(function(){
          addNewNode(function() {
              $('#spinner').fadeOut();
          })
        });
  $('#viz').fadeIn();
}

function filterPathViewWrapper(){
  $('#spinner').fadeIn(function(){
          filterPathViewWithLoader(function() {
              $('#spinner').fadeOut();
          })
        });
  $('#viz').fadeIn();  
}

function filterScatternetWrapper(){
  $('#spinner').fadeIn(function(){
          filterScatternetWithLoader(function() {
              $('#spinner').fadeOut();
          })
        });
  $('#viz').fadeIn();  
}

function filterSegmentViewWrapper(){
  $('#spinner').fadeIn(function(){
          filterSegmentViewWithLoader(function() {
              $('#spinner').fadeOut();
          })
        });
  $('#viz').fadeIn();  
}

function addNewNode(callback){
    var companyToAdd = document.getElementById("newCompany");
    if(companyToAdd.value!=""){
    if(companyExistsInNodes(companyToAdd)==-1){
      globalNodes.push(({"name":companyToAdd.value,"highPrice":getHighPrice(companyToAdd.value),"allianceCount":getAllianceCount(companyToAdd.value),"companySize":getCompanySize(companyToAdd.value),"expanded":"false","selected":"false","type":getCompanyType(companyToAdd.value),"sectorColor":getSectorColor(companyToAdd.value),"allSectors":getAllSectors(companyToAdd.value)}));
        var sourceVal,targetVal;
        for(var i = 0; i < globalAllAlliances.length; i++){
            // to check if the new company is a target node for any alliance
            if(globalAllAlliances[i]['company2']==companyToAdd.value){
                sourceVal = companyExistsInNodes(globalAllAlliances[i]['company1']);
                targetVal = companyExistsInNodes(globalAllAlliances[i]['company2']);
                if(sourceVal!=-1){
                    globalLinks.push({"source":sourceVal,"target":targetVal});
                }
            }// to check if the new company is a source node for any of the existing globalAllCompanies
            else if(globalAllAlliances[i]['company1']==companyToAdd.value){
                sourceVal = companyExistsInNodes(globalAllAlliances[i]['company1']);
                targetVal = companyExistsInNodes(globalAllAlliances[i]['company2']);
                if(targetVal!=-1){
                    globalLinks.push({"source":sourceVal,"target":targetVal});
                }
            }
        }
        
    } 

    for(var i=0;i<globalNodes.length;i++){
        for(var j=0;j<globalNodes.length;j++){
            for(var k=0;k<globalAllAlliances.length;k++){
                if((globalAllAlliances[k]['company1']==globalNodes[i]['name'] && globalAllAlliances[k]['company2']==globalNodes[j]['name']) || (globalAllAlliances[k]['company2']==globalNodes[i]['name'] && globalAllAlliances[k]['company1']==globalNodes[j]['name'])){
                   sourceVal=companyExistsInNodes(globalNodes[i]['name']);
                   targetVal=companyExistsInNodes(globalNodes[j]['name']);
                   if(isReversedLink(JSON.parse('{"source":'+sourceVal+',"target":'+targetVal+'}'))==0){
                        globalLinks.push({"source":sourceVal,"target":targetVal});
                    }
                }
            }
        }
    }
  /*$("#newCompany > option").each(function() {
      for(var i=0;i<globalNodes.length;i++){
          if(this.text==globalNodes[i]['name']){
               $(this).css('color', '#c3c3c3');  
      }
    }
  });*/
  updateoptArr();
  if(view==1){
    //drawPathView();
    filterPathView();
  }else if(view==2){
    //drawScatternetView();
    filterScatternet();
  }else if(view==3){
    existingXYPairs=[];
    //drawSegmentView();
    filterSegmentView();
  }
  if(firstTime==1){
    firstTime=0;
  }
  }
  companyToAdd.value="";
  callback.call(this);
}
var fromAddPartners = 0;
function addPartners(companyToAdd,callback){
    console.log("before:");
    console.log(globalLinks);
    var targetVal, addedCompany ;
    var partnerCompany;

    for(var i =0 ; i<globalNodes.length; i++){
      if(globalNodes[i]['name']==companyToAdd){
        globalNodes[i]['expanded']="true";
      }globalNodes[i]['selected']="false";selectedCount=0;
    }
    selectedCompanies=[];
    for (var i = 0; i < globalAllAlliances.length; i++) {
        if(globalAllAlliances[i]['company1']==companyToAdd){
            sourceVal = companyExistsInNodes(globalAllAlliances[i]['company1']);
            targetVal = companyExistsInNodes(globalAllAlliances[i]['company2']);
            if(targetVal==-1){
                globalNodes.push(({"name":globalAllAlliances[i]['company2'],"highPrice":getHighPrice(globalAllAlliances[i]['company2']),"allianceCount":getAllianceCount(globalAllAlliances[i]['company2']),"companySize":getCompanySize(globalAllAlliances[i]['company2']),"expanded":"false","selected":"false","type":getCompanyType(globalAllAlliances[i]['company2']),"sectorColor":getSectorColor(globalAllAlliances[i]['company2']),"allSectors":getAllSectors(globalAllAlliances[i]['company2'])}));
                targetVal = companyExistsInNodes(globalAllAlliances[i]['company2']);
                globalLinks.push({"source":sourceVal,"target":targetVal});
            }
            else{
                globalLinks.push({"source":sourceVal,"target":targetVal});   
            }
        }else if(globalAllAlliances[i]['company2']==companyToAdd){
          partnerCompany = globalAllAlliances[i]['company1'];
          targetVal = companyExistsInNodes(globalAllAlliances[i]['company2']);
          sourceVal = companyExistsInNodes(globalAllAlliances[i]['company1']);
          if(sourceVal==-1){
                globalNodes.push(({"name":globalAllAlliances[i]['company1'],"highPrice":getHighPrice(globalAllAlliances[i]['company1']),"allianceCount":getAllianceCount(globalAllAlliances[i]['company1']),"companySize":getCompanySize(globalAllAlliances[i]['company1']),"expanded":"false","selected":"false","type":getCompanyType(globalAllAlliances[i]['company1']),"sectorColor":getSectorColor(globalAllAlliances[i]['company1']),"allSectors":getAllSectors(globalAllAlliances[i]['company1'])}));
                sourceVal = companyExistsInNodes(globalAllAlliances[i]['company1']);
                globalLinks.push({"source":sourceVal,"target":targetVal});
            }
            else{
                globalLinks.push({"source":sourceVal,"target":targetVal});
            }

        }
    }
    /*
    $("#newCompany > option").each(function() {
      for(var i=0;i<globalNodes.length;i++){
          if(this.text==globalNodes[i]['name']){
               $(this).css('color', '#c3c3c3');
          }
      }

  });
    */
  updateoptArr();
  if(view==1){
    //console.log(globalLinks);
    //console.log(globalNodes);
    //drawPathView();
    //console.log("from addPartners")
    console.log("after:");
    console.log(globalLinks);
    filterPathViewWrapper();
    //drawPathView();
  }else if(view==2){
    //drawScatternetView();

    filterScatternetWrapper();
    
    //drawScatternetView();
  }else if(view==3){
    //drawSegmentView();
    filterSegmentViewWrapper();
    //drawSegmentView();
  }
  callback.call(this);
}

function removePartners(forCompany,callback){
    
    for(var i =0 ; i<globalNodes.length; i++){
      if(globalNodes[i]['name']==forCompany){
        globalNodes[i]['expanded']="false";
      }globalNodes[i]['selected']="false";selectedCount=0;
    }
    selectedCompanies=[];
    var partners = getPartners(forCompany);
    for(var i =0 ;i<partners.length;i++){
       for(var j=0; j<globalLinks.length;j++){
         if(globalLinks[j]['source']['name']==partners[i] && globalLinks[j]['target']['name']==forCompany){
            
            if(!hasAnyOtherLinksOnScreen(globalLinks[j]['source']['name'],forCompany)){
              
              globalLinks.splice(j,1);
            }
      }
      else if(globalLinks[j]['target']['name']==partners[i] && globalLinks[j]['source']['name']==forCompany){
            
            if(!hasAnyOtherLinksOnScreen(globalLinks[j]['target']['name'],forCompany)){
              globalLinks.splice(j,1);
            }
      }
       }
    }

    //removing globalNodes
    for(var i =0; i<partners.length; i++){
      for(var j=0; j<globalNodes.length;j++){
        if(globalNodes[j]['name']==partners[i] && globalNodes[j]['expanded']=="false" && !hasLinksOnScreen(globalNodes[j]['name'])){
          globalNodes.splice(j,1);
        }
      }
    }
    /*
    $("#newCompany > option").each(function() {
        //alert(this.text + ' ' + this.value);
        for(var i=0;i<globalNodes.length;i++){
            if(this.text==globalNodes[i]['name']){
                //$(this).find('value:'+this.text).css('background-color', 'red');
                //$(this).css('background-color', '#81DAF5');
                 $(this).css('color', '#c3c3c3');
            }
        }
    });
  */

  updateoptArr();
  console.log("from remove partenrs:")
  for(var i =0;i<globalLinks.length;i++){
    console.log(globalLinks[i]);
  }
  if(view==1){
    filterPathView();
    //drawPathView();
  }else if(view==2){
    //drawScatternetView();
    filterScatternet();
  }else if(view==3){
    //drawSegmentView();
    filterSegmentView();
  }
  callback.call(this);
}

function hasLinksOnScreen(forCompany){
  //console.log("in hasLinksOnScreen():");
  for(var i =0 ; i<globalLinks.length; i++){
    if(globalLinks[i]['source']['name']==forCompany || globalLinks[i]['target']['name']==forCompany){
      return true;
    }
  }
  return false;
}

function hasAnyOtherLinksOnScreen(forCompany,exceptCompany){
  for(var i =0 ; i<globalLinks.length;i++){
    if(globalLinks[i]['source']['name']==forCompany ){
      if(globalLinks[i]['target']['name']!=exceptCompany){
        return true;
      }
    }else if(globalLinks[i]['target']['name']==forCompany){
      if(globalLinks[i]['source']['name']!=exceptCompany){
        return true;
      }
    }
  }
  return false;
}

function getPartners(forCompany){
  var partners = [];
  for (var i =0 ;i<globalAllAlliances.length; i++){
    if(globalAllAlliances[i]['company1']==forCompany){
      partners.push(globalAllAlliances[i]['company2']);
    }else if(globalAllAlliances[i]['company2']==forCompany){
      partners.push(globalAllAlliances[i]['company1']);
    }
  }
  return partners;
}

function isExpanded(forCompany){
  for(var i =0; i<globalNodes.length; i++){
    if(globalNodes[i]['name']==forCompany){
      if(globalNodes[i]['expanded']=="true"){
        return 1;
      }
    }
  }
  return 0;
}

function getNumberOfAlliances(forCompany){
  var count = 0;
  for(var i = 0; i < globalAllAlliances.length; i++){
    if(globalAllAlliances[i]['company1']==forCompany || globalAllAlliances[i]['company2']==forCompany){
      count+=1;
    }
  }
  return count;
}

function filterToggled(){
  if(view==1){
    //drawPathView();
    drawPathView();
  }else if(view==2){
    //drawScatternetView();
    filterScatternet();
  }else if(view==3){
    //drawSegmentView();
    filterSegmentView();
  }
}


var linkedByIndex = {};

function neighboring(a, b) {
return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}
//console.log(typeof(globalAllAllianceCountsBetweenCompanies[2]['allianceCount']));
//console.log(getAllianceCountBetweenCompanies("knowledge systems inc","a2d lp"));

function getAllianceCountBetweenCompanies(company1,company2){

  for(var i = 0; i<globalAllAllianceCountsBetweenCompanies.length; i++){
    if(globalAllAllianceCountsBetweenCompanies[i]['company1']==company1){
      if(globalAllAllianceCountsBetweenCompanies[i]['company2']==company2){        
        return globalAllAllianceCountsBetweenCompanies[i]['allianceCount'];
      }
    }
  }
  for(var i = 0; i<globalAllAllianceCountsBetweenCompanies.length; i++){
    if(globalAllAllianceCountsBetweenCompanies[i]['company2']==company1){
      if(globalAllAllianceCountsBetweenCompanies[i]['company1']==company2){        
        return globalAllAllianceCountsBetweenCompanies[i]['allianceCount'];
      }
    }
  }
  //console.log("-------");
}

//-----end of common use functions-----

//path view specific

function pathViewMouseover(d) {
      d3.selectAll(".pathviewlink").transition().duration(500)
        .style("opacity", function(o) {
           return o.source === d || o.target === d ? 1 : 0.03;
        }).style("stroke",function(o) {
           return o.source === d || o.target === d ? colorLinkBasedOnNodes(o.source.sectorColor,o.target.sectorColor) : "#ccc";
        });
      
      d3.selectAll(".pathviewnode").transition().duration(500)
        .style("opacity", function(o) {
           return neighboring(d, o) ? 1 : 0.05;
        });
      
      d3.selectAll(".pathviewnode")
        .append("text")
        .attr("class","tempLabel")
        .attr("fill","black")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("style", "font-family:sans-serif;")
        .attr("style", function(d){
          var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
          return "font-size:"+size; 
        })
        .text(function(o) { return neighboring(d, o) ? o.name : ""; });

    if($('#shaping').val()=="bytype"){
      var allRects = d3.selectAll(".pathviewnode")
          .select("rect");
      var allCircles = d3.selectAll(".pathviewnode")
          .select("circle");

      allCircles.transition().duration(500)
          .attr("r",function(i){
            if(i.name==d.name){
              var curRad = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
              return ((curRad*1.25)+"");
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
              var curWidth = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;
              return (""+(curWidth*1.25));
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
              var curHeight = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5
              return ((curHeight*1.25)+"");
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
      d3.selectAll(".pathviewnode")
          .select("circle")
          .transition().duration(500)
          .attr("r",function(i){
            if(i.name==d.name){
              var curRad = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
              return ((curRad*1.25)+"");
            }else{
              if($('#sizing').val()=="alliancecount"){
                return (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
              }else{
                return "4";
              }
            }
          });
    }
    d3.select(this).select("circle").style("stroke","yellow").style("stroke-width",2);
    //filterPathView();
    //drawPathView();
}

function pathViewMouseout(d) {
  
  d3.selectAll(".pathviewlink").transition().duration(500)
        .style("stroke", function(i){
          return colorLinkBasedOnNodes(i.source.sectorColor,i.target.sectorColor);
        })
        .style("opacity", 1);

  d3.selectAll(".pathviewnode").transition().duration(500)
        .style("opacity", 1);

  d3.select(this).select("circle").style("stroke","").style("stroke-width","");

  if($('#shaping').val()=="bytype"){
    var allRects = d3.selectAll(".pathviewnode")
        .select("rect");
    var allCircles = d3.selectAll(".pathviewnode")
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
            var nodeWidth = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
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
    d3.selectAll(".pathviewnode").select("circle").transition().duration(500)
          .attr("r", function(i){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
          });
  }

  d3.selectAll(".tempLabel").remove();
  //filterPathView();
  //drawPathView();
}

function getDetailedAlliances(company1,company2){
  var res=[],temp,counter=1;
  for(var i=0;i<globalDetailedAlliances.length;i++){
    if((globalDetailedAlliances[i]['source']==company1 && globalDetailedAlliances[i]['target']==company2) || (globalDetailedAlliances[i]['source']==company2 && globalDetailedAlliances[i]['target']==company1)){
      temp = globalDetailedAlliances[i];
      temp['allianceIndex']=counter;
      res.push(temp);
      counter+=1;
    }
  }
  //console.log(res)
  return res;
}
function drawDetailedAlliances(company1,company2){
  d3.selectAll(".pathviewnode").selectAll("circle").style("stroke","").style("stroke-width","");
  d3.selectAll(".pathviewnode")
    .style("opacity",function(d){
      if(d.name!=company1 && d.name!=company2){
        return "0.05";
      }else{
        return "0.8";
      }
    }).on("mouseout",function(){})
    .on("mouseover",function(d){})
    .on("dblclick",function(d){})
    .on("click",function(){
      for(var i=0;i<globalNodes.length;i++){
        globalNodes[i]['selected']="false";
      }
      selectedCount=0;
      d3.selectAll(".detailedalliance").remove();
      d3.selectAll(".tempDetailedAllianceLabel").remove();
      //drawPathView();
      filterPathView();
    })
    .append("text")
    .attr("class","tempDetailedAllianceLabel")
    .attr("fill","black")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .attr("style", "font-family:sans-serif;")
    .attr("style", function(i){
      var size = (((20-8)*(getNumberOfAlliances(i.name))))/(767)+8;
      return "font-size:"+size; 
    })
    .text(function(i){
      if(i.name==company1 || i.name==company2){
        return i.name;
      }
    });

  d3.select("#viz").on("dblclick",function(){
      for(var i=0;i<globalNodes.length;i++){
        globalNodes[i]['selected']="false";
      }
      selectedCount=0;
      d3.selectAll(".detailedalliance").remove();
      d3.selectAll(".tempDetailedAllianceLabel").remove();
      //drawPathView();
      filterPathView();
  });

  d3.selectAll(".pathviewlink")//.style("opacity",0);
    .style("opacity",function(d){
      if((d.source.name==company1 && d.target.name==company2) || (d.source.name==company2 && d.target.name==company1)){
        return 0;
      }else{
        return 0.005;
      }
    })
    .style("stroke",function(i){
      if((i.source.name==company1 && i.target.name==company2) || (i.source.name==company2 && i.target.name==company1)){
        return "";
      }else{
        return colorLinkBasedOnNodes(i.source.sectorColor,i.target.sectorColor);
      }
      
    });


  var detailedalliances = getDetailedAlliances(company1,company2);
  console.log(detailedalliances);
  var totalLinkCount = detailedalliances.length;
  var scaleFunc = d3.scale.linear().domain([1,totalLinkCount]).range([1,totalLinkCount+20]);    
  for(var i =0; i<totalLinkCount;i++){
    console.log(scaleFunc(detailedalliances[i]['allianceIndex']));
    //detailedalliances[i]['allianceIndex']=scaleFunc(detailedalliances[i]['allianceIndex']);
  }
  var detailedLinks = pathViewContainer.selectAll(".detailedalliance")
      .data(detailedalliances)
      .enter()
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "detailedalliance")
      .style("opacity",0.7);
      
 
  //console.log(totalLinkCount);


  detailedLinks.attr("d", function(d){
        //var sourceIndex = companyExistsInNodes(d['company1']);
        //var targetIndex = companyExistsInNodes(d['company2']);
        //var targetIndex=d.target;
        //var sourceIndex=d.source;
      if((d.source==company1 && d.target==company2) || (d.source==company2 && d.target==company1)){
          var sourceIndex = companyExistsInNodes(company1);
          var targetIndex = companyExistsInNodes(company2);
          if(globalNodes[sourceIndex].x>globalNodes[targetIndex].x){
            var temp;
            temp = sourceIndex;
            sourceIndex=targetIndex;
            targetIndex=temp;
          }
          var dx = globalNodes[targetIndex].x - globalNodes[sourceIndex].x,
              dy = globalNodes[targetIndex].y - globalNodes[sourceIndex].y,
              dr = Math.sqrt(dx * dx + dy * dy);
          if(totalLinkCount>1){
            //console.log(d.allianceIndex);

            dr = dr/(1+(1/totalLinkCount)*(detailedalliances.length-parseInt(d.allianceIndex)+1));
          }
          return "M" + 
              globalNodes[sourceIndex].x + "," + 
              globalNodes[sourceIndex].y + "A" + 
              dr + "," + dr + " 0 0,1 " + 
              globalNodes[targetIndex].x + "," + 
              globalNodes[targetIndex].y;
          
  } 
  });
  detailedLinks.on("mouseover",function(d){
      d3.select(this).style("stroke-width",3);
      d3.selectAll(".detailedalliance")
        .style("opacity",function(i){
          if(d.allianceIndex!=i.allianceIndex){
            return 0.2;
          }else{
            return 0.8;
          }
      });
        tip.show(d);
      /*d3.select(this).append("title")
        .text(function(){
          return d.effective+","+d.type;
      });*/
  })
  .on("mouseout",function(){
    d3.selectAll(".detailedalliance")
        .style("opacity",0.7)
        .style("stroke-width",1);
    tip.hide();
  });

  //detailedLinks.on("mouseover",tip.show);
  //detailedLinks.on("mouseout",tip.hide);

}




var selectedCount = 0;
var selectedCompanies = [];
function pathViewMouseclick(d){
  //console.log(globalNodes[companyExistsInNodes(d.name)]['selected']);
  //deselect
  for(var i=0;i<globalNodes.length;i++){
    if(globalNodes[i]['selected']=="true"){
      console.log(globalNodes[i]['name']);
    }
  }
  if(globalNodes[companyExistsInNodes(d.name)]['selected']=="true"){
    //console.log("yes");
    globalNodes[companyExistsInNodes(d.name)]['selected']="false";
    selectedCount-=1;
  }else{
  console.log(selectedCount);
  //select
  if(selectedCount==2){
    globalNodes[companyExistsInNodes(selectedCompanies[0])]['selected']="false";
    selectedCompanies[0]=selectedCompanies[1];
    selectedCompanies[1]=d.name;
    globalNodes[companyExistsInNodes(selectedCompanies[0])]['selected']="true";
    globalNodes[companyExistsInNodes(selectedCompanies[1])]['selected']="true";
  }else if(selectedCount==1){
    console.log("making count 2")
    selectedCompanies[1]=d.name;
    globalNodes[companyExistsInNodes(selectedCompanies[1])]['selected']="true";
    selectedCount=2;
  }else{
    console.log("making count 1")
    selectedCompanies[0]=d.name;
    globalNodes[companyExistsInNodes(selectedCompanies[0])]['selected']="true";
    selectedCount=1;
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
        if(i.selected=="true") {          
            return "black";
        }else{
          return "";
        }
      })
      .attr("stroke-width",function(i){ 
        if(i.selected=="true"){
          return "2";  
        }else{
          return "";
        }
      });
}
if(selectedCount==2){
    drawDetailedAlliances(selectedCompanies[0],selectedCompanies[1]);
}
}


function pathViewClearSelections(){
  for(var i=0;i<globalNodes.length;i++){
    globalNodes[i]['selected']="false";
  }
}

function pathViewZoomed() {
  pathViewContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  prevScale=d3.event.scale;
  prevTranslate=d3.event.translate;
}

function pathViewDragstarted(d) {

  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function pathViewDragged(d) {

  d.fixed=false;
  d3.timer(force.resume);
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  
}

function pathViewDragended(d) {
  
  d.fixed=true;
  d3.select(this).classed("dragging", false);
 
}

var force;
if(firstTime==1){
  force = d3.layout.force()
    .gravity(0.1)
    .distance(250)
    .charge(-100)
    .size([document.getElementById("mainContent").offsetWidth, $(document).height()]);
}

var pathViewContainer;
var prevTranslate = [0,0];
var prevScale = 0; 
var pathViewZoom = d3.behavior.zoom()
    .scaleExtent([0.5, 50])
    .on("zoom", pathViewZoomed);

var pathViewLinks;
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "Effective: <span style='font-family:\"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;'>" + d.effective + "</span><br/>Terminated: <span style='font-family:\"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;'>" + d.terminated + "</span><br/>Type:<span style='font-family:\"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif; '>" + d.type + "</span>";
  })

function filterPathViewWithLoader(callback){
filteredPathViewNodes=[];
filteredPathViewLinks=[];
var effQuarter = parseInt($("#effquarter").val());
var endQuarter = parseInt($("#endquarter").val());
var effYear = parseInt($("#effyear").val());
var endYear = parseInt($("#endyear").val());

if($("#noreltypefilter").is(":checked") && effQuarter==1 && endQuarter==4 && endYear==2012 && effYear==1990){
  for(var i=0;i<globalNodes.length;i++){
    filteredPathViewNodes.push(globalNodes[i]);
  }
  for(var i=0;i<globalLinks.length;i++){
    filteredPathViewLinks.push(globalLinks[i]);
  }
}else{
  
var relationshipTypesToShow = [],showCB=0,showJV=0;
if($("#showrnd").is(":checked")){
  relationshipTypesToShow.push("R&D");
}
if($("#showmanufacturing").is(":checked")){
  relationshipTypesToShow.push("Manufacturing");
}
if($("#showoem").is(":checked")){
  relationshipTypesToShow.push("OEM");
}
if($("#showlicensing").is(":checked")){
  relationshipTypesToShow.push("Licensing");
}
if($("#showtechtrans").is(":checked")){
  relationshipTypesToShow.push("Techtrans");
}
if($("#showmarketing").is(":checked")){
  relationshipTypesToShow.push("Marketing");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showsupply").is(":checked")){
  relationshipTypesToShow.push("Supply");
}
if($("#showcrossborder").is(":checked")){
  showCB=1;
}
if($("#showjointventure").is(":checked")){
  showJV=1;
}

    for(var i=0;i<globalLinks.length;i++){
        var linkEffQuarter = getEffectiveQuarterOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        var linkTerminatedQuarter = getTerminatedQuarterOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        var linkTerminatedYear = getTerminatedYearOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        var linkEffYear = getEffectiveYearOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        
        if(linkTerminatedYear==-1){
          if(linkEffYear!=-1){
            if(linkEffYear<effYear){              
              addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);     
            }else if(linkEffYear==effYear){
              if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter && linkEffQuarter>=effQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);    
                }
              }else{
                addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
              }
            }else{
              if(linkEffYear<endYear){
                addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);    
              }else if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);    
                }
              }
            }
          }
        }else{
          if(linkEffYear!=-1){
            if(linkEffYear<effyear){
                if(linkTerminatedYear>endYear){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkTerminatedQuarter>=endQuarter){
                    addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
            }else if(linkEffYear==effYear){
              if(linkTerminatedYear>endYear){
                if(linkEffQuarter>=effQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkEffQuarter>=effQuarter && linkTerminatedQuarter<=endQuarter){
                    addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
              }
            }else{
              if(linkTerminatedYear>endYear){
                addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkTerminatedYear==endYear){
                if(linkTerminatedQuarter<=endQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }
    }
}
drawPathView();
callback.call(this);
}

function addLinkToPathView(currentLink,relationshipTypesToShow,showJV,showCB){
  var allTypesInCurrentEdge,flag=0;
            allTypesInCurrentEdge = getAllAllianceTypesBetween(currentLink['source']['name'],currentLink['target']['name']);
              for(var j=0;j<relationshipTypesToShow.length;j++){
                if(objectIsInList(relationshipTypesToShow[j],allTypesInCurrentEdge)==1){
                  if(objectIsInList(currentLink['source'],filteredPathViewNodes)==0){
                    filteredPathViewNodes.push(currentLink['source']);
                  }
                  if(objectIsInList(currentLink['target'],filteredPathViewNodes)==0){
                    filteredPathViewNodes.push(currentLink['target']);
                  }
                  if(objectIsInList(currentLink,filteredPathViewLinks)==0){
                    filteredPathViewLinks.push(currentLink);
                  }
                  flag=1;
                  break;
                }                
              }
            if(flag==1){
              
            }else{
            if(showCB==1){
              if(edgeHasCrossBorderAlliance(currentLink['source']['name'],currentLink['target']['name'])==1){
                if(objectIsInList(currentLink['source'],filteredPathViewNodes)==0){
                  filteredPathViewNodes.push(currentLink['source']);
                }
                if(objectIsInList(currentLink['target'],filteredPathViewNodes)==0){
                  filteredPathViewNodes.push(currentLink['target']);
                }
                if(objectIsInList(currentLink,filteredPathViewLinks)==0){
                  filteredPathViewLinks.push(currentLink);
                }
                //continue;
              }
            }else{
            if(showJV==1){
              if(edgeHasJointVenture(currentLink['source']['name'],currentLink['target']['name'])==1){
                if(objectIsInList(currentLink['source'],filteredPathViewNodes)==0){
                  filteredPathViewNodes.push(currentLink['source']);
                }
                if(objectIsInList(currentLink['target'],filteredPathViewNodes)==0){
                  filteredPathViewNodes.push(currentLink['target']);
                }
                if(objectIsInList(currentLink,filteredPathViewLinks)==0){
                  filteredPathViewLinks.push(currentLink);
                }
                //continue;
              }
            }else{
            if(relationshipTypesToShow.length==0){
              if(objectIsInList(currentLink['source'],filteredPathViewNodes)==0){
                  filteredPathViewNodes.push(currentLink['source']);
                }
                if(objectIsInList(currentLink['target'],filteredPathViewNodes)==0){
                  filteredPathViewNodes.push(currentLink['target']);
                }
                if(objectIsInList(currentLink,filteredPathViewLinks)==0){
                  filteredPathViewLinks.push(currentLink);
                }
            } 
            }
          } 
          }
}


function filterPathView(){
filteredPathViewNodes=[];
filteredPathViewLinks=[];

var effQuarter = parseInt($("#effquarter").val());
var endQuarter = parseInt($("#endquarter").val());
var effYear = parseInt($("#effyear").val());
var endYear = parseInt($("#endyear").val());

if($("#noreltypefilter").is(":checked") && effQuarter==1 && endQuarter==4 && endYear==2012 && effYear==1990){
  for(var i=0;i<globalNodes.length;i++){
    filteredPathViewNodes.push(globalNodes[i]);
  }
  for(var i=0;i<globalLinks.length;i++){
    filteredPathViewLinks.push(globalLinks[i]);
  }
}else{
  
var relationshipTypesToShow = [],showCB=0,showJV=0;
if($("#showrnd").is(":checked")){
  relationshipTypesToShow.push("R&D");
}
if($("#showmanufacturing").is(":checked")){
  relationshipTypesToShow.push("Manufacturing");
}
if($("#showoem").is(":checked")){
  relationshipTypesToShow.push("OEM");
}
if($("#showlicensing").is(":checked")){
  relationshipTypesToShow.push("Licensing");
}
if($("#showtechtrans").is(":checked")){
  relationshipTypesToShow.push("Techtrans");
}
if($("#showmarketing").is(":checked")){
  relationshipTypesToShow.push("Marketing");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showsupply").is(":checked")){
  relationshipTypesToShow.push("Supply");
}
if($("#showcrossborder").is(":checked")){
  showCB=1;
}
if($("#showjointventure").is(":checked")){
  showJV=1;
}
    for(var i=0;i<globalLinks.length;i++){
        var linkEffQuarter = getEffectiveQuarterOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        var linkTerminatedQuarter = getTerminatedQuarterOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        var linkTerminatedYear = getTerminatedYearOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        var linkEffYear = getEffectiveYearOfAlliancesBetweenCompanies(globalLinks[i]['source']['name'],globalLinks[i]['target']['name']);
        if(linkTerminatedYear==-1){
          if(linkEffYear!=-1){
            if(linkEffYear<effYear){              
              addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);     
            }else if(linkEffYear==effYear){
              if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter && linkEffQuarter>=effQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);    
                }
              }else{
                addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
              }
            }else{
              if(linkEffYear<endYear){
                addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);    
              }else if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);    
                }
              }
            }
          }
        }else{
          if(linkEffYear!=-1){
            if(linkEffYear<effyear){
                if(linkTerminatedYear>endYear){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkTerminatedQuarter>=endQuarter){
                    addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
            }else if(linkEffYear==effYear){
              if(linkTerminatedYear>endYear){
                if(linkEffQuarter>=effQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkEffQuarter>=effQuarter && linkTerminatedQuarter<=endQuarter){
                    addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
              }
            }else{
              if(linkTerminatedYear>endYear){
                addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkTerminatedYear==endYear){
                if(linkTerminatedQuarter<=endQuarter){
                  addLinkToPathView(globalLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }
    }
}
drawPathView();
}


//console.log(globalLinks);
function drawPathView() {
  //filterPathView();
  linkedByIndex={};
  if(firstTime==0){
    force.gravity(0);
    force.stop();
  }
  //filterPathView();
  d3.selectAll("svg").remove(); 

  var svgWidth=document.getElementById("viz").offsetWidth;
  var svgHeight=document.getElementById("viz").offsetHeight;

  var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", pathViewDragstarted)
      .on("drag", pathViewDragged)
      .on("dragend", pathViewDragended);



  var svg = d3.select("#viz").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .call(pathViewZoom).on("dblclick.zoom", null);
  svg.call(tip);
  pathViewContainer = svg.append("g");
  if(prevTranslate!=[0,0] && prevScale!=0){
    pathViewContainer.attr("transform", "translate(" + prevTranslate + ")scale(" + prevScale + ")");  
  }
  
  //console.log(filteredPathViewNodes);
  //console.log(filteredPathViewLinks);

  force.nodes(filteredPathViewNodes)
        .links(filteredPathViewLinks)
        .start();

    var link = pathViewContainer.selectAll(".pathviewlink")
      .data(filteredPathViewLinks)
      .enter()
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "pathviewlink")
      .style("stroke",function(d){
        return colorLinkBasedOnNodes(d.source.sectorColor,d.target.sectorColor);
      })
      .style("stroke-width",function(d){
        var width = getAllianceCountBetweenCompanies(d.source.name,d.target.name);
        return (((8-1)*(width)))/(23)+1;
      }).style("opacity",0.5);
      
    filteredPathViewLinks.forEach(function(d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
          linkedByIndex[d.target.index + "," + d.source.index] = 1;
        });

    var node = pathViewContainer.selectAll(".pathviewnode")
      .data(filteredPathViewNodes)
      .enter().append("g")
      .attr("class", "pathviewnode")
      .on("mouseover", pathViewMouseover)
      .on("click", pathViewMouseclick)
      .on("mouseout", pathViewMouseout)
      .style("opacity",0.7)
      .attr("fill",function(d){
        if($('#coloring').val()=="bytype"){
            return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
        }
        else if($('#coloring').val()=="bysector"){
            return colorBasedOnSector(d.sectorColor);
        }
        else{
              return isExpanded(d.name)==1? "#000000" : "#77777E";
        }
      })
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
          //isExpanded(d.name)==1?removePartners(d.name):addPartners(d.name);
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
          //isExpanded(d.name)==1?removePartners(d.name):addPartners(d.name);
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
          //isExpanded(d.name)==1?removePartners(d.name):addPartners(d.name);
          $('#viz').fadeOut();
          $('#spinner').fadeIn(function(){
          isExpanded(d.name)==1?removePartners(d.name,function() {
              $('#spinner').fadeOut();
          }):addPartners(d.name,function() {
              $('#spinner').fadeOut();
          });
        });
            $('#viz').fadeIn();
      }).style("opacity",0.7);
         
  }

  

  d3.selectAll(".pathviewnode")
  .append("text")
  .attr("class",function(d){
          if(isExpanded(d.name)==1){
            return "fixedLabel";
          }})
  .attr("fill","black")
  .attr("dx", 12)
  .attr("dy", ".35em")
  .attr("style", "font-family:sans-serif;")
  .attr("style", function(d){
    var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
    return "font-size:"+size; 
  })
  .text(function(d){if(isExpanded(d.name)){return d.name;}});

  force.on("tick", function() {
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
  pathViewLinks=link;
  
}

// ----- path view specific code ends here -----

// scatternet specific code

function computeScatternetLinks(){
    var scatternetLinks=[];
    //console.log(globalLinks);
    //console.log(globalNodes);
    for(var i=0;i<globalNodes.length;i++){
      for(var j=0;j<globalAllAlliances.length;j++){
        if(globalAllAlliances[j]['company2']==globalNodes[i]['name']){
          var sourceCompanyName = globalAllAlliances[j]['company1'];
          var targetCompanyName = globalAllAlliances[j]['company2'];
          var sourceIndex,targetIndex;
          if(companyExistsInNodes(sourceCompanyName)!=-1 && companyExistsInNodes(targetCompanyName)!=-1){
            sourceIndex = companyExistsInNodes(sourceCompanyName);
            targetIndex = companyExistsInNodes(targetCompanyName);
          }  
          if(entryExistsInLinks({"source":sourceIndex,"target":targetIndex},scatternetLinks)==0){
            scatternetLinks.push({"source":sourceIndex,"target":targetIndex});
          }
        }else if(globalAllAlliances[j]["company1"]==globalNodes[i]['name']){
          var sourceCompanyName = globalAllAlliances[j]['company2'];
          var targetCompanyName = globalAllAlliances[j]['company1'];
          var sourceIndex,targetIndex;
          if(companyExistsInNodes(sourceCompanyName)!=-1 && companyExistsInNodes(targetCompanyName)!=-1){
            sourceIndex = companyExistsInNodes(sourceCompanyName);
            targetIndex = companyExistsInNodes(targetCompanyName);
          }          
          
          if(entryExistsInLinks({"source":sourceIndex,"target":targetIndex},scatternetLinks)==0){
            scatternetLinks.push({"source":sourceIndex,"target":targetIndex});
          }
        }
      }
    }
    //console.log(scatternetLinks);
    var linksToSend=[];
    for(var i=0;i<scatternetLinks.length;i++){
      if(typeof(scatternetLinks[i]['source'])!='undefined' && typeof(scatternetLinks[i]['target'])!='undefined'){
        linksToSend.push(scatternetLinks[i]);
      }
    }
    return linksToSend;
}

function filterScatternet(){
filteredScatterNetNodes=[];
filteredScatterNetLinks=[];
var effQuarter = parseInt($("#effquarter").val());
var endQuarter = parseInt($("#endquarter").val());
var effYear = parseInt($("#effyear").val());
var endYear = parseInt($("#endyear").val());

if($("#noreltypefilter").is(":checked") && effQuarter==1 && endQuarter==4 && endYear==2012 && effYear==1990){
  for(var i=0;i<globalNodes.length;i++){
    filteredScatterNetNodes.push(globalNodes[i]);
  }
  filteredScatterNetLinks = computeScatternetLinks();
}else{
  
var relationshipTypesToShow = [],showCB=0,showJV=0;
if($("#showrnd").is(":checked")){
  relationshipTypesToShow.push("R&D");
}
if($("#showmanufacturing").is(":checked")){
  relationshipTypesToShow.push("Manufacturing");
}
if($("#showoem").is(":checked")){
  relationshipTypesToShow.push("OEM");
}
if($("#showlicensing").is(":checked")){
  relationshipTypesToShow.push("Licensing");
}
if($("#showtechtrans").is(":checked")){
  relationshipTypesToShow.push("Techtrans");
}
if($("#showmarketing").is(":checked")){
  relationshipTypesToShow.push("Marketing");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showsupply").is(":checked")){
  relationshipTypesToShow.push("Supply");
}
if($("#showcrossborder").is(":checked")){
  showCB=1;
}
if($("#showjointventure").is(":checked")){
  showJV=1;
}
    //console.log("ehre")
    var currentScatternetLinks = computeScatternetLinks();
    for(var i=0;i<currentScatternetLinks.length;i++){
        
        var sourceCompany=getCompanyAtIndex(currentScatternetLinks[i]['source']);
        var targetCompany=getCompanyAtIndex(currentScatternetLinks[i]['target']);

        var linkEffQuarter = getEffectiveQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedQuarter = getTerminatedQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedYear = getTerminatedYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkEffYear = getEffectiveYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);

        if(linkTerminatedYear==-1){
          if(linkEffYear!=-1){
            if(linkEffYear<effYear){              
              addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
            }else if(linkEffYear==effYear){
              if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter && linkEffQuarter>=effQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }else{
                addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
              }
            }else{
              if(linkEffYear<endYear){
                addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }else{
          if(linkEffYear!=-1){
            if(linkEffYear<effyear){
                if(linkTerminatedYear>endYear){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkTerminatedQuarter>=endQuarter){
                    addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
            }else if(linkEffYear==effYear){
              if(linkTerminatedYear>endYear){
                if(linkEffQuarter>=effQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkEffQuarter>=effQuarter && linkTerminatedQuarter<=endQuarter){
                    addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
              }
            }else{
              if(linkTerminatedYear>endYear){
                addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkTerminatedYear==endYear){
                if(linkTerminatedQuarter<=endQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }


        /*if(linkEffQuarter>=effQuarter && linkEffYear>=effYear && linkTerminatedYear<=endYear && linkTerminatedQuarter<=endQuarter){
        var allTypesInCurrentEdge,flag=0;

        allTypesInCurrentEdge = getAllAllianceTypesBetween(sourceCompany['name'],targetCompany['name']);
        
        for(var j=0;j<relationshipTypesToShow.length;j++){
          if(objectIsInList(relationshipTypesToShow[j],allTypesInCurrentEdge)==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
            flag=1;
            break;
          }
        }
        if(flag==1){
              continue;
        }
        if(showCB==1){
          if(edgeHasCrossBorderAlliance(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
          }
          continue;
        }
        if(showJV==1){
          if(edgeHasJointVenture(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
            continue;
          }
        }
        if(relationshipTypesToShow.length==0){
              if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
        }
  }*/
}//end of loop
}
drawScatternetView();
}


function addLinkToScatternet(currentlink,relationshipTypesToShow,showJV,showCB){        
        var allTypesInCurrentEdge,flag=0;
        var sourceCompany=getCompanyAtIndex(currentlink['source']);
        var targetCompany=getCompanyAtIndex(currentlink['target']);
        allTypesInCurrentEdge = getAllAllianceTypesBetween(sourceCompany['name'],targetCompany['name']);
        
        for(var j=0;j<relationshipTypesToShow.length;j++){
          if(objectIsInList(relationshipTypesToShow[j],allTypesInCurrentEdge)==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentlink,filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentlink);
            }
            flag=1;
            break;
          }
        }
        if(flag==1){
        }else{  
        if(showCB==1){
          if(edgeHasCrossBorderAlliance(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentlink,filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentlink);
            }
          }
        }else{
        if(showJV==1){
          if(edgeHasJointVenture(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentlink,filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentlink);
            }
          }
        }else{


        if(relationshipTypesToShow.length==0){
              if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentlink,filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentlink);
            }
        }
        }
      }
    }
  }


function filterScatternetWithLoader(callback){
filteredScatterNetNodes=[];
filteredScatterNetLinks=[];
var effQuarter = parseInt($("#effquarter").val());
var endQuarter = parseInt($("#endquarter").val());
var effYear = parseInt($("#effyear").val());
var endYear = parseInt($("#endyear").val());

if($("#noreltypefilter").is(":checked") && effQuarter==1 && endQuarter==4 && endYear==2012 && effYear==1990){
  for(var i=0;i<globalNodes.length;i++){
    filteredScatterNetNodes.push(globalNodes[i]);
  }
  filteredScatterNetLinks = computeScatternetLinks();
}else{
  
var relationshipTypesToShow = [],showCB=0,showJV=0;
if($("#showrnd").is(":checked")){
  relationshipTypesToShow.push("R&D");
}
if($("#showmanufacturing").is(":checked")){
  relationshipTypesToShow.push("Manufacturing");
}
if($("#showoem").is(":checked")){
  relationshipTypesToShow.push("OEM");
}
if($("#showlicensing").is(":checked")){
  relationshipTypesToShow.push("Licensing");
}
if($("#showtechtrans").is(":checked")){
  relationshipTypesToShow.push("Techtrans");
}
if($("#showmarketing").is(":checked")){
  relationshipTypesToShow.push("Marketing");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showsupply").is(":checked")){
  relationshipTypesToShow.push("Supply");
}
if($("#showcrossborder").is(":checked")){
  showCB=1;
}
if($("#showjointventure").is(":checked")){
  showJV=1;
}
    //console.log("ehre")
    var currentScatternetLinks = computeScatternetLinks();
    for(var i=0;i<currentScatternetLinks.length;i++){
        var sourceCompany=getCompanyAtIndex(currentScatternetLinks[i]['source']);
        var targetCompany=getCompanyAtIndex(currentScatternetLinks[i]['target']);
        var linkEffQuarter = getEffectiveQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedQuarter = getTerminatedQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedYear = getTerminatedYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkEffYear = getEffectiveYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        if(linkTerminatedYear==-1){
          if(linkEffYear!=-1){
            if(linkEffYear<effYear){              
              addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
            }else if(linkEffYear==effYear){
              if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter && linkEffQuarter>=effQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }else{
                addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
              }
            }else{
              if(linkEffYear<endYear){
                addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }else{
          if(linkEffYear!=-1){
            if(linkEffYear<effyear){
                if(linkTerminatedYear>endYear){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkTerminatedQuarter>=endQuarter){
                    addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
            }else if(linkEffYear==effYear){
              if(linkTerminatedYear>endYear){
                if(linkEffQuarter>=effQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkEffQuarter>=effQuarter && linkTerminatedQuarter<=endQuarter){
                    addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
              }
            }else{
              if(linkTerminatedYear>endYear){
                addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkTerminatedYear==endYear){
                if(linkTerminatedQuarter<=endQuarter){
                  addLinkToScatternet(currentScatternetLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }
        /*if(linkEffQuarter>=effQuarter && linkEffYear>=effYear && linkTerminatedYear<=endYear && linkTerminatedQuarter<=endQuarter){
        var allTypesInCurrentEdge,flag=0;
 

        allTypesInCurrentEdge = getAllAllianceTypesBetween(sourceCompany['name'],targetCompany['name']);
        
        for(var j=0;j<relationshipTypesToShow.length;j++){
          if(objectIsInList(relationshipTypesToShow[j],allTypesInCurrentEdge)==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
            flag=1;
            break;
          }
        }
        if(flag==1){
              continue;
        }
        if(showCB==1){
          if(edgeHasCrossBorderAlliance(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
          }
          continue;
        }
        if(showJV==1){
          if(edgeHasJointVenture(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
            continue;
          }
        }
        if(relationshipTypesToShow.length==0){
              if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredScatterNetNodes.push(targetCompany);
            }
            if(objectIsInList(currentScatternetLinks[i],filteredScatterNetLinks)==0){
              filteredScatterNetLinks.push(currentScatternetLinks[i]);
            }
        }
  }*/
}//end of loop
}
drawScatternetView();
callback.call(this);
}


function drawScatternetView(){
    d3.selectAll("svg").remove();
    //d3.selectAll(".tooltip").remove();
    d3.select("#viz").on("dblclick",""); // added because of the double click to expand function of the detailed links view feature
    
    /*
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    */

    var margins = {
            "left": 60,
            "right": 30,
            "top": 30,
            "bottom": 30
    };

    var xAxisVal=document.getElementById("xaxis").value;
    var yAxisVal=document.getElementById("yaxis").value;

    var width = document.getElementById("viz").offsetWidth;
    var height = document.getElementById("viz").offsetHeight;
    
    var svg = d3.select("#viz").append("svg").attr("width", "100%").attr("height", height).append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    var x,y; 
    if($("#scatternetscale").val()=="linear"){
      x=d3.scale.linear();
      y=d3.scale.linear();
    }else{
      x=d3.scale.log();
      y=d3.scale.log();
    }
     
    
        x.domain(d3.extent(filteredScatterNetNodes, function (d) {
        if(document.getElementById("xaxis").value=="allianceCount"){
                return d.allianceCount;
        }else if(document.getElementById("xaxis").value=="highPrice"){
                return d.highPrice;
        }else if(document.getElementById("xaxis").value=="companySize"){
                return d.companySize;
        }
      }))
        .range([0, width - margins.left - margins.right]);// the range maps the domain to values from 0 to the width minus the left and right margins (used to space out the visualization)

    // this does the same as for the y axis but maps from the allianceCount variable to the height to 0. 
    
        y.domain(d3.extent(filteredScatterNetNodes, function (d) {
        if(document.getElementById("yaxis").value=="allianceCount"){
                return d.allianceCount;
        }else if(document.getElementById("yaxis").value=="highPrice"){
                return d.highPrice;
        }else if(document.getElementById("yaxis").value=="companySize"){
                return d.companySize;
        }
    }))
    .range([height - margins.top - margins.bottom, 0]);// Note that height goes first due to the SVG coordinate system


    //console.log(y.range()[1]);
    //console.log(x.range()[0]);
    
    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "scatternet_x_axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "scatternet_y_axis");

    /*d3.select("#viz").call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", scatternetZoom));*/
    // this is the actual definition of our x and y axes. The orientation refers to where the labels appear - for the x axis, below or above the line, and for the y axis, left or right of the line. Tick padding refers to how much space between the tick and the label. There are other parameters too - see https://github.com/mbostock/d3/wiki/SVG-Axes for more information
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2).innerTickSize(-y.range()[0])
    .outerTickSize(0);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2).innerTickSize(-x.range()[1])
    .outerTickSize(0);

    // this is where we select the axis we created a few lines earlier. See how we select the axis item. in our svg we appended a g element with a x/y and axis class. To pull that back up, we do this svg select, then 'call' the appropriate axis object for rendering.    
    svg.selectAll("g.scatternet_y_axis").call(yAxis);
    svg.selectAll("g.scatternet_x_axis").call(xAxis);

    // now, we can get down to the data part, and drawing stuff. We are telling D3 that all nodes (g elements with class node) will have data attached to them. The 'key' we use (to let D3 know the uniqueness of items) will be the name. Not usually a great key, but fine for this example.
    var node = svg.selectAll("g.scatternetnode")
          .data(filteredScatterNetNodes, function (d) {
              return d.name;
          });

    // we 'enter' the data, making the SVG group (to contain a circle and text) with a class node. This corresponds with what we told the data it should be above.    
    var link;
    var scatternetLinks = [];
    if(globalLinks.length>1){
      scatternetLinks = filteredScatterNetLinks;
    }


    link = svg.selectAll(".scatternetlink")
          .data(scatternetLinks)
          .enter()
          .append("path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("class", "scatternetlink");

    link.attr("d", function(i){
            var dx = x(globalNodes[i.target][xAxisVal]) - x(globalNodes[i.source][xAxisVal]),
                dy = x(globalNodes[i.target][yAxisVal]) - y(globalNodes[i.source][yAxisVal]),
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + 
                x(globalNodes[i.source][xAxisVal]) + "," + 
                y(globalNodes[i.source][yAxisVal]) + "A" + 
                dr + "," + dr + " 0 0,1 " + 
                x(globalNodes[i.target][xAxisVal]) + "," + 
                y(globalNodes[i.target][yAxisVal]);
    }).style("stroke-width",function(d){
        var width = getAllianceCountBetweenCompanies(globalNodes[d.source]['name'],globalNodes[d.target]['name']);
        return (((8-1)*(width)))/(23)+1;
    });

    d3.selectAll(".scatternetlink").style("opacity",0);

    //console.log(globalLinks);
    var nodeGroup = node.enter().append("g").attr("class", "scatternetnode")
    // this is how we set the position of the items. Translate is an incredibly useful function for rotating and positioning items 
    .attr('transform', function (d) {
        return "translate(" + x(d[xAxisVal]) + "," + y(d[yAxisVal]) + ")";
    })
    .on("click",function(d){
        for(var i=0;i<filteredScatterNetNodes.length;i++){
    filteredScatterNetNodes[i]['selected']="false";
    if(filteredScatterNetNodes[i]['name']==d.name){
      filteredScatterNetNodes[i]['selected']="true";
    }
  }
  d3.selectAll(".scatternetdot")
    .attr("stroke",function(i){ 
      if(i.selected=="true") return "black";
    })
    .attr("stroke-width",function(i){ 
      if(i.selected=="true") return "2";
    });

    })// end of click
    .on("dblclick",function(d){
        //isExpanded(d.name)==1?removePartners(d.name):addPartners(d.name);
        $('#viz').fadeOut();
          $('#spinner').fadeIn(function(){
          isExpanded(d.name)==1?removePartners(d.name,function() {
              $('#spinner').fadeOut();
          }):addPartners(d.name,function() {
              $('#spinner').fadeOut();
          });
        });
            $('#viz').fadeIn();
    })
    .on("mouseover",function(d){ //MOUSEOVER behavior
    d3.select(this).select("circle").style("stroke","yellow").style("stroke-width","2");    
    var selectedCompanyIndex = companyExistsInNodes(d.name);
    
    d3.selectAll(".scatternetlink").style("opacity",function(i){
      if(i.source==selectedCompanyIndex || i.target==selectedCompanyIndex){
        return 1;
      }else{
        return 0;
      }
    })
    .style("stroke",function(i){
        if(i.source==selectedCompanyIndex || i.target==selectedCompanyIndex){
          return colorLinkBasedOnNodes(getSectorColor(globalNodes[i.source]['name']),getSectorColor(globalNodes[i.target]['name']));
        }else{
          return "#ccc";
        }
    });
        
    d3.selectAll(".scatternetdot")
    .style("opacity", function(i) {
               if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1){
                 return 1;
               }else{
                    return 0.05;
               }
            });

    nodeGroup.append("text")
            .attr("class","tempLabel")
            .style("text-anchor", "middle")
            .attr("fill","black")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .attr("style", "font-family:sans-serif;")
            .attr("style", function(d){
              var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
              return "font-size:"+size; 
            })
            .text(function (i) {
                  if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1){
                    var xVal,yVal;
                    if(document.getElementById("xaxis").value=="allianceCount"){
                             xVal = i.allianceCount;
                    }else if(document.getElementById("xaxis").value=="highPrice"){
                             xVal = i.highPrice;
                    }else if(document.getElementById("xaxis").value=="companySize"){
                             xVal = i.companySize;
                    }
                    if(document.getElementById("yaxis").value=="allianceCount"){
                             yVal = i.allianceCount;
                    }else if(document.getElementById("yaxis").value=="highPrice"){
                             yVal = i.highPrice;
                    }else if(document.getElementById("yaxis").value=="companySize"){
                             yVal = i.companySize;
                    }
                
                    return i.name;
               }else{
                    return "";
               }
          });
          
    nodeGroup.append("text")
            .attr("class","tempLabel")
            .style("text-anchor", "middle")
            .attr("fill","black")
            .attr("dx", 12)
            .attr("dy", function(d){
              var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
              return 16+(size/4);
            })
            .attr("style", "font-family:sans-serif;")
            .attr("style", function(d){
              var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
              return "font-size:"+size; 
            })
            .text(function (i) {
                if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1){
                    var xVal,yVal;
                    if(document.getElementById("xaxis").value=="allianceCount"){
                             xVal = i.allianceCount;
                    }else if(document.getElementById("xaxis").value=="highPrice"){
                             xVal = i.highPrice;
                    }else if(document.getElementById("xaxis").value=="companySize"){
                             xVal = i.companySize;
                    }
                    if(document.getElementById("yaxis").value=="allianceCount"){
                             yVal = i.allianceCount;
                    }else if(document.getElementById("yaxis").value=="highPrice"){
                             yVal = i.highPrice;
                    }else if(document.getElementById("yaxis").value=="companySize"){
                             yVal = i.companySize;
                    }
                    return "("+xVal+","+yVal+")";
               }else{
                    return "";
               }
          });            
      

    if($('#shaping').val()=="bytype"){
      var allRects = d3.selectAll(".scatternetnode")
          .select("rect");
      var allCircles = d3.selectAll(".scatternetnode")
          .select("circle");

      allCircles.transition().duration(500)
          .attr("r",function(i){
            if(i.name==d.name){
              var curRad = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
              return ((curRad*1.25)+"");
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
              var curWidth = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;
              return (""+(curWidth*1.25));
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
              var curHeight = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5
              return ((curHeight*1.25)+"");
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
      d3.selectAll(".scatternetnode")
          .select("circle")
          .transition().duration(500)
          .attr("r",function(i){
            if(i.name==d.name){
              var curRad = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
              return ((curRad*1.25)+"");
            }else{
              if($('#sizing').val()=="alliancecount"){
                return (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;
              }else{
                return "4";
              }
            }
          });
    }

    
    })
    .on("mouseout",function(){ // MOUSEOUT behavior
      d3.select(this).select("circle").style("stroke","").style("stroke-width","");
        d3.selectAll(".scatternetlink").style("opacity",0);
        
        d3.selectAll(".scatternetdot").style("opacity","0.6");

        d3.selectAll(".tempLabel").remove();
        
        d3.selectAll(".scatternetdot")
        .attr("fill",function(d){
             if($('#coloring').val()=="bytype"){
            return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");//"#F5F5F0";
        }
        else if($('#coloring').val()=="bysector"){
            return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
        }
        else{
              return isExpanded(d.name)==1? "#000000" : "#77777E";
        }
        });

        if($('#shaping').val()=="bytype"){
    var allRects = d3.selectAll(".scatternetnode")
        .select("rect");
    var allCircles = d3.selectAll(".scatternetnode")
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
            var nodeWidth = (((10-5)*(getNumberOfAlliances(i.name))))/(767)+5;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
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
    d3.selectAll(".scatternetnode").select("circle").transition().duration(500)
          .attr("r", function(i){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(i.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
          });
  }

    });

/*
    nodeGroup.append("circle")
        .attr("r", "4")//function(d){return d.allianceCount/2;})
        .attr("class", "scatternetdot")
        .attr("fill",function(d){
            if(d.expanded=="true"){
                return "#000000";
            }else{
                return "#77777E";
            }
        })
*/
if($('#shaping').val()=="bytype"){
    
    nodeGroup.each(function(d){
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
        .attr("fill",function(d){
            if($('#coloring').val()=="bytype"){
            return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");//"#F5F5F0";
        }
        else if($('#coloring').val()=="bysector"){
            return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
        }
        else{
              return isExpanded(d.name)==1? "#000000" : "#77777E";
        }
        });
        /*
        .append("title") // THIS IS THE PROPERTY WHICH adds the TOOLTIP 
               .text(function(d){
                    return " "+document.getElementById("xaxis").value+": " +d[document.getElementById("xaxis").value] + "," + " "+document.getElementById("yaxis").value+": " +d[document.getElementById("yaxis").value];
               });
        */    
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
        .attr("fill",function(d){
            if($('#coloring').val()=="bytype"){
            return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");//"#F5F5F0";
        }
        else if($('#coloring').val()=="bysector"){
            return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
        }
        else{
              return isExpanded(d.name)==1? "#000000" : "#77777E";
        }
        });
      }
    });  
  }
  else{
    nodeGroup.append("circle")
        .attr("r", function(d){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(d.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
        })
        .attr("class", "scatternetdot")
        .attr("fill",function(d){
            if($('#coloring').val()=="bytype"){
            return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");//"#F5F5F0";
        }
        else if($('#coloring').val()=="bysector"){
            return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
        }
        else{
              return isExpanded(d.name)==1? "#000000" : "#77777E";
        }
        });

}

    d3.selectAll(".scatternetnode")
  .append("text")
  .attr("class",function(d){
          if(isExpanded(d.name)==1){
            return "fixedLabel";
          }})
  .style("text-anchor", "middle")
  .attr("fill","black")
  .attr("dx", 12)
  .attr("dy", ".35em")
  .attr("style", "font-family:sans-serif;")
  .attr("style", function(d){
    var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
    return "font-size:"+size; 
  })
  .text(function(d){if(isExpanded(d.name)){return d.name;}});

  d3.selectAll(".tick").select("text")
  .attr("text-anchor","end")
  .attr("fill","black")
  .attr("style", "font-size: 10; font-family:sans-serif;");
  d3.selectAll(".tick").select("line")
    .style("opacity",0.15);

}


//-----------------------------------
//----------SEGMENT VIEW-------------
//-----------------------------------

function segmentViewSearch(searchKey){
  var allNodesOnScreen ;
  d3.selectAll(".searchLabel").remove();
  if (searchKey=="") {
      allNodesOnScreen = d3.selectAll(".segmentViewCompleteNode")
          .each(function(d) {
          d3.select(this).style("opacity",0.7);
          if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }
          else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
    });
  }else{
    allNodesOnScreen = d3.selectAll(".segmentViewCompleteNode")
    .each(function(d) {
      if(d.name!="" && d.name.toLowerCase().indexOf(searchKey) > -1)
      {
        d3.select(this).style("opacity",1).append("text")
        .attr("class","searchLabel")
        .attr("fill","black")
        .attr("x", getXForExistingCompany(d.name)+5)
        .attr("y", getYForExistingCompany(d.name)+5)
        .attr("style", "font-family:sans-serif;")
        .attr("style", function(d){
          var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
          return "font-size:"+size; 
        })
        .text(function() { return d.name;});
      }
      else{
        d3.select(this).style("opacity",0.05);
          if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);
            });
          }else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
      }
    });
}
}

function sectorCentroidComputed(forSector,sectorList){
  for(var i=0;i<sectorList.length;i++){
    if(sectorList[i]['sector']==forSector){
      return 1;
    }
  }
  return 0;
}

var existingXYPairs = [];

function getXForNode(sectorList,centroidsList){
  var sumX=0;
  for(var i=0;i<sectorList.length;i++){
    for(var j=0;j<centroidsList.length;j++){
      if(centroidsList[j]['sector']==sectorList[i]){
        sumX+=centroidsList[j]['centroidX'];
        break;
      }
    }    
  }
  var actualValue = sumX/sectorList.length;
  var newX = actualValue+(Math.random()*25);
  return newX;
}

function getYForNode(sectorList,centroidsList){
  var sumY=0;
  for(var i=0;i<sectorList.length;i++){
    for(var j=0;j<centroidsList.length;j++){
      if(centroidsList[j]['sector']==sectorList[i]){
        sumY+=centroidsList[j]['centroidY'];
        break;
      }
    }    
  }
  var actualValue = sumY/sectorList.length;
  var newY = actualValue+(Math.random()*10);
  return newY;
}

function isPresentInExistingLocations(newX,newY){
  for(var i=0;i<existingXYPairs.length;i++){
    if(newX==existingXYPairs[i]['x'] && newY==existingXYPairs[i]['y']){
      return 1;
    }
  }
}

function getArcColor(forSector){
  if(forSector=="Hardware Components"){
    return "#3366CC";
  }else if(forSector=="Hardware Equipment"){
    return "#DC3912";
  }else if(forSector=="Software"){
    return "#FF9900";
  }else if(forSector=="Media"){
    return "#990099";
  }else if(forSector=="Telecommunications"){
    return "#109618";
  }else if(forSector=="others"){
    return "#8B4513";
  }
}

function getCenterX(sectorCentroidsList){
  var sumX=0;
  for(var i=0;i<sectorCentroidsList.length;i++){
    sumX+=sectorCentroidsList[i]['centroidX'];
  }
  return sumX/sectorCentroidsList.length;
}

function getCenterY(sectorCentroidsList){
  var sumY=0;
  for(var i=0;i<sectorCentroidsList.length;i++){
    sumY+=sectorCentroidsList[i]['centroidY'];
  }
  return sumY/sectorCentroidsList.length;
}

function getXForExistingCompany(forCompany){
  for(var i=0;i<existingXYPairs.length;i++){
    if (forCompany==existingXYPairs[i]['company']){
      return existingXYPairs[i]['x'];
    }
  }
}

function getYForExistingCompany(forCompany){
  for(var i=0;i<existingXYPairs.length;i++){
    if (forCompany==existingXYPairs[i]['company']){
      return existingXYPairs[i]['y'];
    }
  }
}

function companyExistsInXYPairs(forCompany){
  for(var i=0;i<existingXYPairs.length;i++){
    if (forCompany==existingXYPairs[i]['company']){
      return 1;
    }
  } 
}

function isAroundCentroid(x,y,sectorCentroids){

  for(var i=0;i<sectorCentroids.length;i++){
    //left and top of centroid
    if((x>=sectorCentroids[i]['centroidX']-30 && x<=sectorCentroids[i]['centroidX']) && (y>=sectorCentroids[i]['centroidY']-30 && y<=sectorCentroids[i]['centroidY'])){
      return 2;      
    }//right and bottom of centroid
    if((x<=sectorCentroids[i]['centroidX']+30 && x>=sectorCentroids[i]['centroidX']) && (y<=sectorCentroids[i]['centroidY']+30 && y>=sectorCentroids[i]['centroidY'])){
      return 4;      
    }
    //left and bottom of centroid
    if((x>=sectorCentroids[i]['centroidX']-30 && x<=sectorCentroids[i]['centroidX']) && (y<=sectorCentroids[i]['centroidY']+30 && y>=sectorCentroids[i]['centroidY'])){
      return 3;      
    }//right and top of centroid
    if((x<=sectorCentroids[i]['centroidX']+30 && x>=sectorCentroids[i]['centroidX']) && (y>=sectorCentroids[i]['centroidY']-30 && y<=sectorCentroids[i]['centroidY'])){
      return 1;      
    }
  }
  return 0;
}

function computeSegmentViewLinks(){
    var segmentViewLinks=[];
    //console.log(globalNodes.length);
    for(var i=0;i<globalNodes.length;i++){
      for(var j=0;j<globalAllAlliances.length;j++){
        if(globalAllAlliances[j]['company2']==globalNodes[i]['name']){
          var sourceCompanyName = globalAllAlliances[j]['company1'];
          var targetCompanyName = globalAllAlliances[j]['company2'];
          var sourceIndex,targetIndex;
          if(companyExistsInNodes(sourceCompanyName)!=-1 && companyExistsInNodes(targetCompanyName)!=-1){
            sourceIndex = companyExistsInNodes(sourceCompanyName);
            targetIndex = companyExistsInNodes(targetCompanyName);
          }  
          if(entryExistsInLinks({"source":sourceIndex,"target":targetIndex},segmentViewLinks)==0){
            segmentViewLinks.push({"source":sourceIndex,"target":targetIndex});
          }
        }else if(globalAllAlliances[j]["company1"]==globalNodes[i]['name']){
          var sourceCompanyName = globalAllAlliances[j]['company2'];
          var targetCompanyName = globalAllAlliances[j]['company1'];
          var sourceIndex,targetIndex;
          if(companyExistsInNodes(sourceCompanyName)!=-1 && companyExistsInNodes(targetCompanyName)!=-1){
            sourceIndex = companyExistsInNodes(sourceCompanyName);
            targetIndex = companyExistsInNodes(targetCompanyName);
          }          
          
          if(entryExistsInLinks({"source":sourceIndex,"target":targetIndex},segmentViewLinks)==0){
            segmentViewLinks.push({"source":sourceIndex,"target":targetIndex});
          }
        }
      }
      
}
var linksToSend=[];
    for(var i=0;i<segmentViewLinks.length;i++){
      if(typeof(segmentViewLinks[i]['source'])!='undefined' && typeof(segmentViewLinks[i]['target'])!='undefined'){
        linksToSend.push(segmentViewLinks[i]);
      }
    }
return linksToSend;
}
function segmentViewZoomed(){
  if(firstMoveOnSegmentView==1){
    console.log("in here")
    var width = document.getElementById("viz").offsetWidth;
    var height = document.getElementById("viz").offsetHeight;
    segmentViewContainer.attr("transform", "translate(" +d3.event.translate+ ")scale(" + d3.event.scale + ")");  
    console.log(d3.event.translate)
    segViewPrevScale=d3.event.scale;
    segViewPrevTranslate=d3.event.translate;
    firstMoveOnSegmentView=0;
  }else{
    console.log("now here")
    segmentViewContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    segViewPrevScale=d3.event.scale;
    segViewPrevTranslate=d3.event.translate;
  }
}
var segmentViewContainer;
var segViewPrevTranslate=[0,0];
var segViewPrevScale=0; 
var segmentViewZoom = d3.behavior.zoom()
    .scaleExtent([0.5, 25])
    .on("zoom", segmentViewZoomed);

function getCheckedSegments(){
  var segmentCounts = [
        {"sector":"Hardware Components","count": 1794},
        {"sector":"Software","count": 12893},
        {"sector":"Telecommunications","count": 2628},
        {"sector":"others","count": 10711},
        {"sector":"Hardware Equipment","count": 2931},
        {"sector":"Media","count": 3984}
      ];
  var segmentsToInclude = [];
  if($("#allsegments").is(":checked")){
    existingXYPairs=[];
    return segmentCounts;
  }else{
    if($("#software").is(":checked")){
      segmentsToInclude.push(segmentCounts[1]);
    }
    if($("#telecom").is(":checked")){
      segmentsToInclude.push(segmentCounts[2]);
    }
    if($("#media").is(":checked")){
      segmentsToInclude.push(segmentCounts[5]);
    }
    if($("#hardwarecomponents").is(":checked")){
      segmentsToInclude.push(segmentCounts[0]);
    }
    if($("#hardwareequipments").is(":checked")){
      segmentsToInclude.push(segmentCounts[4]);
    }
    if($("#others").is(":checked")){
      segmentsToInclude.push(segmentCounts[3]);
    }
  }
  existingXYPairs=[];
  return segmentsToInclude;
}

function filterSegmentView(){
filteredSegmentViewLinks=[];
filteredSegmentViewNodes=[];
var effQuarter = parseInt($("#effquarter").val());
var endQuarter = parseInt($("#endquarter").val());
var effYear = parseInt($("#effyear").val());
var endYear = parseInt($("#endyear").val());

if($("#noreltypefilter").is(":checked") && effQuarter==1 && endQuarter==4 && endYear==2012 && effYear==1990){

  for(var i=0;i<globalNodes.length;i++){
    filteredSegmentViewNodes.push(globalNodes[i]);
  }
  filteredSegmentViewLinks = computeSegmentViewLinks();
}else{
  
var relationshipTypesToShow = [],showCB=0,showJV=0;
if($("#showrnd").is(":checked")){
  relationshipTypesToShow.push("R&D");
}
if($("#showmanufacturing").is(":checked")){
  relationshipTypesToShow.push("Manufacturing");
}
if($("#showoem").is(":checked")){
  relationshipTypesToShow.push("OEM");
}
if($("#showlicensing").is(":checked")){
  relationshipTypesToShow.push("Licensing");
}
if($("#showtechtrans").is(":checked")){
  relationshipTypesToShow.push("Techtrans");
}
if($("#showmarketing").is(":checked")){
  relationshipTypesToShow.push("Marketing");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showsupply").is(":checked")){
  relationshipTypesToShow.push("Supply");
}
if($("#showcrossborder").is(":checked")){
  showCB=1;
}
if($("#showjointventure").is(":checked")){
  showJV=1;
}
    //console.log("ehre")
    var currentSegmentViewLinks = computeSegmentViewLinks();
    for(var i=0;i<currentSegmentViewLinks.length;i++){
        var sourceCompany=getCompanyAtIndex(currentSegmentViewLinks[i]['source']);
        var targetCompany=getCompanyAtIndex(currentSegmentViewLinks[i]['target']);
        var linkEffQuarter = getEffectiveQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedQuarter = getTerminatedQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedYear = getTerminatedYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkEffYear = getEffectiveYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        if(linkTerminatedYear==-1){
          if(linkEffYear!=-1){
            if(linkEffYear<effYear){              
              addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
            }else if(linkEffYear==effYear){
              if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter && linkEffQuarter>=effQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }else{
                addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
              }
            }else{
              if(linkEffYear<endYear){
                addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }else{
          if(linkEffYear!=-1){
            if(linkEffYear<effyear){
                if(linkTerminatedYear>endYear){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkTerminatedQuarter>=endQuarter){
                    addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
            }else if(linkEffYear==effYear){
              if(linkTerminatedYear>endYear){
                if(linkEffQuarter>=effQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkEffQuarter>=effQuarter && linkTerminatedQuarter<=endQuarter){
                    addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
              }
            }else{
              if(linkTerminatedYear>endYear){
                addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkTerminatedYear==endYear){
                if(linkTerminatedQuarter<=endQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }
  }
}
drawSegmentView();
}


function addLinkToSegmentView(currentLink,relationshipTypesToShow,showJV,showCB){
var sourceCompany=getCompanyAtIndex(currentLink['source']);
var targetCompany=getCompanyAtIndex(currentLink['target']);
var allTypesInCurrentEdge,flag=0;
allTypesInCurrentEdge = getAllAllianceTypesBetween(sourceCompany['name'],targetCompany['name']);
  for(var j=0;j<relationshipTypesToShow.length;j++){
          if(objectIsInList(relationshipTypesToShow[j],allTypesInCurrentEdge)==1){
            if(objectIsInList(sourceCompany,filteredSegmentViewNodes)==0){
              filteredSegmentViewNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredSegmentViewNodes)==0){
              filteredSegmentViewNodes.push(targetCompany);
            }
            if(objectIsInList(currentLink,filteredSegmentViewLinks)==0){
              filteredSegmentViewLinks.push(currentLink);
            }
            flag=1;
            break;
          }
        }if(flag==1){

        }else{
        if(showCB==1){
          if(edgeHasCrossBorderAlliance(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredSegmentViewNodes)==0){
              filteredSegmentViewNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredSegmentViewNodes)==0){
              filteredSegmentViewNodes.push(targetCompany);
            }
            if(objectIsInList(currentLink,filteredSegmentViewLinks)==0){
              filteredSegmentViewLinks.push(currentLink);
            }
          }
        }else{
        if(showJV==1){
          if(edgeHasJointVenture(sourceCompany['name'],targetCompany['name'])==1){
            if(objectIsInList(sourceCompany,filteredSegmentViewNodes)==0){
              filteredSegmentViewNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredSegmentViewNodes)==0){
              filteredSegmentViewNodes.push(targetCompany);
            }
            if(objectIsInList(currentLink,filteredSegmentViewLinks)==0){
              filteredSegmentViewLinks.push(currentLink);
            }
          }
        }else{
        if(relationshipTypesToShow.length==0){
              if(objectIsInList(sourceCompany,filteredScatterNetNodes)==0){
              filteredSegmentViewNodes.push(sourceCompany);
            }
            if(objectIsInList(targetCompany,filteredScatterNetNodes)==0){
              filteredSegmentViewNodes.push(targetCompany);
            }
            if(objectIsInList(currentLink,filteredScatterNetLinks)==0){
              filteredSegmentViewLinks.push(currentLink);
            }
        }
        }
      }
    }
}


function filterSegmentViewWithLoader(callback){
filteredSegmentViewLinks=[];
filteredSegmentViewNodes=[];
var effQuarter = parseInt($("#effquarter").val());
var endQuarter = parseInt($("#endquarter").val());
var effYear = parseInt($("#effyear").val());
var endYear = parseInt($("#endyear").val());

if($("#noreltypefilter").is(":checked") && effQuarter==1 && endQuarter==4 && endYear==2012 && effYear==1990){

  for(var i=0;i<globalNodes.length;i++){
    filteredSegmentViewNodes.push(globalNodes[i]);
  }
  filteredSegmentViewLinks = computeSegmentViewLinks();
}else{
  
var relationshipTypesToShow = [],showCB=0,showJV=0;
if($("#showrnd").is(":checked")){
  relationshipTypesToShow.push("R&D");
}
if($("#showmanufacturing").is(":checked")){
  relationshipTypesToShow.push("Manufacturing");
}
if($("#showoem").is(":checked")){
  relationshipTypesToShow.push("OEM");
}
if($("#showlicensing").is(":checked")){
  relationshipTypesToShow.push("Licensing");
}
if($("#showtechtrans").is(":checked")){
  relationshipTypesToShow.push("Techtrans");
}
if($("#showmarketing").is(":checked")){
  relationshipTypesToShow.push("Marketing");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showstrategic").is(":checked")){
  relationshipTypesToShow.push("Strategic");
}
if($("#showsupply").is(":checked")){
  relationshipTypesToShow.push("Supply");
}
if($("#showcrossborder").is(":checked")){
  showCB=1;
}
if($("#showjointventure").is(":checked")){
  showJV=1;
}
    //console.log("ehre")
    var currentSegmentViewLinks = computeSegmentViewLinks();
    for(var i=0;i<currentSegmentViewLinks.length;i++){
        var sourceCompany=getCompanyAtIndex(currentSegmentViewLinks[i]['source']);
        var targetCompany=getCompanyAtIndex(currentSegmentViewLinks[i]['target']);
        var linkEffQuarter = getEffectiveQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedQuarter = getTerminatedQuarterOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkTerminatedYear = getTerminatedYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        var linkEffYear = getEffectiveYearOfAlliancesBetweenCompanies(sourceCompany['name'],targetCompany['name']);
        if(linkTerminatedYear==-1){
          if(linkEffYear!=-1){
            if(linkEffYear<effYear){              
              addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
            }else if(linkEffYear==effYear){
              if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter && linkEffQuarter>=effQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }else{
                addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
              }
            }else{
              if(linkEffYear<endYear){
                addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkEffYear==endYear){
                if(linkEffQuarter<=endQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }else{
          if(linkEffYear!=-1){
            if(linkEffYear<effyear){
                if(linkTerminatedYear>endYear){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkTerminatedQuarter>=endQuarter){
                    addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
            }else if(linkEffYear==effYear){
              if(linkTerminatedYear>endYear){
                if(linkEffQuarter>=effQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }else if(linkTerminatedYear==endYear){
                  if(linkEffQuarter>=effQuarter && linkTerminatedQuarter<=endQuarter){
                    addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                  }
                }
              }
            }else{
              if(linkTerminatedYear>endYear){
                addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
              }else if(linkTerminatedYear==endYear){
                if(linkTerminatedQuarter<=endQuarter){
                  addLinkToSegmentView(currentSegmentViewLinks[i],relationshipTypesToShow,showJV,showCB);
                }
              }
            }
          }
        }
  }
}
drawSegmentView();
callback.call(this);
}

var firstMoveOnSegmentView=1;
function drawSegmentView() {

d3.selectAll("svg").remove();
d3.select("#viz").on("dblclick","");

var margin = {top:40,left:140,right:40,bottom:40};
var width = document.getElementById("viz").offsetWidth;
var height = document.getElementById("viz").offsetHeight;
var radius = Math.min(width,height)/2;
var labelr = radius ;

var arc = d3.svg.arc()  
         .outerRadius(radius-10)
         .innerRadius(radius-25);

var arcOver = d3.svg.arc()  
.outerRadius(radius +10)
.innerRadius(0);

var svg = d3.select("#viz").append("svg")
          .attr("width",width)
          .attr("height",height)
          .call(segmentViewZoom).on("dblclick.zoom",null);

segmentViewContainer=svg.append("g")
          .attr("class","segmentviewcontainer")
          .attr("transform","translate("+width/2+","+height/2+")");

if(segViewPrevTranslate!=[0,0] && segViewPrevScale!=0){
    segmentViewContainer.attr("transform", "translate(" + segViewPrevTranslate + ")scale(" + segViewPrevScale + ")");  
}          
var segmentsToInclude = getCheckedSegments();

var pie = d3.layout.pie()
          .sort(null)
          .value(function(d){return d.count;});

var sectorCentroids=[];

var g = segmentViewContainer.selectAll(".arc")
        .data(pie(segmentsToInclude))
        .enter()
        .append("g")
        .attr("class","arc")
        .on("click",function(d){
          console.log(d.data.sector,d.data.count);
        });
        
    g.append("path")
    .attr("d",arc)
    .style("fill",function(d){return getArcColor(d.data.sector);});


    g.each(function(d){
      if(sectorCentroidComputed(d.data.sector,sectorCentroids)==0){
        centroidX=arc.centroid(d)[0];
        centroidY=arc.centroid(d)[1];
        sectorCentroids.push({"sector":d.data.sector,"centroidX":centroidX,"centroidY":centroidY});
      }
    });

    g.style("opacity",0.8)
        .on("mouseover",function(d){
          d3.selectAll(".segmentViewNode")
            .style("stroke",function(i){
              for(var x=0;x<i['allSectors'].length;x++){
                if(i['allSectors'][x]==d.data.sector){
                  return getArcColor(d.data.sector);
                }
              }
            })
            .style("stroke-width",function(i){
              for(var x=0;x<i['allSectors'].length;x++){
                if(i['allSectors'][x]==d.data.sector){
                  return "3";
                }
              }
            })
            .style("fill",function(i){
              var notInSector = 1;
              for(var x=0;x<i['allSectors'].length;x++){
                if(i['allSectors'][x]==d.data.sector){
                    notInSector=0;
                    break;
                }
              }
              if(notInSector==1){
                return "#ccc";
              }
            })
            .style("opacity",function(i){
              var notInSector = 1;
              for(var x=0;x<i['allSectors'].length;x++){
                if(i['allSectors'][x]==d.data.sector){
                    notInSector=0;
                    break;
                }
              }
              if(notInSector==1){
                return "0.2";
              }else{
                return "0.7";
              }
            });
    
          

          d3.selectAll(".arc")
            .style("opacity",function(i){
              if(i.data.sector==d.data.sector){
                return 0.8;
              }else{
                return 0.2;
              }
            })
            .each(function(i){
              if(i.data.sector==d.data.sector){
                d3.select(this).select("path").style("fill",getArcColor(i.data.sector));
              }else{
                d3.select(this).select("path").style("fill","#ccc");
              }
            });
        })
        .on("mouseout",function(){
          d3.selectAll(".segmentViewNode")
            .style("stroke","")
            .style("stroke-width","")
            .style("fill",function(i){
                if($('#coloring').val()=="bytype"){
                  d3.select(this).attr("fill",function(d){
                    return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
                  });
                }else if($('#coloring').val()=="bysector"){
                  d3.select(this).attr("fill",function(d){
                    return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
                  });
                }
                else{
                  d3.select(this).attr("fill",function(d){
                    return isExpanded(d.name)==1? "#000000" : "#77777E";
                  });
                }
            })
            .style("opacity",0.7);
          d3.selectAll(".arc")
            .style("stroke","")
            .style("stroke-width","")
            .style("opacity",0.8);
          d3.selectAll(".arc").each(function(d){
            d3.select(this).select("path").style("fill",getArcColor(d.data.sector));
          });
        });

/*    g.append("title")
      .text(function(d){
        return d.data.sector;
      });
*/
  g.append("text")
    .attr("transform", function(d) {
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
        return "translate(" + (x/h * labelr) +  ',' +
           (y/h * labelr) +  ")"; 
    })
    .attr("dy", ".35em")
    .attr("style","font-size:15px;")
    .attr("text-anchor", function(d) {
        return (d.endAngle + d.startAngle)/2 > Math.PI ?
            "end" : "start";
    })
    .text(function(d,i) { return segmentsToInclude[i].sector; });


var segmentViewLinks=[];
if(globalNodes.length>1){
  segmentViewLinks = filteredSegmentViewLinks;
}
//console.log(segmentViewLinks);

var links = segmentViewContainer.selectAll(".segmentviewlink")
                            .data(segmentViewLinks)
                            .enter()
                            .append("g")
                            .attr("class","segmentviewlinksgroup")
                            .append("path")
                            .attr("d", "M0,-5L10,0L0,5")
                            .attr("class", "segmentviewlink");

var nodes = segmentViewContainer.selectAll(".segmentViewCompleteNode")
                            .data(filteredSegmentViewNodes)
                            .enter()
                            .append("g")
                            .attr("class","segmentViewCompleteNode");

var centerX = getCenterX(sectorCentroids);
var centerY = getCenterY(sectorCentroids);
console.log("centerX,centerY");
console.log(centerX,centerY);
nodes.each(function(d){
  currentX=getXForNode(d.allSectors,sectorCentroids);
  currentY=getYForNode(d.allSectors,sectorCentroids);
  while(isPresentInExistingLocations(currentX,currentY)==1){
    currentX=getXForNode(d.allSectors,sectorCentroids);
    currentY=getYForNode(d.allSectors,sectorCentroids);
  }
  //console.log(d.name," ",currentX,currentY);
  var isAroundCentroidVal=isAroundCentroid(currentX,currentY,sectorCentroids);
  if(isAroundCentroidVal!=0){
    if(currentX<centerX){
      if(currentY<centerY){//q2
        //console.log(d.name,"-","q2");
        if(isAroundCentroidVal==2 || isAroundCentroidVal==3){
          currentX+=20;
          currentY+=25;
        }else if(isAroundCentroidVal==1 || isAroundCentroidVal==4){
          currentX+=10;
          currentY+=25;
        }
      }else{//q3
        //console.log(d.name,"-","q3");
        if(isAroundCentroidVal==2 || isAroundCentroidVal==3){
          currentX+=20;
          currentY-=25;
        }else if(isAroundCentroidVal==1 || isAroundCentroidVal==4){
          currentX+=10;
          currentY-=25;
        }
      }
    }else if(currentX>=centerX)
      if(currentY<centerY){//q1
        //console.log(d.name,"-","q1");
        if(isAroundCentroidVal==2 || isAroundCentroidVal==3){
          currentX-=10;
          currentY+=25;
        }else if(isAroundCentroidVal==1 || isAroundCentroidVal==4){
          currentX-=30;
          currentY+=25;
        }
      }else{//q4
        //console.log(d.name,"-","q4");
        if(isAroundCentroidVal==2 || isAroundCentroidVal==3){
          currentX-=10;
          currentY-=25;
        }else if(isAroundCentroidVal==1 || isAroundCentroidVal==4){
          currentX-=30;
          currentY-=25;
        }
      }
  }
    //console.log("near centroid");
  if(companyExistsInXYPairs(d.name)!=1){
    existingXYPairs.push({"company":d.name,"x":currentX,"y":currentY});
  }
});
if($('#shaping').val()=="bytype"){
    nodes.each(function(d){
      if(d.type=="private"){
        d3.select(this).append("circle")
     .attr("class","segmentViewNode")
     .attr("cx",function(d){
        return getXForExistingCompany(d.name);
      })
     .attr("cy",function(d){
        return getYForExistingCompany(d.name);
      })
     .attr("r", function(d){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(d.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
      })
     .style("fill",function(i){
      if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }
          else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
    })
     .style("opacity",0.5);
      }else{
        d3.select(this).append("rect")
        .attr("x",function(d){
          return getXForExistingCompany(d.name);
        })
       .attr("y",function(d){
          return getYForExistingCompany(d.name);
        })
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
        }).style("fill",function(i){
      if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }
          else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
        })
        .style("opacity",0.5);
      }
    });  
  }
else{
  nodes.append("circle")
     .attr("class","segmentViewNode")
     .attr("cx",function(d){
        return getXForExistingCompany(d.name);
      })
     .attr("cy",function(d){
        return getYForExistingCompany(d.name);
      })
     .attr("r", function(d){
          if($('#sizing').val()=="alliancecount"){
            var nodeRadius = (((10-4)*(getNumberOfAlliances(d.name))))/(767)+4;  //maxCount = 767, minCount=0, f(x) = (((b-a)*(x-min))/(max-min))+a , a=4,b=10
            return nodeRadius;
          }else{
            return "4";
          }
      })
     .style("fill",function(i){
      if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }
          else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
    })
     .style("opacity",0.5);/*
     .on("mouseover",function(d){
        
        
      })
      .on("mouseout",function(){
            d3.selectAll(".arc")
            .style("stroke","")
            .style("stroke-width","");
            d3.selectAll(".segmentViewNode")
            .style("stroke","")
            .style("stroke-width","");
            d3.selectAll(".tempLabel").remove();
          });*/
}
links.attr("d", function(i){
            var dx = getXForExistingCompany(globalNodes[i.target]['name']) - getXForExistingCompany(globalNodes[i.source]['name']),
                dy = getYForExistingCompany(globalNodes[i.target]['name']) - getYForExistingCompany(globalNodes[i.source]['name']),
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + 
                getXForExistingCompany(globalNodes[i.source]['name']) + "," + 
                getYForExistingCompany(globalNodes[i.source]['name']) + "A" + 
                dr + "," + dr + " 0 0,1 " + 
                getXForExistingCompany(globalNodes[i.target]['name']) + "," + 
                getYForExistingCompany(globalNodes[i.target]['name']);
    }).style("stroke-width",function(i){
        var width = getAllianceCountBetweenCompanies(globalNodes[i.source]['name'],globalNodes[i.target]['name']);
        return (((8-1)*(width)))/(23)+1;
    }).style("opacity",0);

nodes.on("mouseover",function(d){
       var currNodeSectorSet=unique(d.allSectors);
       d3.selectAll(".arc")
          .style("opacity",function(i){
            if(objectIsInList(i.data.sector,currNodeSectorSet)==1){
              return 0.8;
            }else{
              return 0.2;
            }
          })
          .style("fill",function(i){
            if(objectIsInList(i.data.sector,currNodeSectorSet)==1){
              d3.select(this).select("path").style("fill",getArcColor(i.data.sector));
            }else{
              d3.select(this).select("path").style("fill","#ccc");
            }
          });


        d3.select(this).select("circle")
          .style("stroke","yellow")
          .style("stroke-width","2");
        d3.select(this).select("rect")
          .style("stroke","yellow")
          .style("stroke-width","2");


    var selectedCompanyIndex = companyExistsInNodes(d.name);
    
    d3.selectAll(".segmentviewlink").transition().duration(200).style("opacity",function(i){
      if(i.source==selectedCompanyIndex || i.target==selectedCompanyIndex){
        return 1;
      }else{
        return 0;
      }
    })
    .style("stroke",function(i){
        if(i.source==selectedCompanyIndex || i.target==selectedCompanyIndex){
          return colorLinkBasedOnNodes(getSectorColor(globalNodes[i.source]['name']),getSectorColor(globalNodes[i.target]['name']));
        }else{
          return "#ccc";
        }
    });
        
    d3.selectAll(".segmentViewNode")
    .style("opacity", function(i) {
               if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1){
                 return 0.8;
               }else{
                    return 0.05;
               }
    })
    .style("fill",function(i){
      if($('#coloring').val()=="bytype"){
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }else if($('#coloring').val()=="bysector"){
            d3.select(this).attr("fill",function(d){
              return colorBasedOnSector(d.sectorColor);//isExpanded(d.name)==1? "#000000" : (d.type=="public"?"#088A08":"#FF8000");
            });
          }
          else{
            d3.select(this).attr("fill",function(d){
              return isExpanded(d.name)==1? "#000000" : "#77777E";
            });
          }
    });

    d3.selectAll(".segmentViewCompleteNode")
      .append("text")
      .attr("class","tempLabel")
      .attr("fill","black")
      .attr("x",function(i){
        if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1)
            return getXForExistingCompany(i.name)+5;
        })
      .attr("y",function(i){
        if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1)
            return getYForExistingCompany(i.name)+5;
        })
      .attr("style", "font-family:sans-serif;")
      .attr("style", function(d){
            var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
            return "font-size:"+size; 
      })
      .text(function(i){
        if(i.name==d.name || getPartners(d.name).indexOf(i.name) > -1)
            return i.name;
        });

})
.append("text")
  .attr("class",function(d){
          if(isExpanded(d.name)==1){
            return "fixedLabel";
          }})
  .attr("fill","black")
  .attr("x",function(d){
    return getXForExistingCompany(d.name)+5;
  })
  .attr("y",function(d){
    return getYForExistingCompany(d.name)+5;
  })
  .attr("style", "font-family:sans-serif;")
  .attr("style", function(d){
    var size = (((20-8)*(getNumberOfAlliances(d.name))))/(767)+8;
    return "font-size:"+size; 
  })
  .text(function(d){if(isExpanded(d.name)){return d.name;}});;

nodes.on("mouseout",function(){
   d3.selectAll(".arc")
            .style("stroke","")
            .style("stroke-width","")
            .style("opacity",0.8);
            d3.selectAll(".segmentViewNode")
            .style("stroke","")
            .style("stroke-width","");
            d3.selectAll("rect")
            .style("stroke","")
            .style("stroke-width","");

    d3.selectAll(".arc").each(function(d){
      d3.select(this).select("path").style("fill",getArcColor(d.data.sector));
    });

            d3.selectAll(".tempLabel").remove();
  links.style("opacity",0);
  d3.selectAll(".segmentViewNode")
    .style("opacity",0.7);
}); 

nodes.on("dblclick",function(d){
        //isExpanded(d.name)==1?removePartners(d.name):addPartners(d.name);
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