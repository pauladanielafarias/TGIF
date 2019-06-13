//bringing the members list from the proPublica website
 var url="";
 if (document.getElementById("senate")){
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
 }

 if(document.getElementById("house")){
    url = "https://api.propublica.org/congress/v1/113/house/members.json";
 }

 //fetch
$(function(){
    fetch(url,{
    headers: new Headers({
        "X-API-key": "HQLbOTWYVMYoPGHm5GhPxibujrpTyBSK9eDPdGCw"
        })
    }
).then(function(response) {
    if(response.ok){
       return response.json();
     };
     throw new Error(response.statusText)

}).then(function(json){
    app.membersData = json.results[0].members //stores the json members from proPublica in the data membersData from #app from Vue.js

}).catch(function(error) {
    console.log( "Request failed: " + error.message );
})
});
  

//Vue.js - app

var app = new Vue({
    el: '#app',
//data in Vue.js
    data: {
        
        membersData:[], //has stored all the members(with all their properties) from the json in proPublica in an Array,
        checkedStates: "All",
        checkedParty:["R","D","I"]
    },

//methods in Vue.js
    methods: {
        //1)sorts the states alphabetically
        //used in senate-data.html and house-data.html --> senators/house table
        stateSort: function(){
            let statesArray=[];
            this.membersData.map(function(i){
                if(statesArray.indexOf(i.state)==-1){
                    statesArray.push(i.state);
                }
            })
            statesArray.sort();
            return statesArray;
        },

        //2)filters the members so that they can be displayed when the user changes the party or state filters
        //used in senate-data.html and house-data.html --> senators/house table
        filterMembers: function(){
            let activeFilters=[];
            activeFilters=this.membersData.filter(function(i){
                return (app.checkedStates== i.state || app.checkedStates=="All") && app.checkedParty.indexOf(i.party) !==-1;
            }) 
            return activeFilters;
        },

        //3) used in senate-attendance.html, senate-loyalty.html, house-attendance.html and house-loyalty.html --> at a glance table
        //3a) total of democrats
        numDem: function(){
            let numDem=0;
            this.membersData.forEach(function(i){
                if(i.party=="D"){
                    numDem++;
                }
            })
            return numDem;
        },
        //3b) total of republicans        
        numRep: function(){
            let numRep=0;
            this.membersData.forEach(function(i){
                if(i.party=="R"){
                    numRep++;
                }
            })
            return numRep;
        },
        //3c) total of independents        
        numIndep: function(){
            let numIndep=0;
            this.membersData.forEach(function(i){
                if(i.party=="I"){
                    numIndep++;
                }
            })
            return numIndep;
        },
        //3d) total of representatives        
        totalReps: function(){
            let totalReps=0;
            this.membersData.forEach(function(i){
                if(i.party=="D" || i.party=="R" || i.party=="I"){
                    totalReps++;
                }
            })
            return totalReps;
        },
        //3e) %voted with party - democrats
        percDem: function(){
            let percDem=0;
            this.membersData.forEach(function(i){
                if(i.party=="D"){
                    percDem+=i.votes_with_party_pct
                }
            })
            return +(percDem/this.numDem()).toFixed(2);
        },
          //3f) %voted with party - republicans
          percRep: function(){
            let percRep=0;
            this.membersData.forEach(function(i){
                if(i.party=="R"){
                    percRep+=i.votes_with_party_pct
                }
            })
            return +(percRep/this.numRep()).toFixed(2); //se le pone el + adelante para convertirlo en string y que ande el tofixed(), aunque anda igual sin el más
        },
        //3g) %voted with party - independents
        percIndep: function(){
            let percIndep=0;
            this.membersData.forEach(function(i){
                if(i.party=="I"){
                    percIndep+=i.votes_with_party_pct
                }
            })
            if(isNaN(percIndep/this.numIndep())){
                return 0;
            }else{
                return +(percIndep/this.numIndep()).toFixed(2); //se le pone el + adelante para convertirlo en string y que ande el tofixed(), aunque anda igual sin el más
            }
        },
        //3f) %voted with party - total
        totalPerc: function(){
            let totalPerc=0;
            this.membersData.forEach(function(i){
                totalPerc+=i.votes_with_party_pct;
            })
            return +(totalPerc/this.membersData.length).toFixed(2); //se le pone el + adelante para convertirlo en string y que ande el tofixed(), aunque anda igual sin el más
        },

        //4) used in senate-attendance.html and house-attendance.html --> table least engaged
        //4a) sort members up(asc) or down(desc) so that the firsts have more missed votes
        sortMembers: function(order,key){
            if(order == "up"){
               return this.membersData.sort(function(a,b){
                    return (a[key] - b[key]);
                    })
            }else{
               return this.membersData.sort(function(a,b){
                    return (b[key] - a[key]);
                    })
            }
           
        },
        //4b) gets the 10% of the members
        tenPerc: function (){
            return this.membersData.length*0.1;
        },
        //4c) adds one more to the tenPerc() if the next member has the same missed_votes_pct
        getTenPct: function (order,key){

            let pct = this.tenPerc()
            let totalTenPerc= this.sortMembers(order,key);
            for(i=0; i< this.tenPerc(); i++){
                if(totalTenPerc[i][key] == totalTenPerc[i+1][key] && pct < totalTenPerc.length*0.22){
                    pct+=1;
                }
            }
            return totalTenPerc.slice(0,pct)
        }        
    }
});
  