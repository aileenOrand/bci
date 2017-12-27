var SERVICE_PREFIX = "api/v1/rest/admin"
//SERVICE_PREFIX = "http://192.168.1.96/bci-biometria/" + SERVICE_PREFIX;

var open = false;
var seleccionada = '';
var seleccionadaArc = '';


function printSesiones(data){
	var sesiones = data["sessions"];
	var tabla = '<table id="tablaSesiones"><thead><tr>';
	tabla += '<th width="20%">Fecha</th>';
	tabla += '<th width="10%">Rut</th>';
	tabla += '<th width="30%">Nombre</th>';
	tabla += '<th width="20%">Usuario</th>'
	tabla += '<th width="10%">Reporte</th>';
	tabla += '<th width="10%">Cédula</th>';
	tabla += '</tr></thead><tbody>';
	for (key in sesiones) {
		var filas = sesiones[key];
		tabla += '<tr onclick="loadSesion(\'' + filas["session_id"] + '\')">';
		tabla += '<td>' + filas["session_fecha"] + '</td>';
		tabla += '<td>' + filas["cedula_rut"] + '</td>';
		tabla += '<td>' + filas['cedula_nombres'] + ' ' + filas['cedula_paterno'] + ' ' + filas['cedula_materno'] + '</td>';
		tabla += '<td>' + filas['nombre_telefono'] +'</td>';
		tabla += '<td>' + filas["final_report"] + '</td>';
		var imagen = '';
		if (filas["cedula_face_url"])
			imagen = '<center><img src="' + filas["cedula_face_url"]
					+ '" width="40" height="50"></center>';
		tabla += '<td>' + imagen + '</td></tr>';
	}
	tabla += '</tbody></table>';
	$('#div_tablaSesiones').html(tabla);
	var table = $('#tablaSesiones').DataTable({
			"paging": true,
			"pagingType": "full_numbers",			
			"lengthMenu": [ 25, 50, 75, 100 ],
			"ordering": true,
			"order": [[ 0, 'desc' ], [ 1, 'asc' ]]
	});
}


function printError(){
	alert("error de conexion");
}

function loadSessions() {
	$.ajax({
		url : SERVICE_PREFIX + "/sesiones",
		type : 'get',
		dataType : 'json',
		async : true,
		success : function(data) {
			if (!data || data["status"] != 0) {
				printError();
			} else {
				printSesiones(data);
			}
		},
		error : function(data) {
			printError();
		}
	});

}

function printSesion(data){
	$('#id').html(data['session_id']);
	$('#estado').html(data['session_estado']);
	$('#fecha').html(data['session_fecha']);
	$('#remoteIp').html(data['session_remoteIp']);
	$('#userAgent').html(data['session_userAgent']);
	$('#phoneName').html(data['nombre_telefono']);
	
	$('#report').html(data['final_report']);
	$('#serie').html(data['cedula_serie']);
	$('#rut').html(data['cedula_rut']);
	$('#nombre').html(
			data['cedula_nombres'] + ' ' + data['cedula_paterno'] + ' '
					+ data['cedula_materno']);
	$('#sexo').html(data['cedula_sexo']);
	$('#nacionalidad').html(data['cedula_nacionalidad']);
	$('#nacimiento').html(data['cedula_nacimiento']);
	$('#emision').html(data['cedula_emision']);
	$('#vencimiento').html(data['cedula_vencimiento']);
	$('#video_score').html(data['video_score']);

	$('#frame0').html('');
	if (data['cedula_face_url'])
		$('#frame0').html(
				'<center><img src="' + data['cedula_face_url']
						+ '" width="150" height="200"></center>');

	$('#frame1').html('');
	if (data['video_selfie_url'])
		$('#frame1').html(
				'<center><img src="' + data['video_selfie_url']
						+ '" width="200" ></center>');

	$('#video_result').html('');
	if (data['video_result'] == "true")
		$('#video_result').html("Aceptado");
	if (data['video_result'] == "false")
		$('#video_result').html("No Coincide con Foto");

	$('#superior').html('');
	if (data['cedula_front_url'])
		$('#superior').html(
				'<center><img src="' + data['cedula_front_url']
						+ '" width="220" height="150"></center>');

	$('#posterior').html('');
	if (data['cedula_back_url'])
		$('#posterior').html(
				'<center><img src="' + data['cedula_back_url']
						+ '" width="220" height="150"></center>');

	var tablaF = '<table id="tableFiles">';
	tablaF+='<tbody>';
	for (num in data["files"]) {
		var file = data["files"][num];
		tablaF += '<tr style="background-color:#'
				+ ((num % 2 == 0) ? "EEEEEE" : "DDDDDD")
				+ '"><td><a href="' + file.url
				+ '" target="_blank">' + file.name + '</a></td>';
		tablaF += '<td>' + file.size + '</td>';
		tablaF += '<td>' + file.date + '</td></tr>';
	}
	tablaF += '</tbody></table>';
	$('#files').html(tablaF);

	$('#divSesion').dialog('open');	
}

function loadSesion(sessionid) {
	$.ajax({
		url : SERVICE_PREFIX + '/sesion/' + sessionid,
		type : 'get',
		dataType : 'json',
		async : true,
		success : function(data) {
			if (!data || data["status"] != 0) {
				printError();
			} else {
				printSesion(data);
			}
		},
		error : function(data) {
			printError();
		}
	});
}

$( function() {
    $( "#divSesion" ).dialog({
      autoOpen: false,
      modal: true,
	  width       :   1000,
      heigth      :   500,
      show: {
        effect: "blind", 
        duration: 100
      },
      hide: {
        effect: "blind",
        duration: 100
      }
    });
    $("#divSesion" ).css("visibility", "visible");
  });

loadSessions();

