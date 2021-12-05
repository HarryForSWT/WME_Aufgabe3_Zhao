let API_URL = 'http://localhost:3000'

function pad(n) {
  n = n + '';
  return n.length >= 3 ? n : new Array(3 - n.length + 1).join(0) + n;
}
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


$("#add_submit").click(function (e) {
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
        $("#status_range").append("<p> Range not possible.</p>");
        var x = document.getElementById('status_range');
        x.style.backgroundColor = "red";
      }else if (country_id) {
        $("#status_id").append("<p> No such id " + country_id + " in database.</p>");
        var x = document.getElementById('status_id');
        x.style.backgroundColor = "red";
      }
    }
  });
});


//show funktion
$("#show_selected_prop").click(function (e) {
  e.preventDefault();
  var propSelection = document.getElementById("prop_selection");
  const n = propSelection.selectedIndex + 1;
  $('#world_data_table tr > *:nth-child(' + n + ')').show();
});

//hide funktion
$("#hide_selected_prop").click(function (e) {
  e.preventDefault();
  var propSelection = document.getElementById("prop_selection");
  const n = propSelection.selectedIndex + 1;
  $('#world_data_table tr > *:nth-child(' + n + ')').hide();
});


$("#ad_submit").click(function (e) {
  e.preventDefault();
  var country_name = $("#country_name").val();
  var country_birth = $("#country_birth").val();
  var country_cellphone = $("#country_cellphone").val();

  if (country_name && country_birth && country_cellphone) {

    $.ajax({
      type: "POST",
      url: `${API_URL}/items`,
      data: JSON.stringify({ name: country_name, birth_rate_per_1000: country_birth, cell_phones_per_100: country_cellphone }),
      async: true,
      contentType: "application/json",
      dataType: 'text',
      success: function (data) {
        let element = $("#status_new_country").append("<p> Added country " + country_name + " to list!</p>");
        setTimeout(function () {
          $("#status_new_country").children().remove();
        }, 2000)
        var x = document.getElementById('status_new_country');
        x.style.backgroundColor = "lightgreen";
        setTimeout(function () { $('#status_new_country').html(""); }, 2000);
        getFullTable();
      }, error: function (jqXHR, text, err) {
        console.log(err);
        let element = $("#status_new_country").append("<p> Error! </p>");
        setTimeout(function () {
          $("#status_new_country").children().remove();

        }, 2000)
        var x = document.getElementById('status_new_country');
        x.style.backgroundColor = "red";
      }
    });
  }else{
    let element = $("#status_new_country").append("<p> Fill out the correct details! </p>");
    var x = document.getElementById('status_new_country');
    x.style.backgroundColor = "red";
    setTimeout(function () {
      $("#status_new_country").children().remove();

    }, 2000)
  }
});

$("#rm_submit").click(function (e) {
  e.preventDefault();
  var country_delete_id = pad($("#country_delete_id").val());

  var url = '';

  if (country_delete_id != 000) {
    url = '/' + country_delete_id;
  }
  $.ajax({
    type: "DELETE",
    url: `${API_URL}/items` + url,
    async: true,
    dataType: 'text',
    success: function (data) {
      var list = data.split(" ");
      switch (list[0]) {
        case "Deleted":
          $("#status_deleted_country").append("<p>" + data + "</p>");
          var x = document.getElementById('status_deleted_country');
          x.style.backgroundColor = "lightgreen";
          setTimeout(function () { $('#status_deleted_country').html(""); }, 2000);
          break;
        case "Item":
          $("#status_deleted_country").append("<p>" + data + "</p>");
          var x = document.getElementById('status_deleted_country');
          x.style.backgroundColor = "lightgreen";
          setTimeout(function () { $('#status_deleted_country').html(""); }, 2000);
          break;
        case "No":
          $("#status_deleted_country").append("<p>" + data + "</p>");
          var x = document.getElementById('status_deleted_country');
          x.style.backgroundColor = "red";
          setTimeout(function () { $('#status_deleted_country').html(""); }, 2000);
          break;
        default: break;
      }
      getFullTable();
    }, error: function (jqXHR, text, err) {
    }
  });
});

