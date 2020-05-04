var interval;

//GameObjects
var timeline;
var steps;
var bpm;
var vol;


//Variables
var playing = false;
var timePos = 0;

var boxWidth;

var currentStep = 0;
var maxStep;
var currentBPM;

var currentVol = 50;

var tunes;

var array;
var noisePath = ["drum", "clap", "tss", "boom", "hit", "tss2", "tsschu", "empty_can", "maracas", "tick"];


//Tools
var lineTool = false;
var colTool = false;



function start() {
	timeline = document.getElementById("line");
	steps = document.getElementById("steps");
	bpm = document.getElementById("bpm");
	vol = document.getElementById("volume");

	maxStep = steps.value;

	tunes = $('.titleCount').length;

	setStep();
	setBPM();
	setVolume();
}

function playButton() {
	if(playing) {
		document.getElementById("play").innerHTML = "play_arrow";
		pauseInterval();
	} else {
		document.getElementById("play").innerHTML = "pause";
		startInterval();
	}

	playing = !playing;
}


//PRIVATE FUNCTION:
function startInterval() {
	interval = setInterval(tick, 20);
}

//PRIVATE FUNCTION:
function pauseInterval() {
	clearInterval(interval);
}


function tick() {
	timePos += 1/50 * 36 * (currentBPM / 60);
	// timePos = 15;

	if(timePos >= 36 * currentStep + 16) {
		console.log(currentStep);
		playRow();
		currentStep += 1;
	}

	if(timePos >= boxWidth) {
		timePos = 0;
		currentStep = 0;
	}

	timeline.style.left = timePos + 'px';
}

function playRow() {

	for(var i = 0; i < tunes; i++) {
		if(array[i][currentStep] == 1) {
			//console.log("STEP:"+ (currentStep-1) +", ROW: " + i);

			var audio = new Audio("noise/" + noisePath[i] + ".mp3");
			audio.volume = currentVol/100;
			audio.play();
		}
	}
}

//PUBLIC: Detects when an input is used (step/bpm/vol)
function inputOnChange(type) {
	switch(type) 
	{
		case "STEP":
			if(steps.value != maxStep && steps.value > 0) {
				document.getElementById("stepUpdate").classList.remove("hidden");
			} else {
				document.getElementById("stepUpdate").classList.add("hidden");
			}			
			break;

		case "BPM":
			if(bpm.value != currentBPM && bpm.value > 0) {
				document.getElementById("bpmUpdate").classList.remove("hidden");
			} else {
				document.getElementById("bpmUpdate").classList.add("hidden");
			}
			break;

		case "VOL":
			if(vol.value != currentVol && vol.value > 0) {
				if(vol.value > 100) {
					vol.value = 100;
				}
				document.getElementById("volUpdate").classList.remove("hidden");
			} else {
				document.getElementById("volUpdate").classList.add("hidden");
			}
			break;
	}
}


function setStep() {

	//Create new sized array:
	var newArray = new Array(tunes);
	for(var i = 0; i < tunes; i++) {
		newArray[i] = new Array(Number(steps.value));
	}

	//Save previous selected steps:
	if(array != null) {
		for(var row = 0; row < tunes; row++) {
			for(var step = 0; step < maxStep; step++) {
				if(step > steps.value) {
					continue;
				}

				newArray[row][step] = array[row][step];
			}
		}
	}

	array = newArray;


	maxStep = steps.value;
	$(".row").html("");

	

	for(var row = 0; row < tunes; row++) {
		for(var step = 0; step < maxStep; step++) {
			$label = $('<label class="container">');

			if(array[row][step] == 1) {
				$label.append('<input type="checkbox" name="t" id="R'+ row + 'S' + step + '" class="cbox" checked="checked"onchange="checkBox('+ row +','+ step +')">');
			} else {
				$label.append('<input type="checkbox" name="t" id="R'+ row + 'S' + step + '" class="cbox" onchange="checkBox('+ row +','+ step +')">');				
			}
			$label.append('<span class="checkmark"></span>');

			$("#row" + row).append($label);
		}
	}

	boxWidth = document.getElementById("row0").offsetWidth;
	inputOnChange("STEP");
}


function setBPM() {
	currentBPM = Number(bpm.value);
	inputOnChange("BPM");
}


function setVolume() {
	currentVol = Number(vol.value);
	inputOnChange("VOL");
}

function checkBox(row, col) {
	if(lineTool) {
		for(var step = 0; step < maxStep; step++) {
			if(array[row][step] == 0 || array[row][step] == null) {
				array[row][step] = 1;
				$("#R" + row + "S" + step).prop("checked", true);
			} else {
				array[row][step] = 0;
				$("#R" + row + "S" + step).prop("checked", false);				
			}
		}
	}

	if(colTool) {
		for(var row = 0; row < tunes; row++) {
			if(array[row][col] == 0 || array[row][col] == null) {
				array[row][col] = 1;
				$("#R" + row + "S" + col).prop("checked", true);
			} else {
				array[row][col] = 0;
				$("#R" + row + "S" + col).prop("checked", false);				
			}
		}
	}


	if(lineTool || colTool) {
		return;
	}

	if(array[row][col] == null || array[row][col] == 0) {
		array[row][col] = 1;
	} else {
		array[row][col] = 0;
	}
	
}


function clearBeat() {
	for(var row = 0; row < array.length; row++) {
		for(var step = 0; step < maxStep; step++) {
			array[row][step] = 0;

		}
	}

	$(".cbox").prop('checked', false);
}


function randomBeat() {
	clearBeat();

	for(var row = 0; row < array.length; row++) {
		for(var step = 0; step < maxStep; step++) {
			var t = Math.floor((Math.random() * 100));
			console.log(t);
			if(t <= 25) {
				array[row][step] = 1;
				$("#R" + row + "S" + step).prop("checked", true);
			}

		}
	}	
}


//PUBLIC: Detects player keyboard input (body)
function buttonPress(event) {
	var key = event.which || event.keyCode;

	//SPACEBAR
	if(key == 32) {
		playButton();
	}
}


function activateTool(tool) {
	var tempString;
	var tempBool;

	switch(tool) {
		case "LINE":
			lineTool = !lineTool
			tempString = "line";
			tempBool = lineTool;
			break;

		case "COL":
			colTool = !colTool;
			tempString = "col";
			tempBool = colTool;		
			break;
	}

	if(tempBool) {
		$("#"+ tempString +"_tool").attr('src', 'img/'+ tempString +'_tool_active.png');
	} else {
		$("#"+ tempString +"_tool").attr('src', 'img/'+ tempString +'_tool.png');
	}
}