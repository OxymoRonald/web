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
                    mainTable += "<td class='item_image'><img src='products/"+ jsonData[group][item].image +"' alt='" + item + "'></td>";
                    // Add text cell
                        mainTable += "<td class='item_body'><div class='item_title'>"+ item +"<br/>$"+ jsonData[group][item].price +"</div>";
                        mainTable += "<div class='item_description'>"+ jsonData[group][item].description +"</div></td>";
                    // Add buttons cell
                        mainTable += "<td class='item_add'><div class='item_buttons'>";
                        mainTable += "<img src='assets/green_small.png' alt='Add' onclick='posOrder(\""+ item +"\", \"add\")'>";
                        mainTable += "<img src='assets/red_small.png' alt='Subtract' onclick='posOrder(\""+ item +"\", \"subtract\")'>";
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

// Update orders
// Create an object to store orders in
const orderObject = {};

function posOrder(name, modifier){
    // console.log(name, modifier);

    // Check if item in orderObject
    if(orderObject.hasOwnProperty(name)){
        // console.log("It exists");

        // If modifier is add
        if(modifier == "add"){
            orderObject[name] += 1;
        }
        // If modifier is subtract
        else if(modifier == "subtract"){
            // If theres more than 0 subtract
            if(orderObject[name] > 1){
                // Subtract 1
                orderObject[name] -= 1;
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
            orderObject[name] = 1;
            // orderObject[name] = {};
            // orderObject[name]["amount"] = 1;
        }
    }
    

    //console.log(orderObject);

    // Load JSON file again
    $.getJSON("assets/itemlist.json", function(jsonData){

        // Variable to store order total in
        var orderTotal = 0;

        // Create order table
        var orderTable = "<table class='orderlist'>";
        // Add header
        orderTable += "<tr><th colspan='4'>Order</th></tr>";

        // For each item in orderobject
        for(item in orderObject){
            // console.log(item, orderObject[item]);
            // Iterate through members to find item
            for(group in jsonData){
                // console.log(group)
                // If item is in group
                if(jsonData[group].hasOwnProperty(item)){
                    // console.log("Item: " + item + " found in: " + group);
                    // Add price to total
                    orderTotal += (orderObject[item] * jsonData[group][item].price);

                    // Add row to table
                    orderTable += "<tr>";
                    orderTable += "<td class='ordercounter'>" + orderObject[item] + "</td>";
                    orderTable += "<td class='orderimage'><img src='products/"+ jsonData[group][item].image +"'/></td>";
                    orderTable += "<td class='ordertitle'>" + item + "</td>";
                    orderTable += "<td class='orderprice'>$ " + (orderObject[item] * jsonData[group][item].price) + "</td>";
                    orderTable += "</tr>";
                }
            }
        }

        // Display order total
        orderTable += "<tr><th colspan='3' class='ordertotal'>Total</th><th class='ordertotalprice'>$ " + orderTotal + "</th></tr>";
        // Create a total count of items to get
        // Add header for total items
        orderTable += "<tr><th colspan='4'>Itemlist</th></tr>";

        // Copy orderObject to add items from menus to
        const itemTotals = Object.assign({}, orderObject);
        // console.log(itemTotals);
        // For each item in itemTotals
        for(tItem in itemTotals){
            //console.log(tItem); // Itemname
            // For each group in the json array
            for(tGroup in jsonData){
                //console.log(tGroup)
                // Check if item is part of current group.
                if(jsonData[tGroup].hasOwnProperty(tItem)){
                    //console.log(jsonData[tGroup]);
                    //console.log("Item: " + tItem + " found in: " + tGroup);
                    // Check if the current group is a combos group
                    if(jsonData[tGroup].type == "combos"){
                        //console.log(tItem + " is a combo");
                        // For each item that is part of the combo
                        for(menuItem in jsonData[tGroup][tItem].items){
                            //console.log(menuItem);
                            // If item is already in object
                            if(itemTotals.hasOwnProperty(menuItem)){
                                // console.log("Menu item: " + menuItem + " found");
                                // console.log("Menu count: " + itemTotals[tItem]);
                                // console.log("Item per menu count: " + jsonData[tGroup][tItem].items[menuItem]);
                                // Add count to object
                                itemTotals[menuItem] += (itemTotals[tItem] * jsonData[tGroup][tItem].items[menuItem]);
                                //itemTotals[menuItem] += jsonData[tGroup][tItem].items[menuItem];
                            }
                            else{
                                // console.log("Menu item: " + menuItem + " not found");
                                // console.log("else: " + jsonData[tGroup][tItem].items[menuItem]);
                                itemTotals[menuItem] = (itemTotals[tItem] * jsonData[tGroup][tItem].items[menuItem]);
                            };
                        };
                        // console.log("Item name: " + tItem)
                        // Remove menu from list
                        delete itemTotals[tItem];
                    };
                };
            };
        };
        //console.log(itemTotals);
        //console.log(itemTotals);

        // // For each item in itemTotals create a row
        for(item in itemTotals){
            // console.log(item);
            // console.log(itemTotals)
            // console.log(jsonData);
            for(group in jsonData){
                if(jsonData[group].hasOwnProperty(item)){
                    console.log("Menu item: " + item + " found in " + group);
                    orderTable += "<tr>";
                    orderTable += "<td class='ordercounter'>" + itemTotals[item] + "</td>";
                    orderTable += "<td class='orderimage'><img src='products/"+ jsonData[group][item].image +"'/></td>";
                    orderTable += "<td colspan='2'>" + item + "</td>";
                    // orderTable += "<td>$ " + (orderObject[item] * jsonData[group][item].price) + "</td>";
                    orderTable += "</tr>";
                }
            }
        }

        // Add reset button
        orderTable += "<tr><td colspan='4' id='reload'><button onClick='window.location.reload();'>Reset</button></td></tr>"
        // Close table
        orderTable += "</table>";

        // Replace rigth column with table
        document.getElementById("right_block").innerHTML = orderTable;

    });
};
