// Load initial page

function main(){
    
    // Load json from external file
    $.getJSON("assets/itemlist.json", function(jsonData){
        // console.log(jsonData); 

        // Create variable to store table in
        var mainTable = "";
        // For each group found create a table

        for(group in jsonData){
            // Start table
            mainTable += "<table  class='itemlist'>";
            
            // Add header
            mainTable += "<tr><th colspan='3'>" + group + "</th></tr>";
            
            // Add each item in group
            for(item in jsonData[group]){
                // console.log(jsonData[group][item]);
                if(item !== "type"){
                    // Add table row
                    mainTable += "<tr>";
                    // Add image cell
                    mainTable += "<td class='item_image'><img src='products/"+ jsonData[group][item].image +"' alt='Burger'></td>";
                    // Add text cell
                        mainTable += "<td class='item_body'><div class='item_title'>"+ item +"<br/>$"+ jsonData[group][item].price +"</div>";
                        mainTable += "<div class='item_description'>"+ jsonData[group][item].description +"</div></td>";
                    // Add buttons cell
                        mainTable += "<td class='item_add'><div class='item_buttons'>";
                        mainTable += "<img src='assets/green_small.png' alt='Add' onclick='posOrder(\""+ item +"\", \""+ jsonData[group][item].price +"\",\"add\")'>";
                        mainTable += "<img src='assets/red_small.png' alt='Subtract' onclick='posOrder(\""+ item +"\", \""+ jsonData[group][item].price +"\",\"subtract\")'>";
                        mainTable += "</div></td>";
                    // End table row
                    mainTable += "</tr>";
                }
            }
            // Close table
            mainTable += "</table>";
        }
        
        // Replace left column with table
        document.getElementById("left_block").innerHTML = mainTable;
    });

};

// Create an object to store orders in
const orderObject = {};

function posOrder(name, price, modifier){
    console.log(name,price,modifier);

    // Check if item in orderObject
    if(orderObject.hasOwnProperty(name)){
        // console.log("It exists");

        // If modifier is add
        if(modifier == "add"){
            orderObject[name]["amount"] += 1;
        }
        // If modifier is subtract
        else if(modifier == "subtract"){
            // If theres more than 0 subtract
            if(orderObject[name]["amount"] > 1){
                // Subtract 1
                orderObject[name]["amount"] -= 1;
            }
            // If its already 0 remove from object
            else{
                delete orderObject[name];
            }
        }
    }
    else{
        // If modifier is add
        if(modifier == "add"){
            // Add item to object
            orderObject[name] = {};
            orderObject[name]["price"] = price;
            orderObject[name]["amount"] = 1;
        }
    }
    
        //orderObject[name]["price"] = price;
    // If modifier is add
    if(modifier == "add"){
    }
    




    console.log(orderObject);
};

