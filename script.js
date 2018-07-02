var app = angular.module('TicTacToe', []);

app.controller('Ctrl', function($scope){

	$scope.isInit = false;
	$scope.isTaken = false;
	$scope.hasWon = false;
	$scope.turnCount = 1;

	//default input values
	$scope.n = 2;
	$scope.m = 3;
	$scope.l = 3;

	$scope.grid = [];

	$scope.start = function(){

		$scope.grid = new Array($scope.m).fill({col: new Array($scope.m)})

		for (var r=0; r<$scope.grid.length; r++){
			for (var c=0; c<$scope.grid[0].col.length; c++){
				console.log("row:" + r + " col:" + c + " val:" + $scope.grid[r].col[c]);
			};
		};

		//dynamic table width and height
		var boxes = document.querySelectorAll('.gridbox');
			//TODO make divs square
			//var divLen = $(window).width() / $scope.m;
			for(var i=0; i<boxes.length; i++){
    			/*
    			boxes[i].style.width = divLen + "%"; //divide divs evenly
    			boxes[i].style.height = divLen + "%";
    			*/
    			boxes[i].style.width = 100 / $scope.m + "%"; //divide divs evenly
    			boxes[i].style.height = 180 + "px";
			}

		$scope.isInit = true;
	}

	var isVerified = function(row, col){
		//verifies that pos is available to be used
		if($scope.grid[row].col[col]){
			//exists, is in use
			$scope.isTaken = true;
			return false;
		}
		else {
			//undefined, aka not used
			$scope.isTaken = false;
			$scope.grid[row].col[col] = turnCount % $scope.n;
			return true;	
		}
	}

	var hasWon = function(r, c){
		//check for winning condition

		//check each position around the selected box; 4 directions
		console.log("checking position");

		return false;
	}

	$scope.turn = function(row, col){

		//check if div has been chosen before
		if (!isVerified(row, col)) return;

		//if not possible to get a winning sequence yet, skip check
		if ($scope.turnCount < ($scope.n * ($scope.l - 1)) ) {
			turnCount++;
			return;
		}


		//main check
		if (hasWon(row, col)) {
			//player won
			console.log("A Player has won!");
		}
		else if (turnCount < Math.pow($scope.m)){
			//if max number of moves not yet reached
			turnCount++;
		}
		else {
			//draw
			$(document).getElementById('end_message').text = "It's a draw!";
			console.log("It's a draw!");
		}

		return;
		//Check whether l in a row has ben achieved

		//on win, display turncount % n as winner
		

	}

});
//get prompt (n,m,l)

//generate grid, assign id


//define check function on click


//result on win


//result on tie