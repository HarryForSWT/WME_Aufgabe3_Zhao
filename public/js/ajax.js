let API_URL = 'http://localhost:3000'

function pad(n){
	n = n + '';
	while (n.length <3){
		n = "0"+n;
	}
	return n;
}

//GET CALLs
function getFullTable() {
  $.ajax({
    type: "GET",
    url: `${API_URL}/items`,
    async: true,
    dataType: 'json',
    success: function (data) {
      $("#table_body").html("");
      $.each(data, function (index, element) {
        $("#table_body").append("<tr id=" + index + "></tr>");
        $.each(element, function (key, value) {
          $("#" + index).append("<td class=" + key + ">" + value + "</td>");
        })
      });
    }, error: function (jqXHR, text, err) {
    }
  });
}
$('document').ready(function (e) {
  $.ajax({
    type: "GET",
    url: `${API_URL}/properties`,
    async: true,
    dataType: 'json',
    success: function (data) {
      $("#prop_selection").html("");
      $.each(data, function (index, element) {
        $("#prop_selection").append("<option value=" + element + ">" + element + "</option>");
      });
    }, error: function (jqXHR, text, err) {
    }
  });
  getFullTable();
});


$("#country_filter").submit(function (e) {
  e.preventDefault();
  $("#status_id").html("");
  $("#status_range").html("");

  //Zugriff der ids von den Eingabefeldern
  var country_id = pad($("#country_filter_id").val());
  var country_id_range = $("#country_filter_range").val();

  //speziele Syntaxverarbeitung für country range z.B. 2-5
  const rangeIDArray = country_id_range.split("-"); // '2-5' wird in ein Array durch '-'Zeichen getrennt.
  const id1 = pad(rangeIDArray[0]); //linke Seite vom -
  const id2 = pad(rangeIDArray[1]);//rechte Seite vom -

  var url_ = ''; //Initialisieren für ajax' url.

  if (country_id_range) {
    url_ = "/" + id1 + "/" + id2;
  }
  else if (country_id) {
    url_ = "/" + country_id;
  }

  $.ajax({
    type: "GET",
    url: `${API_URL}/items` + url_,
    async: true,
    dataType: 'json',
    success: function (data) {    
      $("#table_body").html("");
      $.each(data, function (index, element) {
        $("#table_body").append("<tr id=" + index + "></tr>");
        $.each(element, function (key, value) {
          $("#" + index).append("<td class=" +key+">" + value + "</td>");
        })
      });
    }, error: function (jqXHR, text, err) {
      if (country_id_range) {
        var bg1 = document.getElementById('status_range');
        bg1.innerHTML="Range not possible."
        bg1.style.backgroundColor = "red";
      }else if (country_id) {
        var bg2 = document.getElementById('status_id');
        bg2.innerHTML= "No such id " + country_id + " in database."
        bg2.style.backgroundColor = "red";
      }
    }
  });
});


//show funktion GET CALL
$("#show_selected_prop").click(function (e) {
  e.preventDefault();
  var propSelection = document.getElementById("prop_selection");
  const n = propSelection.selectedIndex + 1;
  $('#world_data_table tr > *:nth-child(' + n + ')').show();
});

//hide funktion GET CALL
$("#hide_selected_prop").click(function (e) {
  e.preventDefault();
  var propSelection = document.getElementById("prop_selection");
  const n = propSelection.selectedIndex + 1;
  $('#world_data_table tr > *:nth-child(' + n + ')').hide();
});

//Add Country POST CALL
$("#country_add").submit(function (e) {
  e.preventDefault();
  var country_name = $("#country_name").val();
  var country_birth = $("#country_birth").val();
  var country_cellphone = $("#country_cellphone").val();

  if (country_name && country_birth && country_cellphone) {

    $.ajax({
      type: "POST",
      url: `${API_URL}/items`,
      data: JSON.stringify({ 
        name: country_name, 
        birth_rate_per_1000: country_birth, 
        cell_phones_per_100: country_cellphone }),
      async: true,
      contentType: "application/json",
      dataType: 'text',
      success: function (data) {
        var bg6 = document.getElementById('status_new_country');
        bg6.innerHTML="Added country " + country_name + " to list!";
        bg6.style.backgroundColor = "lightgreen";
        setTimeout(function () { $('#status_new_country').html(""); }, 2500);
        getFullTable();
      }, error: function (jqXHR, text, err) {
        var bg7 = document.getElementById('status_new_country');
        bg7.innerHTML=text;
        bg7.style.backgroundColor = "red";
        setTimeout(function () { $('#status_new_country').html(""); }, 2500);
      }
    });
  }else{
    var bg8 = document.getElementById('status_new_country');
    bg8.innerHTML ="Fill out the correct details! ";
    bg8.style.backgroundColor = "red";
    setTimeout(function () { $('#status_new_country').html(""); }, 2500);
  }
});

//DELETE CALL
$("#rm_submit").click(function (e) {
  e.preventDefault();
  var country_delete_id = pad($("#country_delete_id").val());

  var url = '';  //Initialisieren für ajax' url, wenn nicht eingegeben wird, 
                //dann wird "app.delete('/items')" aufgerufen
  
   //Eingabe mit 000 wird als nicht eingegeben betrachtet. 
  //Hier ist dann wenn nicht 000 eingegeben wird.
  if (country_delete_id != 000) {
    url = '/' + country_delete_id;
  }
  $.ajax({
    type: "DELETE",
    url: `${API_URL}/items` + url,
    async: true,
    dataType: 'text',
    success: function (data) {
      var bg3 = document.getElementById('status_deleted_country');
      bg3.innerHTML= data;
      bg3.style.backgroundColor = "lightgreen";
      setTimeout(function () { $('#status_deleted_country').html(""); }, 2500);
      getFullTable();
    }, error: function (jqXHR, text, err) {
      text = 'No such id ' + country_delete_id  + ' in database'
       var bg5 = document.getElementById('status_deleted_country');
       bg5.innerHTML= text;
       bg5.style.backgroundColor = "red";
       setTimeout(function () { $('#status_deleted_country').html(""); }, 2500);
    }
  });
});

