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

	//Scope Variables
	$scope.isInit = false;
	$scope.isFin = false;
	$scope.turnCount = 0;
	$scope.currentPlayer = 1;
	$scope.grid = []; //2D array for grid
	$scope.icons = []; //store player icons
	$scope.n = 2; //num of players
	$scope.m = 3; //grid len
	$scope.l = 3; //win len

	//Image Src Array
	var fruits = ["apple", "apple2", "avocado", "banana",  
		"cherry", "grapes", "kiwi", "lemon", 
		"melon", "orange", "peach", "pear", "pineapple", 
		"strawberry", "tomato", "watermelon" ];
	

	//Watch functions
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
        	$scope.grid.push(new Array());
        	for(var j=0; j<$scope.m; j++){
        		$scope.grid[i].push({img:"", player:0});
       		}
        	//console.log($scope.grid);
        }
        
        
	});

	//Functions
	var printGrid = function(){
		var printStr;
		for (var r=0; r<$scope.grid.length; r++){
			printStr = "";
			for (var c=0; c<$scope.grid.length; c++){
				printStr += $scope.grid[r][c].player + " ";
			}
			console.log(printStr);
		}
	}

	var printIconGrid = function(){
		var icons = document.querySelectorAll('.fruit');
		for(var i=0; i<icons.length; i++){
			console.log(icons[i].src); //dynamic div width based on m
		}
	}

	var isVerified = function(row, col){
		//verifies that pos is available to be used

		if($scope.grid[row][col].player > 0){
			//exists, is in use
			return false;
		}
		else {
			//0, aka not taken
			return true;
		}
	}

	var hasWon = function(r, c){
		//check for l in a row

		//check vertical
		var count = 1;
		for(var i=r-1; i>=0; i--){//check above
			//console.log("checking row " + i + " w/ val " + $scope.grid[i][c]);
			if ($scope.grid[i][c].player === $scope.currentPlayer) count++;
			else break;
		}
		for(var i=r+1; i<$scope.m; i++){//check below
			if ($scope.grid[i][c].player === $scope.currentPlayer) count++;
			else break;
		}
		//console.log(count);
		if(count >= $scope.l) return true;
		//console.log("vertical check failed!");

		
		//check horizontal
		var count = 1;
		for(var i=c-1; i>=0; i--){//check left
			if ($scope.grid[r][i].player === $scope.currentPlayer) count++;
			else break;
		}
		for(var i=c+1; i<$scope.m; i++){//check right
			if ($scope.grid[r][i].player === $scope.currentPlayer) count++;
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
			//console.log("UR checking row " + i + " and col" + col + " w/ val " + $scope.grid[i][col]);
			if (col >= $scope.m) break; //if col is out of range
			if ($scope.grid[i][col].player === $scope.currentPlayer) count++;
			else break;	
			//console.log("new count is "+count);
		}
		for(var i=r+1; i<$scope.m; i++){//check lower left
			//col number to check is equal to c + (r - i)
			var col = c+r-i;
			//console.log("LL checking row " + i + " and col" + col + " w/ val " + $scope.grid[i][col]);
			if (col < 0) break; //if col is out of range
			if ($scope.grid[i][col].player === $scope.currentPlayer) count++;
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
			//console.log("UL checking row " + i + " and col" + col + " w/ val " + $scope.grid[i][col]);
			if (col < 0) break; //if col is out of range
			if ($scope.grid[i][col].player === $scope.currentPlayer) count++;
			else break;	
			//console.log("new count is "+count);
		}
		for(var i=r+1; i<$scope.m; i++){//check lower right
			//col number to check is equal to c - (r - i)
			var col = c-r+i;
			console.log("LR checking row " + i + " and col" + col + " w/ val " + $scope.grid[i][col]);
			if (col >= $scope.m) break; //if col is out of range
			if ($scope.grid[i][col].player === $scope.currentPlayer) count++;
			else break; //if blank or !match then stop count
			//console.log("new count is "+count);
		}
		//console.log(count);
		if(count >= $scope.l) return true;
		//console.log("neg diagonal check failed!");

		//if all checks failed
		return false;
	}

	//Scope Functions
	$scope.start = function(){

		//input validation
		if($scope.n < 2){
			alert("Please make sure the number of players is at least 2.");
			return;
		} 
		if($scope.m < 3){
			alert("Please make sure the grid length is at least 3.");
			return;
		} 
		if($scope.l < 2){
			alert("Please make sure the win condition is at least 3.");
			return;
		} 
		if($scope.l > $scope.m){
			alert("Please make sure the win condition is less than or equal to the grid length.");
			return;
		}

		//set custom gridbox width
		var boxes = document.querySelectorAll('.gridbox');
		for(var i=0; i<boxes.length; i++){
			if(i<$scope.m)	boxes[i].style.borderTop = "none";
			if(i>boxes.length - $scope.m -1) boxes[i].style.borderBottom = "none";
			if(i % $scope.m === 0) boxes[i].style.borderLeft = "none";
			if(i % $scope.m === $scope.m-1) boxes[i].style.borderRight = "none";

			boxes[i].style.width = 100 / $scope.m + "%"; //dynamic div width based on m
		}

		//assign random image for each player
		for(var i=0; i<$scope.n; i++){
			var fruitIndex = Math.round(Math.random() * (fruits.length-1)); //to select random image
			console.log(fruitIndex);
			$scope.icons.push("png/" + fruits[fruitIndex] + ".png");
			fruits.splice(fruitIndex, fruitIndex+1); //remove from array to prevent repeats
		}

		$scope.isInit = true;
	
	} 


	$scope.turn = function(row, col){	

		if($scope.isFin) return;

		//if div has been chosen before, skip
		if (!isVerified(row, col)) return;

		$scope.grid[row][col].player = $scope.currentPlayer; //mark value with player number
		$scope.grid[row][col].img = $scope.icons[$scope.currentPlayer-1]; //store src

		//if not possible to get a winning sequence yet, skip check
		if ($scope.turnCount < ($scope.n * ($scope.l - 1)) ) {
			$scope.turnCount++;
			$scope.currentPlayer = $scope.turnCount % $scope.n + 1
			return;
		}

		//main check
		if (hasWon(row, col)) { //player won
			document.getElementById('end_message').textContent = "Congratulations to Player " + $scope.currentPlayer + "!";
			document.getElementById('gameover').style.opacity = "0.9";
			$scope.isFin = true;
		}
		else if ($scope.turnCount === Math.pow($scope.m, 2)-1){ //draw
			document.getElementById('end_message').textContent = "It's a draw!";
			document.getElementById('gameover').style.opacity = "0.9";
			$scope.isFin = true;
		}
		else { //if max number of moves not yet reached, increment
			$scope.turnCount++;
			$scope.currentPlayer = $scope.turnCount % $scope.n + 1;
		}

		return;
		

	}
	

});