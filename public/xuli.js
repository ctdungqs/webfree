socket.on("server-send-dki-thatbai", function(){
	alert("Có người đăng kí rồi");
})

socket.on("server-send-dki-thanhcong", function(data){
	$('#curentUser').html(data);
	$('#loginForm').hide(2000);
	$('#chatForm').show(1000);
});

socket.on("server-send-danhsach-Users",function(data){
	$('#boxContent').html("");
	data.forEach(function(i){
		$('#boxContent').append("<div class='user'>" + i + "</div>");
	})
});

socket.on("server-send-message", function(data){
	$('#listMessage').append("<div class='ms'>"+ data.un + ":" + data.nd + "</div>");
})

socket.on("ai-do-dang-go-chu", function(data){
	$('#thongbao').html(data);
})

socket.on("ai-do-STOP-go-chu", function(){
	$('#thongbao').html("");
});

$(document).ready(function(){
	$('#loginForm').show();
	$('#chatForm').hide();

	$('#btnRegister').click(function(){
		socket.emit("client-send-Username", $("#txtUsername").val());
	});

	$('#btnLogout').click(function(){
		socket.emit("logout");
		$('#loginForm').show();
		$('#chatForm').hide();
	})

	$('#btnSendMessage').click(function(){
		socket.emit("user-send-message", $('#txtMessage').val());
	})

	$('#txtMessage').focusin(function(){
		socket.emit("toi-dang-go-chu");
	});

	$('#txtMessage').focusout(function(){
		socket.emit("toi-stop-go-chu");
	});
})