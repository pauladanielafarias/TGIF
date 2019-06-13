
const proPublicaUrl = "https://api.propublica.org/congress/v1/113/senate/members.json";
var data;
fetch(proPublicaUrl,{
    headers: new Headers({
        apiKey: "HQLbOTWYVMYoPGHm5GhPxibujrpTyBSK9eDPdGCw"
        })
    }
).then(function(response) {
    if(response.ok){
       return response.json();
     };
     throw new Error(response.statusText)

}).then(function(json){
    data=json;

}).catch(function(error) {
    console.log( "Request failed: " + error.message );
});
  










/*

var statistics = {
    //table at a glance
    "numDem":0, 
    "numRep":0,
    "numIndep":0,
    "votDem":0,
    "votRep":0,
    "votIndep":0,
    "totalReps": 0,
    "totalVoted":0,

    //table least and most engaged (attendance)
    "leastEngaged":[],
    "mostEngaged":[],
    //table least and most loyal (party loyalty)
    "leastLoyal":[],
    "mostLoyal":[]
}

const members = data.results[0].members;
const party = data.results[0].members[0].party;

// table at a glance
    // No. of reps
        // 1) counting all the democrats in members
members.forEach(function(demMemb){
    if(demMemb.party == "D"){
        statistics.numDem++;
    }
})
        //printing the number of democrats in the html table
document.getElementById("numDem").innerHTML=statistics.numDem;

        // 2) counting all the republicans in members
members.forEach(function(repMemb){
    if(repMemb.party == "R"){
        statistics.numRep++;
    }
})
        //printing the number of republicans in the html table
document.getElementById("numRep").innerHTML=statistics.numRep;

        // 3) counting all the independents in members
members.forEach(function(indepMemb){
    if(indepMemb.party == "I"){
        statistics.numIndep++;
    }
})
        //printing the number of independents in the html table
document.getElementById("numIndep").innerHTML=statistics.numIndep;

        // 4) total of representants and printing the total in the html table
var totalReps = statistics.numDem + statistics.numRep + statistics.numIndep;
document.getElementById("totalReps").innerHTML= totalReps;


    // percentage voted with party
const percVotWParty = data.results[0].members[0].votes_with_party_pct;

        // 1) percentage voted democrats, republicans and independents
members.forEach(function(memb){
    if(memb.party == "D"){
        statistics.votDem=(statistics.votDem + memb.votes_with_party_pct);
    }else if(memb.party=="R"){
        statistics.votRep=(statistics.votRep+ memb.votes_with_party_pct);
    }else{
        statistics.votIndep=(statistics.votIndep+ memb.votes_with_party_pct);
    }
})
    // 2) divided the percentage per the number of members
statistics.votDem = +(statistics.votDem /statistics.numDem).toFixed(2); //se le pone el + adelante para convertirlo en string y que ande el tofixed(), aunque anda igual sin el más
statistics.votRep = +(statistics.votRep /statistics.numRep).toFixed(2); //se le pone el + adelante para convertirlo en string y que ande el tofixed(), aunque anda igual sin el más
statistics.votIndep = +(statistics.votIndep/statistics.numIndep).toFixed(2); //se le pone el + adelante para convertirlo en string y que ande el tofixed(), aunque anda igual sin el más
    //3) if the result is NaN put a 0
for(i in statistics){
    if(isNaN(statistics[i])){
        statistics[i]=0;
    }
}
    //printing the % voted with party in the html table
document.getElementById("votDem").innerHTML=statistics.votDem+"%";
document.getElementById("votRep").innerHTML=statistics.votRep+"%";
document.getElementById("votIndep").innerHTML=statistics.votIndep+"%";

    //4) total voted with party
statistics.totalVoted = +((statistics.votDem+ statistics.votRep +statistics.votIndep)/3).toFixed(2);//se le pone el + adelante para convertirlo en string y que ande el tofixed(), aunque anda igual sin el más
document.getElementById("totalVoted").innerHTML=statistics.totalVoted+"%";


/////////

//least engaged table
    //1) sort members by missed_votes_pct so that the firsts have more missed votes
members.sort(function(a,b){
    return (b.missed_votes_pct - a.missed_votes_pct);
})
    //10% of the members
var tenPerc=members.length*0.1; 

    //
for(i=0; i<tenPerc; i++){
    if(members[i].missed_votes_pct == members[i+1].missed_votes_pct && tenPerc < members.length*0.22){
       tenPerc+=1;
    }
}
    //puts the 10% inside the statistics.leastEngaged object
statistics.leastEngaged = members.slice(0,tenPerc);

    // 3) doing the enaged table
var tableLeastEngaged ="";
for(i=0;i<tenPerc;i++){
    let fullName =  members[i].first_name + " "+ (members[i].middle_name || "")+" " + members[i].last_name;
    let url = members[i].url;
    let missedVotes = members[i].missed_votes;
    let percMissed = members[i].missed_votes_pct;
    tableLeastEngaged += "<tr>"+
    "<td>"+ "<a href='"+url+"' target='_blank'>"+fullName+"</a>" + "</td>"+ //url for each member
    "<td>" + missedVotes + "</td>" +
    "<td>" + percMissed + "%"+ "</td>"+"</tr>";
}

 
//most engaged table
    //1) sort members by missed_votes_pct so that the firsts have less missed votes
    members.sort(function(a,b){
        return (a.missed_votes_pct - b.missed_votes_pct);
    })
        //10% of the members
    var tenPerc=members.length*0.1; 
    
        //
    for(i=0; i<tenPerc; i++){
        if(members[i].missed_votes_pct == members[i+1].missed_votes_pct && tenPerc < members.length*0.22){
            tenPerc+=1;
        }
    }

    //puts the 10% inside the statistics.leastEngaged object
statistics.leastEngaged = members.slice(0,tenPerc);

        // 3) doing the most enaged table
    var tableMostEngaged ="";
    for(i=0;i<tenPerc;i++){
        let fullName =  members[i].first_name + " "+ (members[i].middle_name || "")+" " + members[i].last_name;
        let url = members[i].url;
        let missedVotes = members[i].missed_votes;
        let percMissed = members[i].missed_votes_pct;
        tableMostEngaged += "<tr>"+
        "<td>"+ "<a href='"+url+"' target='_blank'>"+fullName+"</a>" + "</td>"+ //url for each member
        "<td>" + missedVotes + "</td>" +
        "<td>" + percMissed + "%"+ "</td>"+"</tr>"
    }
      

//least loyal table
    //1) sort members by votes_with_party_pct so that the firsts have more missed votes with party
    members.sort(function(a,b){
        return (a.votes_with_party_pct - b.votes_with_party_pct);
    })
        //10% of the members
    var tenPerc=members.length*0.1; 
    
        //
    for(i=0; i<tenPerc; i++){
        if(members[i].missed_votes_pct == members[i+1].missed_votes_pct && tenPerc < members.length*0.22){
            tenPerc+=1;
        }
    }

    //puts the 10% inside the statistics.leastEngaged object
statistics.leastEngaged = members.slice(0,tenPerc);

        // 3) doing the least loyal table
    var tableLeastLoyal ="";
    for(i=0;i<tenPerc;i++){
        let fullName =  members[i].first_name + " "+ (members[i].middle_name || "")+" " + members[i].last_name;
        let url = members[i].url;
        let partyVotes = +((members[i].total_votes*members[i].votes_with_party_pct)/100).toFixed(0);
        let percVotWParty = members[i].votes_with_party_pct;
        tableLeastLoyal += "<tr>"+
        "<td>"+ "<a href='"+url+"' target='_blank'>"+fullName+"</a>" + "</td>"+ //url for each member
        "<td>" + partyVotes + "</td>" +
        "<td>" + percVotWParty + "%"+ "</td>"+"</tr>";
    }

//most loyal table
    //1) sort members by votes_with_party_pct so that the firsts have more missed votes with party
    members.sort(function(a,b){
        return (b.votes_with_party_pct - a.votes_with_party_pct);
    })
        //10% of the members
    var tenPerc=members.length*0.1; 
    
        //
    for(i=0; i<tenPerc; i++){
        if(members[i].missed_votes_pct == members[i+1].missed_votes_pct && tenPerc < members.length*0.22){
            tenPerc+=1;
        }
    }

    //puts the 10% inside the statistics.leastEngaged object
statistics.leastEngaged = members.slice(0,tenPerc);

        // 3) doing the enaged table
    var tableMostLoyal ="";
    for(i=0;i<tenPerc;i++){
        let fullName =  members[i].first_name + " "+ (members[i].middle_name || "")+" " + members[i].last_name;
        let url = members[i].url;
        let partyVotes = +((members[i].total_votes*members[i].votes_with_party_pct)/100).toFixed(0);
        let percVotWParty = members[i].votes_with_party_pct;
        tableMostLoyal += "<tr>"+
        "<td>"+ "<a href='"+url+"' target='_blank'>"+fullName+"</a>" + "</td>"+ //url for each member
        "<td>" + partyVotes + "</td>" +
        "<td>" + percVotWParty + "%"+ "</td>"+"</tr>";
    }

//  printing in the html all the tables

     if(document.getElementById("attendance")){
        document.getElementById("leastEngaged").innerHTML=tableLeastEngaged;
        document.getElementById("mostEngaged").innerHTML= tableMostEngaged;
    }

    if(document.getElementById("loyalty")){
        document.getElementById("leastLoyal").innerHTML=tableLeastLoyal;
        document.getElementById("mostLoyal").innerHTML=tableMostLoyal;

    }



*/




/* 1* another way to count all the democrats in members
function totalDem(){
    for(var i=0; i<members.length;i++)
        if(members[i].party == "D"){
            statistics.numDem ++;
    }  
}
*/ 




