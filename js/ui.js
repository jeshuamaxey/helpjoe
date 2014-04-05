var ui = ui || {};

var circuit = {
	"gate": "and",
	"inputs": [
		{
			"gate": "input"
		}, {
			"gate": "input"
		}
	]
};

var gateList = ['and', 'nand', 'nor', 'or', 'xnor', 'xor'];


//function called on page load
ui.go = function() {
	//load in lesson
	$.getJSON('lesson.json', function(lessons) {
		var i = Math.floor(Math.random()*lessons.length);
		var lesson = lessons[i];
		ui.startLesson(lesson);
		ui.lessons = lessons;
		ui.lessonIndex = i;
	});
	//
	ui.initCircuit();
	//event listeners
	$('.toggle').on('click', ui.updateCircuit);
	$('.toggle').on('dblclick', function(e){e.preventDefault(); console.log('dclk')});
	$('.gate-img').on('click', ui.nextGate);
	$('.next-lesson').on('click', ui.nextLesson);
}

ui.nextLesson = function () {
	ui.lessonIndex = (ui.lessonIndex + 1) % ui.lessons.length;
	ui.startLesson(ui.lessons[ui.lessonIndex]);
}

ui.startLesson = function (lesson) {
	$('#description').html(lesson.description);
	$('#inputOne .panel-heading').html(lesson.inputs[0]);
	$('#inputTwo .panel-heading').html(lesson.inputs[1]);
	$('#output .panel-heading').html(lesson.output);
}

//
ui.initCircuit = function() {
	$('.data').html(0);

	$('.panel').removeClass('panel-success').addClass('panel-danger');
	$('#gate .panel').removeClass('panel-danger');

	var $svg = $('svg path');
	$svg.each(function(i, el) {
		console.log(el)
		el.classList.remove('one');
		el.classList.remove('zero');
		el.classList.add('zero');
	});
};

ui.nextGate = function () {
	var currentGateIndex = parseInt($('#gate[data-gate-index]').attr('data-gate-index')),
	  newGateIndex = (currentGateIndex + 1) % gateList.length,
	  newGate = gateList[newGateIndex];

	$('.gate-img img').attr('src', 'gates/' + newGate + '.svg');
	$('.gate-name').text(newGate);
	$('[data-gate-index]').attr('data-gate-index', newGateIndex);

	circuit.gate = newGate;

	// var inputs = [parseInt($($('.toggle')[0]).html()) == 0 ? false : true, parseInt($($('.toggle')[1]).html()) == 0 ? false : true];
	// var ans = evalLogic(circuit, inputs);

	// $('.gate .data:nth-of-type(3)').html(ans ? 1 : 0);

	ui.evalCircuit();
};

ui.updateCircuit = function(e) {
	e.preventDefault();
	var $this = $(this);
	//get the new binary value (stored as bool)
	var bit = !parseInt($this.html());
	//change this value in the UI
	$this.html(bit ? 1 : 0);
	var index = $this.data('mirror-index');
	$('.gate .data:nth-of-type('+ index +')').html(bit ? 1 : 0)
	//update panel colour
	$this.parent().parent().toggleClass('panel-danger panel-success');
	//update path colour
	var $svgIn = $('.' + $this.data('path-class'));
	$svgIn[0].classList.remove('one');
	$svgIn[0].classList.remove('zero');
	$svgIn[0].classList.add(bit ? 'one' : 'zero');

	ui.evalCircuit();
}

ui.evalCircuit = function() {
	//evaluate circuit (sorry future person who has to understand this array creation)
	var inputs = [parseInt($($('.toggle')[0]).html()) == 0 ? false : true, parseInt($($('.toggle')[1]).html()) == 0 ? false : true];
	var ans = evalLogic(circuit, inputs);

	//update result part of ui
	$('.gate .data:nth-of-type(3)').html(ans ? 1 : 0);
	$('.output .data').html(ans ? 1 : 0);

	var $svgOut = $('.third');
	$svgOut[0].classList.remove('one');
	$svgOut[0].classList.remove('zero');
	$svgOut[0].classList.add(ans ? 'one' : 'zero');

	$('.output').removeClass('panel-danger panel-success');
	$('.output').addClass(ans ? 'panel-success' : 'panel-danger');
}

//must go last
$(document).ready(ui.go);