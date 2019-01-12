var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangUsers = [];
io.on("connection", function(socket){
	console.log("Co nguoi ket noi:" + socket.id);

	socket.on("disconnect", function(){
		console.log(socket.id + " Ngắt kết nối !!!!!");
	});

	socket.on("client-send-Username", function(data){
		if(mangUsers.indexOf(data) >= 0){
			//fail
			socket.emit("server-send-dki-thatbai");
		}
		else{
			mangUsers.push(data);
			socket.Username = data;
			socket.emit("server-send-dki-thanhcong", data);
			io.sockets.emit("server-send-danhsach-Users", mangUsers);
		}
	});

	socket.on("user-send-message", function(data){
		io.sockets.emit("server-send-message", {un:socket.Username, nd:data});
	});

	socket.on("toi-dang-go-chu", function(){
		var s = socket.Username + " sang go chu";
		io.sockets.emit("ai-do-dang-go-chu", s);
	});

	socket.on("toi-stop-go-chu", function(){
		io.sockets.emit("ai-do-STOP-go-chu");
	})

	socket.on("logout", function(){
		mangUsers.splice(
			mangUsers.indexOf(socket.Username), 1
		);
		socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
	});

	socket.on("remote-admin", function(data){
		socket.join(data);
		socket.Phong = data;
		console.log( socket.adapter.rooms );
	})

	socket.on("remote-user", function(data){
		socket.join(data);
		socket.Phong = data;
		console.log( socket.adapter.rooms );
	})

	socket.on("send-data-admin", function(data){
		io.sockets.in(socket.Phong).emit("server-send-data-admin", data);
	});

	/*socket.on("Client-send-data", function(data){
		console.log(socket.id + " Vừa gởi: " + data);
		//io.sockets.emit("Server-send-data", data+"888");
		//socket.emit("Server-send-data", data+"888");
		socket.broadcast.emit("Server-send-data", data+"888");
	});*/
});

app.get("/", function(req, res){
	res.render("trangchu");
});