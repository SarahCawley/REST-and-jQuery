$(document).ready(function(){

	var url = 'https://50iyt60g2b.execute-api.us-west-2.amazonaws.com/prod/load/'
	var allRecords = [];
	var addedNumbers = [];
	

	//reset the page: hides forms, removed row data from previous run
	var resetForms = function(){
		$(".dataRow").remove();
		allRecords.splice(0,allRecords.length)
	    addedNumbers.splice(0,addedNumbers.length)
	};

	//Hides all warnings
	var resetWarnings = function(){
		$("#invalidPageNumSize").addClass("isHidden");
		$("#invalidNum").addClass("isHidden");
		$("#invalidPageNumber").addClass("isHidden");
		$("#emptyString").addClass("isHidden");
	}

	//validates page and number per page numbers. Displays warnings
	var validateNum = function(pageNum, perPage){
	    //no amount per page selected, set to 10
	    if(!perPage){
			perPage = 10;
        }
        // if page number is negative
        if(pageNum < 1 ){
        	$("#invalidPageNumSize").removeClass("isHidden");
        	return false;
        }
        // if amount per page is negative or less than 10
        if(perPage < 1 || perPage > 10){
        	$("#invalidNum").removeClass("isHidden");
        	return false;
        }
        return perPage;
	};

	//builds an array of person objects  (allRecords), keeps them in order using splice
	var buildPersonArray = function(num, record){
		//see if record is already in array
    	var found = $.inArray(num, addedNumbers);
		//if not in array push it onto the array
		if (found == -1){
			allRecords.splice((num -1), 0, record);
			addedNumbers.push(num);
			//if I have now added all 100
			if (addedNumbers.length === 100){
				buildTable();
				return false;
			}			
		}		
	}

	//adds the HTML to build the table using data from the person array (allRecords)
	var buildTable = function(){
		$("#informationTable").removeClass("isHidden");
		$("body").removeClass("working");
		$("#searching").addClass("isHidden");
		$.each(allRecords, function(i, item){
			var num = allRecords[i].Number
			var name = allRecords[i].Name
			var location = allRecords[i].Location;
			var pageNum = allRecords[i].pageNum;
			var perPage = allRecords[i].perPage;
			var markup = "<tr class='dataRow'><td>" + num + "</td><td>" + name + "</td><td>" + location + "</td><td>" + pageNum + "</td><td>" + perPage +"</tr>";
		    $("table tbody").append(markup);
		});
	}

	//Grabs JSON data creates array of people
    $("#pageNumbers").on("submit", function(e){
    	e.preventDefault();
    	resetWarnings();
		allRecords.splice(0,allRecords.length)
	    addedNumbers.splice(0,addedNumbers.length)
    	$(".dataRow").remove();
        
        //get data from form
        var pageNum = $("#pageNum").val();
        var perPage = $("#perPage").val();
        

        //validate numbers
   		perPage = validateNum(pageNum, perPage);

        //get data
       	var jqxhr = $.getJSON(url + pageNum + '/'+ perPage,  function(data, status, xhr) {
			
			if (status == "success"){
				if(data.length == 0){					
					$("#emptyString").removeClass("isHidden");
					return false;
				}
				$("#informationTable").removeClass("isHidden");

				$.each(data, function(i, item) {
					var num = data[i].Number
	    			var name = data[i].Name
	    			var location = data[i].Location;
	        		var record = {Number: num, Name: name, Location: location, pageNum: pageNum, perPage: perPage}
	        		//see if record exists in the array
	        		buildPersonArray(num, record);

				});
				buildTable();
				
				$("#invalidPageNumSize").addClass("isHidden"); 
				$("#invalidNum").addClass("isHidden"); 
				$("#invalidPageNumber").addClass("isHidden");  
		    }
		})
		.fail(function() {
	    	$("#invalidPageNumber").removeClass("isHidden");
	    	$("#informationTable").addClass("isHidden");
		});       
    });
});