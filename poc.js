var token = 'eyJraWQiOiJoczI1Ni1rZXkiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lkcC5hcGljb25uZWN0LmNvbSIsImF1ZCI6ImdldC1wcmFjdGl0aW9uZXItYXBpIiwiZXhwIjoxNjEwMDc4MjcyLCJpYXQiOjE2MDc0ODYyNzIsInNjcCI6InByYWN0aXRpb25lci5yZWFkIn0.5W5rj-fkMElr-VUvHGvWezU1W-GEFbr5ERVSRB09CBY';

var r_token = "eyJraWQiOiJoczI1Ni1rZXkiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lkcC5hcGljb25uZWN0LmNvbSIsImF1ZCI6ImdldC1wcmFjdGl0aW9uZXItcm9sZS1hcGkiLCJleHAiOjE2MTAwOTE1NzcsImlhdCI6MTYwNzQ5OTU3Nywic2NwIjoicHJhY3RpdGlvbmVyLnJlYWQifQ.PsMCk4vgn8Hg0m5MhtEdn4zqUDmf-tWjckINZr-rnvo";
//Invalid token : eyJraWQiOiJoczI1Ni1rZXkiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lkcC5hcGljb25uZWN0LmNvbSIsImF1ZCI6ImdldC1wcmFjdGl0aW9uZXItYXBpIiwiZXhwIjoxNjA2NjcxNTkyLCJpYXQiOjE2MDY2NTcxOTIsInNjcCI6InByYWN0aXRpb25lci5yZWFkIn0.R0oX91gR-lSDQ4KhtvAEOsZCaK1uPw2Q2Oumag2tP-c

$(document).ready(function() {
	
	/**
	 * Refresh Token
	 */
	$("#refresh-token").click(function() {
		$("#practitioners_div").empty();
		var p_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/dev/poc/v2/token";
		$.ajax({
			url: p_url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'aud-claim': 'get-practitioner-api',
				'x-ibm-client-id': 'f3e0cb9a10c15c82244927f340a6d1b4'
		}}).done(function(data) {
			token_string = data.jwt;
			var str = token_string.split(' ');
			token = str[1];
			$("#practitioner_div").hide();
			$("#practitioners_div").show();
			var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body"> <div class="row"> <div class="col-lg-3 m-auto" ><img class="photo" src="photo.png" alt="" /></div> <div class="col "> <div class="row "> <div class="col align-center border-bottom col-prs-name" ><span class="text-success">Token refreshed successfully !! Please try again.</span></div> </div> </div> </div> </div> </div>';
			$("#practitioners_div").append(html);
			
		});
		
	});
	
	/**
	 * Search practitioners by last name
	 */
    $("#btn-lname").click(function() {
    	$("#practitioners_div").empty();
        var lname = $("#lastname").val();
		var p_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitioner?last_name=" + lname;
        $.ajax({
			url: p_url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + token,
				'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
		}}).done(function(data) {
			$("#practitioner_div").hide();
			$("#practitioners_div").show();
			
			data.entry.forEach(function(item) {
				
				var p_id = item.resource.id;
				var pid_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitionerRole/id/" + p_id;
				$.ajax({
					url: pid_url,
					type: 'GET',
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Bearer ' + r_token,
						'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
					}}).done(function(data) {
						var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body"> <div class="row"> <div class="col-lg-2 m-auto" ><img class="photo" src="images/photo.png" alt="" /></div> <div class="col "> <div class="row "> <div class="col align-center border-bottom col-prs-name" ><a href="#" id="prs-name" onclick=getpractitioner('+ p_id +');>'+ item.resource.name[0].text + '</a><div class="pull-right text-info">Role: ' + data.code[0].coding[0].code.charAt(0).toUpperCase() + data.code[0].coding[0].code.slice(1) + '<div></div> </div> <div class="row"> <div class="col align-center col-prs" ><label class="prs-label">Specialty</label><br><input type="text" name="prs-spec" id="prs-spec" value="'+ data.specialty[0].coding[0].code +'" readonly class="prs-input"></div> <div class="col align-center col-prs" ><label for="prs-sdate" class="prs-label">Location</label><div>'+data.location[0].display +'</div></div> <div class="col align-center col-prs" ><label  class="prs-label">HealthCare Service</label><br><div>'+data.healthcareService[0].display +' </div></div> </div> </div> </div> </div> </div>';
						$("#practitioners_div").append(html);	
						});
			});
		}).fail(function(data){
			$("#practitioners_div").show();
			var responseText = JSON.parse(data.responseText);
			var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body text-danger"><div class="row">' +
				'<div class="col-sm-4"><h6> httpCode: </h6></div><div class="col"><h6> ' + responseText.httpCode +'</h6></div>' +
				'</div><div class="row">' +
				'<div class="col-sm-4"><h6> httpMessage: </h6></div><div class="col"><h6> ' + responseText.httpMessage +'</h6></div>' +
				'</div><div class="row">' +
				'<div class="col-sm-4"><h6> moreInformation: </h6></div><div class="col"><h6> ' + responseText.moreInformation +'</h6></div>' +
				'</div></div></div>';
			$("#practitioners_div").append(html);
		});
    });
	
    $("#address-sel").change(function() {
        var use = $("#address-sel").val();
        if (use == "home") {
            $("#home-address").show();
            $("#work-address").hide();
        } else if (use == "work") {
            $("#home-address").hide();
            $("#work-address").show();
        }
    });
	
	
	/**
	 * Get Role of the selected practitioner
	*/
    $("#role-a").click(function() {
		$('#role_div').find('input:text').val('');
		$('#role_div').find('textarea').val('');
        var pid = $("#pid").val();
        if (pid.length > 0) {
            var p_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitionerRole/id/" + pid;
            $.ajax({
			url: p_url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + r_token,
				'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
		}}).done(function(data) {
				
			    $("#ppo").val(data.extension[0].valueReference.display);
                $("#ppo-text").text(data.extension[2].valueString);
                $("#role_code").val(data.code[0].coding[0].code.charAt(0).toUpperCase() + data.code[0].coding[0].code.slice(1));
                $("#speciality").val(data.specialty[0].coding[0].code);
                $("#location").val(data.location[0].display);
                $("#org").val(data.organization.display);
                $("#speriod").val(data.period.start);
                $("#hservice").val(data.healthcareService[0].display);
                $("#phone").val(data.telecom[0].value);
                $("#dofweek").val(JSON.stringify(data.availableTime[0].daysOfWeek));
                $("#stime").val(data.availableTime[0].availableStartTime);
                $("#etime").val(data.availableTime[0].availableEndTime);
				
		}).fail(function(data){
			$("#practitioners_div").show();
			var responseText = JSON.parse(data.responseText);
			var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body text-danger"><div class="row">' +
				'<div class="col-sm-4"><h6> httpCode: </h6></div><div class="col"><h6> ' + responseText.httpCode +'</h6></div>' +
				'</div><div class="row">' +
				'<div class="col-sm-4"><h6> httpMessage: </h6></div><div class="col"><h6> ' + responseText.httpMessage +'</h6></div>' +
				'</div><div class="row">' +
				'<div class="col-sm-4"><h6> moreInformation: </h6></div><div class="col"><h6> ' + responseText.moreInformation +'</h6></div>' +
				'</div></div></div>';
			$("#practitioners_div").append(html);
		});
			
			
        }
    });
	
    $("#info-ppo").click(function() {
        $("#ppo-text").toggle();
    });
	
	/***
     * Get practitioners by role
     */
	$("#btn-role").click(function() {
		$("#practitioners_div").empty();
		var specialty = $("#role").val();
		var p_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitionerRole?practitioner-specialty=" + specialty;
		
		$.ajax({
			url: p_url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + r_token, 
				'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
		}}).done(function(data) {
			$("#practitioner_div").hide();
			$("#practitioners_div").show();
			data.entry.forEach(function(item) {
				var p_id = item.resource.id;
				var pid_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitioner/id/"+p_id;
				$.ajax({
					url: pid_url,
					type: 'GET',
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Bearer ' + token,
						'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
					}}).done(function(data) {
						var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body"> <div class="row"> <div class="col-lg-2 m-auto" ><img class="photo" src="images/photo.png" alt="" /></div> <div class="col "> <div class="row "> <div class="col align-center border-bottom col-prs-name" ><a href="#" id="prs-name" onclick=getpractitioner('+ p_id +');>'+ data.name[0].text + '</a><div class="pull-right text-info">Role: ' + item.resource.code[0].coding[0].code.charAt(0).toUpperCase() + item.resource.code[0].coding[0].code.slice(1) + '<div></div> </div> <div class="row"> <div class="col align-center col-prs" ><label class="prs-label">Specialty</label><br><input type="text" name="prs-spec" id="prs-spec" value="'+ item.resource.specialty[0].coding[0].code +'" readonly class="prs-input"></div> <div class="col align-center col-prs" ><label for="prs-sdate" class="prs-label">Location</label><div>'+item.resource.location[0].display +'</div></div> <div class="col align-center col-prs" ><label  class="prs-label">HealthCare Service</label><br><div>'+item.resource.healthcareService[0].display +' </div></div> </div> </div> </div> </div> </div>';
						$("#practitioners_div").append(html);	
						});
					});
					}).fail(function(data){
						var responseText = JSON.parse(data.responseText);
						var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body text-danger"><div class="row">' +
							'<div class="col-sm-4"><h6> httpCode: </h6></div><div class="col"><h6> ' + data.status +'</h6></div>' +
							'</div><div class="row">' +
							'<div class="col-sm-4"><h6> httpMessage: </h6></div><div class="col"><h6> ' + responseText.OperationOutcome.issue.severity +'</h6></div>' +
							'</div><div class="row">' +
							'<div class="col-sm-4"><h6> moreInformation: </h6></div><div class="col"><h6> ' + responseText.OperationOutcome.issue.code +'</h6></div>' +
							'</div></div></div>';
						$("#practitioners_div").append(html);
					});
	
	});
	
	
	
    /***
     * Get All practitioners
     */
	$("#practitioners").click(function() {
		$("#practitioners_div").empty();
		var p_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitioners";
		$.ajax({
			url: p_url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + token, 
				'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
		}}).done(function(data) {
			$("#practitioner_div").hide();
			$("#practitioners_div").show();
			data.entry.forEach(function(item) {
				var p_id = item.resource.id;
				var pid_url = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitioner/id/"+p_id;
			$.ajax({
				url: pid_url,
				type: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + token,
					'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
			}}).done(function(data) {
				var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body"> <div class="row"> <div class="col-lg-2 m-auto" ><img class="photo" src="images/photo.png" alt="" /></div> <div class="col "> <div class="row "> <div class="col align-center border-bottom col-prs-name" ><a href="#" id="prs-name" onclick=getpractitioner('+ p_id +');>'+ data.name[0].text + '</a><div class="pull-right text-info">Role: ' + item.resource.code[0].coding[0].code.charAt(0).toUpperCase() + item.resource.code[0].coding[0].code.slice(1) + '<div></div> </div> <div class="row"> <div class="col align-center col-prs" ><label class="prs-label">Specialty</label><br><input type="text" name="prs-spec" id="prs-spec" value="'+ item.resource.specialty[0].coding[0].code +'" readonly class="prs-input"></div> <div class="col align-center col-prs" ><label for="prs-sdate" class="prs-label">Location</label><div>'+item.resource.location[0].display +'</div></div> <div class="col align-center col-prs" ><label  class="prs-label">HealthCare Service</label><br><div>'+item.resource.healthcareService[0].display +' </div></div> </div> </div> </div> </div> </div>';
				$("#practitioners_div").append(html);	
			});
				
			});
		}).fail(function(data){
			$("#practitioners_div").show();
			var responseText = JSON.parse(data.responseText);
			var html = '<div class="card shadow mb-3 bg-white rounded"> <div class="card-body text-danger"><div class="row">' +
				'<div class="col-sm-4"><h6> httpCode: </h6></div><div class="col"><h6> ' + responseText.httpCode +'</h6></div>' +
				'</div><div class="row">' +
				'<div class="col-sm-4"><h6> httpMessage: </h6></div><div class="col"><h6> ' + responseText.httpMessage +'</h6></div>' +
				'</div><div class="row">' +
				'<div class="col-sm-4"><h6> moreInformation: </h6></div><div class="col"><h6> ' + responseText.moreInformation +'</h6></div>' +
				'</div></div></div>';
			$("#practitioners_div").append(html);
		});
	
	});
	
	$("#prs-list").click(function() {
		$("#practitioners_div").toggle();
		$("#practitioner_div").toggle();
	});
});

function getpractitioner(id) {
		$("#practitioner_div").show();	
		$("#practitioners_div").hide();
		var p_url  = "https://apic-inst-gw-gateway-apic.mycluster-cp4i-616508-b328105c30d965a4f1fbed500f313919-0000.us-south.containers.appdomain.cloud/cts-fhir-org/sandbox/apic/v4.0/practitioner/id/"+ id;
        $.ajax({
			url: p_url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + token,
				'x-ibm-client-id': '1b763814463678b2e2944d500e1007a1'
		}}).done(function(data) {
			populateProfile(data);
		});
}

function populateProfile(data) {
	var fullName = data.name[0].text;
	var names = fullName.split(" ");
	$("#fname").val(names[0]);
	$("#lname").val(names[1]);
	$("#pid").val(data.id);
	$("#period").val(data.identifier[0].period.start);
	$("#assigner").val(data.identifier[0].assigner.display);
	$("#address-div").show();
	$("#address-sel").empty();
	data.address.forEach(function(item) {
		var use = item.use;
		$("#address-sel").append($("<option />").val(use).text(use.charAt(0).toUpperCase() + use.slice(1)));
		if (use == "home") {
			$("#home-address").val(item.text);
			$("#home-address").show();
			$("#work-address").hide();
		}
		if (use == "work") {
			$("#work-address").val(item.text);
		}
	});
	$("#gender").val(data.gender.charAt(0).toUpperCase() + data.gender.slice(1));
	$("#bdate").val(data.birthDate);
	$("#qual-div").show();
	$("#qual-list").empty();
	data.qualification.forEach(function(item) {
		var html = '<li><div class="row qual-row" ><div class="col-sm-3">Code :</div><div class="col float-left" ><input type="text" id="code" name="code" value="' + item.code.text + '" readonly class="profile_input"></div></div><div class="row qual-row" ><div class="col-sm-3">Issuer :</div><div class="col" ><a href="' + item.identifier[0].system + '">' + item.issuer.display + '</a></div></div> <div class="row qual-row" ><div class="col-sm-3">Period :</div> <div class="col float-left" > <input type="text" value="' + item.period.start + " - " + item.period.end + '" style="background:transparent; border:0"></div></div></li>';
		$("#qual-list").append(html);
	});
}
