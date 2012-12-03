function PresidentView (){
	//variables to hold jquery encapsulated elements so you dont have to keep scanning dom also better for orginization
	var GameWidget, MiddleViewWidget,HandViewWidget,ContextMenuWidget,MiddleDeck,mainHeader,lobbyList;
	var socket;

	//stores the users current hand of cards im thinkin by a pair of card name and img src
	var curHand = new Array();

	//function that does the initial view setup for gameConsole
	this.setupGameConsole = function (Connection){
		socket = Connection;
		$('body').append('<div id="GameWidget"></div>');
		GameWidget = $('#GameWidget');
		GameWidget.css({
			width: '800px',
			height:'500px',
			border:'2px solid'
		});
		GameWidget.draggable().resizable();
		GameWidget.addClass('ui-widget');
		GameWidget.append('<h3 id="mainHeader" class="ui-widget-header">President</h3>')
		mainHeader = $('#mainHeader');
		initMiddleView();
		initHandView();
		initContextView();
		this.adjustPositionsAndHeights();
	}

	//Creates middleDeckView
	function initMiddleView(){
		GameWidget.append('<div id="MiddleViewWidget"></div>');
		MiddleViewWidget = $('#MiddleViewWidget');
		MiddleViewWidget.addClass('ui-widget-content');
	}

	//function that is called whenever there is any resizing of main game console wiget so that all other components are properly resized
	this.adjustPositionsAndHeights = function(){
		MiddleViewWidget.css({
			width: GameWidget.width()/2-10,
			height:(GameWidget.height()- (2 * mainHeader.height()))/2
		});
		MiddleViewWidget.position({
			my:"left top",
			at:"left+5 bottom",
			of: mainHeader
		});
		HandViewWidget.css({
			width: GameWidget.width()-10,
			height:(GameWidget.height() - (2 * mainHeader.height()))/2
		});
		HandViewWidget.position({
			my:"left top",
			at:"left bottom",
			of: MiddleViewWidget
		});
		ContextMenuWidget.css({
			width: GameWidget.width()/2 - 10,
			height:(GameWidget.height() - (2 * mainHeader.height()))/2
		});
		ContextMenuWidget.position({
			my:"left top",
			at:"right top",
			of: MiddleViewWidget
		});

		//place hand card and size correctly
		$('.handCard').width(HandViewWidget.width()/curHand.length)
		$('.handCard').height(HandViewWidget.height());

		if(curHand[0]){
		curHand[0].position({
			my:"left top",
			at:"left top",
			of:HandViewWidget
		});
		for(var i =1;i<curHand.length;i++){
			curHand[i].position({
				my:"left center",
				at:"right center",
				of:curHand[i-1]
			});
		}
	}
	}

	//function to render the middle or deck view
	this.RenderMiddleView = function(deck){
		$('.middleCard').remove();
		for(var i = 0;i<deck.length;i++){
				var source = deck[i];
				MiddleViewWidget.append('<div class="middleCard"><img src = "' + source + '"><div>');
				$('.middleCard').draggable();
		}
	}

	//function called to render the hand view
	this.RenderHandView = function(deck){
		curHand.length = 0;
		$('.handCard').remove();
		for(var i=0;i<deck.length;i++){
				var source = deck[i];
				HandViewWidget.append('<div class="handCard" id="' + i + 'H"><img src = "' + source + '"><div>');
				curHand.push($('#' + i + 'H'));
				$('.handCard').draggable();
		}
	}

	//sets up bottom div for hand cards
	function initHandView(){
		GameWidget.append('<div id="HandViewWidget"></div>');
		HandViewWidget = $('#HandViewWidget');
		HandViewWidget.addClass('ui-widget-content');
	}

	//sets up right side view of game console with user login then lobby view
	function initContextView(){
		GameWidget.append('<div id="ContextMenuWidget"></div>');
		ContextMenuWidget = $('#ContextMenuWidget');
		ContextMenuWidget.addClass('ui-widget-content');

		//login stuff
		ContextMenuWidget.append($('#loginForm'));
		$('#loginForm').show('slow');

		//event handler for login form submit
		$('#unameSubmit').click(function(){
			validateUname();
		})
	}

	//checks username and inits lobbymenu if success
	function validateUname(){
		var uname =   $('#userName').val();
		socket.emit('userLogin',{username:uname,id:socket.id});
		socket.on('loginSuccess',function(players){
			initLobbyMenu(players);
		});
		socket.on('userReject',function(){
			alert('UserName Already exists!');
		})
	}

	function initLobbyMenu (players){
		//get Rid of login Form
		$('#loginForm').slideUp('slow',function(){
			$(this).remove();
		})
		//setup lobby
		ContextMenuWidget.append('<ul id="lobbyList"></ul>');
		lobbyList = $('#lobbyList');
		for(var i=0;i<players.length;i++){
			lobbyList.append('<li> <a href="#" class="lobbyName" >' + players[i] + ' </a> <ul> <li> <a href="#">Chat</a></li> </ul> </li>');
		}
		lobbyList.menu();
		ContextMenuWidget.append('<input type="button" value="Queue for Game" id="beginButton"/>');
	}

	//adds player to lobby list
	this.addToLobby = function(uname){
		lobbyList.append('<li> <a href="#" class="lobbyName" >' + uname + ' </a> <ul> <li> <a href="#">Chat</a></li> </ul> </li>');
	}

}