var app = angular.module('TicTacToe', []);

app.filter('makeNonzero', function () {
	//filter for displaying player number in grid
  return function (val) {
    return val > 0 ? val : "";
  };
});

app.filter('makeNum', function(){
	return function (val) {
		return isNaN(val) ? 3 : val;
	}
})

app.controller('Ctrl', function($scope, $timeout){

	$scope.isInit = false;
	$scope.isTaken = false;
	$scope.isFin = false;
	$scope.turnCount = 0;
	$scope.currentPlayer = 1;

	//default input values
	$scope.n = 2; //num of players
	$scope.m = 3; //grid len
	$scope.l = 3; //win len

	$scope.grid = [];

	$scope.$watch('n', function() {
		if (isNaN($scope.n)) $scope.n = 2;//enforce number with custom input
	});

	$scope.$watch('l', function() {
		if (isNaN($scope.l)) $scope.l = 3;//enforce number with custom input
	});

	$scope.$watch('m', function() { 
		
		if (isNaN($scope.m)) $scope.m = 3;//enforce number with custom input

		//make sure gridboxes are rendered by AngularJS
        $scope.grid = [];
        for (var i=0; i<$scope.m; i++){
        	$scope.grid.push({col:new Array(parseInt($scope.m)).fill(0)});
        }
        
	});

	var printGrid = function(){
		var printStr;
		for (var r=0; r<$scope.grid.length; r++){
			printStr = "";
			for (var c=0; c<$scope.grid.length; c++){
				printStr += $scope.grid[r].col[c] + " ";
			}
			console.log(printStr);
		}
	}

	$scope.start = function(){

		//input validation
		if($scope.n < 2){
			alert("Please make sure the number of players is at least 2.")
			return;
		} 
		if($scope.m < 3){
			alert("Please make sure the grid length is at least 3.")
			return;
		} 
		if($scope.l < 2){
			alert("Please make sure the win condition is at least 3.")
			return;
		} 

		//set custom gridbox width
		var boxes = document.querySelectorAll('.gridbox');
		for(var i=0; i<boxes.length; i++){
			if(i<$scope.m)	boxes[i].style.borderTop = "none";
			if(i>boxes.length - $scope.m -1) boxes[i].style.borderBottom = "none";
			if(i % $scope.m === 0) boxes[i].style.borderLeft = "none";
			if(i % $scope.m === $scope.m-1) boxes[i].style.borderRight = "none";

			boxes[i].style.width = 100 / $scope.m + "%"; //divide divs evenly
		}

		printGrid();
		$scope.isInit = true;
	
	} 

	var isVerified = function(row, col){
		//verifies that pos is available to be used

		if($scope.grid[row].col[col] > 0){
			//exists, is in use
			$scope.isTaken = true;
			return false;
		}
		else {
			//undefined, aka not taken
			$scope.isTaken = false;
			return true;
		}
	}

	var hasWon = function(r, c){
		//check for l in a row

		//check vertical
		var count = 1;
		for(var i=r-1; i>=0; i--){//check above
			//console.log("checking row " + i + " w/ val " + $scope.grid[i].col[c]);
			if ($scope.grid[i].col[c] === $scope.currentPlayer) count++;
			else break;
		}
		for(var i=r+1; i<$scope.m; i++){//check below
			if ($scope.grid[i].col[c] === $scope.currentPlayer) count++;
			else break;
		}
		//console.log(count);
		if(count >= $scope.l) return true;
		//console.log("vertical check failed!");

		
		//check horizontal
		var count = 1;
		for(var i=c-1; i>=0; i--){//check left
			if ($scope.grid[r].col[i] === $scope.currentPlayer) count++;
			else break;
		}
		for(var i=c+1; i<$scope.m; i++){//check right
			if ($scope.grid[r].col[i] === $scope.currentPlayer) count++;
			else break;
		}
		//console.log(count);
		if(count >= $scope.l) return true;
		//console.log("horizontal check failed!");


		//check pos diagonal
		var count = 1;
		for(var i=r-1; i>=0; i--){ //check upper right
			//col number to check is equal to c + (r - i)
			var col = c+r-i;
			//console.log("UR checking row " + i + " and col" + col + " w/ val " + $scope.grid[i].col[col]);
			if (col >= $scope.m) break; //if col is out of range
			if ($scope.grid[i].col[col] === $scope.currentPlayer) count++;
			else break;	
			//console.log("new count is "+count);
		}
		for(var i=r+1; i<$scope.m; i++){//check lower left
			//col number to check is equal to c + (r - i)
			var col = c+r-i;
			//console.log("LL checking row " + i + " and col" + col + " w/ val " + $scope.grid[i].col[col]);
			if (col < 0) break; //if col is out of range
			if ($scope.grid[i].col[col] === $scope.currentPlayer) count++;
			else break; //if blank or !match then stop count
			//console.log("new count is "+count);
		}
		//console.log(count);
		if(count >= $scope.l) return true;
		//console.log("pos diagonal check failed!");


		//check neg diagonal
		var count = 1;
		for(var i=r-1; i>=0; i--){ //check upper left
			//col number to check is equal to c - (r - i)
			var col = c-r+i;
			//console.log("UL checking row " + i + " and col" + col + " w/ val " + $scope.grid[i].col[col]);
			if (col < 0) break; //if col is out of range
			if ($scope.grid[i].col[col] === $scope.currentPlayer) count++;
			else break;	
			//console.log("new count is "+count);
		}
		for(var i=r+1; i<$scope.m; i++){//check lower right
			//col number to check is equal to c - (r - i)
			var col = c-r+i;
			//console.log("LR checking row " + i + " and col" + col + " w/ val " + $scope.grid[i].col[col]);
			if (col > $scope.m) break; //if col is out of range
			if ($scope.grid[i].col[col] === $scope.currentPlayer) count++;
			else break; //if blank or !match then stop count
			//console.log("new count is "+count);
		}
		//console.log(count);
		if(count >= $scope.l) return true;
		//console.log("neg diagonal check failed!");

		//if all checks failed
		return false;
	}

	$scope.turn = function(elm, row, col){	

		//if div has been chosen before, skip
		if (!isVerified(row, col)) return;

		$scope.grid[row].col[col] = $scope.currentPlayer; //mark value with player number
		
		//console.log($scope.turnCount);

		//if not possible to get a winning sequence yet, skip check
		if ($scope.turnCount < ($scope.n * ($scope.l - 1)) ) {
			console.log("skipping check");
			$scope.turnCount++;
			$scope.currentPlayer = $scope.turnCount % $scope.n + 1
			return;
		}

		console.log($scope.turnCount);

		//main check
		if (hasWon(row, col)) { //player won
			printGrid();
			document.getElementById('end_message').textContent = "Congratulations to Player " + $scope.currentPlayer + "!";
			console.log("A Player has won!");
			$scope.isFin = true;
		}
		else if ($scope.turnCount === Math.pow($scope.m, 2)-1){ //draw
			document.getElementById('end_message').textContent = "It's a draw!";
			console.log("It's a draw!");
			$scope.isFin = true;
		}
		else { //if max number of moves not yet reached, increment
			$scope.turnCount++;
			$scope.currentPlayer = $scope.turnCount % $scope.n + 1;
		}

		return;

		//on win, display turncount % n as winner
		

	}

});