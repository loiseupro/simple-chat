
$(document).ready(function(){

	/* Seconds for set user as active */
	var seconds_active_user = 15;
	/* Time to refresh messages and actives */
	var time_refresh = 2500;
	/* User identifier */
	var id_user = 0;
	/* Users of this chat */
	var users = [];


	/* Check if user is in users for this chat */
	function checkUser(){
		var issetUser = false;
		for(i=0; i<users.length; i++){
			if(users[i]['id_user'] == id_user) issetUser = true;
		}		
		if(!issetUser) $(".ada-chat").remove();			
	}


	/* Get new input message */
	function getInputMsg(){
		return $(".write-msg").val();
	}


	/* Get avatar from id_user */
	function getAvatar(user){
		for(j=0;j<users.length;j++){
			if(users[j]['id_user'] == user){
				return users[j]['username'].charAt(0);
			}
		}	
		return '';
	}


	/* Scroll to last msg */
	function scrollLastMsg(){
		$('.messages').animate({scrollTop: $('.messages').prop("scrollHeight")}, 500);
		return true;
	}


	/* Set user as active */
	function showUserActive(username){
		$('#username-'+username).addClass('active');
		return true;
	}


	/* Unset user as active */
	function unshowUserActive(username){
		$('#username-'+username).removeClass('active');
		return true;
	}


	/* Show new message */
	function showMsg(type, id_line, avatar, msg){
		var newMsg = $('#msg-'+type).html();
		newMsg = newMsg.replace("the_avatar", avatar);	
		newMsg = newMsg.replace("the_id_line", id_line);
		newMsg = newMsg.replace("the_msg", msg);
		$('.messages').append(newMsg);
		return true;
	}


	/* Detect changes  */
	function refresh(){
		getUsers();
		checkUser();		
		getLine();
		setTimeout(refresh, time_refresh);
	}


	/* Insert chat line */
	function setUserActive(){			
		var params = {
			"id_chat": id_chat,
			"id_user": id_user,
			"function": "setUserActive"
		};
		$.ajax({
			url: "controller/ajax.php",
			type: "POST",
			async: true,
			data: params,
			complete: function(){	
				getUsers();		
			}
		});	
	}


	/* Get users */
	function getUsers(){	

		var params = {
			"id_chat": parseInt(id_chat),
			"function": "getUsers"
		};

		$.ajax({
			url: "controller/ajax.php",
			type: "POST",
			async: false,
			data: params,
			success: function(response){
				response = JSON.parse(response); 
				if(response.length>0){
					users = response;
					/* Get current user id */	
					for(i=0;i<response.length;i++){
						if(response[i]['username']  == active_username){
							id_user = response[i]['id_user'];		
						}
					}

					/* Show users */
					var to_choose = '';
					var to_header = '';
					var to_bottom = '';
					var to_activate = [];
					var to_deactivate = [];
					for(i=0;i<response.length;i++){	
						to_choose += '<p><a href="?username='+response[i]['username']+'">'+response[i]['public_name']+'</a></p>';
						to_header += '<span class="participant">'+response[i]['public_name']+'</span>, ';
						to_bottom += '<span id="username-'+response[i]['username']+'" class="avatar-round" title="'+response[i]['public_name']+'">'+response[i]['username'].charAt(0)+'</span>';
						if(response[i]['id_user'] == id_user) $('.header .avatar .avatar-round').html(response[i]['username'].charAt(0));

						var now = Date.now();
						var last = response[i]['last_user_active']+'000';
						var diff = (now - last) /1000;
						
						/* Set users to activate or deactivate */
						if( response[i]['last_user_active'] == '' || diff > seconds_active_user ){
							to_deactivate.push(response[i]['username']);
						}else{
							to_activate.push(response[i]['username']);
						}

					}

					/* Update users to choose */
					$('.users').html(to_choose);

					/* Update users on header */
					$('.header .participants').html(to_header);

					/* Update users at bottom of chat */
					$('.participants-avatar').html(to_bottom);

					/* Deactivate users */
					for(i=0;i<to_deactivate.length;i++){
						unshowUserActive(to_deactivate[i]);
					}

					/* Activate users */
					for(i=0;i<to_activate.length;i++){
						showUserActive(to_activate[i]);
					}

				}
			}
		});	

	}


	/* Insert chat line */
	function addLine(msg){		
		var params = {
			"msg": msg,
			"id_chat": id_chat,
			"id_user": id_user,
			"function": "addLine"
		};
		$.ajax({
			url: "controller/ajax.php",
			type: "POST",
			async: true,
			data: params,
			complete: function(){	
				getLine();			
			}
		});	
	}


	/* Update chat lines */
	function getLine(){	

		var last_id_chat = $('.history .messages div:last-child').data('id-line');	
		if(last_id_chat == undefined) last_id_chat = 0;	

		var params = {
			"id_chat": id_chat,
			"id_from": last_id_chat,
			"function": "getLine"
		};

		$.ajax({
			url: "controller/ajax.php",
			type: "POST",
			async: true,
			data: params,
			success: function(response){
				response = JSON.parse(response);
				if(response.length>0){				
					/* Add new lines to chat */
					for(i=0;i<response.length;i++){						
						var avatar = getAvatar(response[i]["id_user"]);
						var type = 'in';
						if(response[i]["id_user"] == id_user) type = 'out';
						showMsg(type, response[i]["id_line"], avatar, response[i]["msg"]);
					}	

				}
			}
		});	
		scrollLastMsg();
	}

	/* Detect and send message */
	$(document).on('keydown', '#entry', function(ev) {
		if(ev.key === 'Enter') {
			addLine(getInputMsg());
			$("#entry").val('');
			scrollLastMsg();
		}		
	});

	/* Detect input focus */
	$("#entry").focus(function() {
		setUserActive();
	});

	/* Init the excution of chat */
	refresh();	


});