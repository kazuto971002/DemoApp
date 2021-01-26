/*jslint es6:true*/

var modelHasLoaded = false;
var model = undefined;

cocoSsd.load().then(function (loadedModel) {
	model = loadedModel;
	modelHasLoaded = true;
});

$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $('#selected-image').attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

$("#image-selector-ob").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $('#selected-image-ob').attr("src", dataURL);
        $("#prediction-list-ob").empty();
    }
    let file = $("#image-selector-ob").prop('files')[0];
	reader.readAsDataURL(file);
	
	if (document.getElementById("innerSquare")) {
		console.log("hahaha");
		removeElement();
	}

});

function removeElement() {
	document.querySelectorAll('#innerSquare').forEach(e => e.remove());
	document.querySelectorAll('#inner').forEach(e => e.remove());
}

function imageClassify() {
	const img = document.getElementById('selected-image');

  	// Load the model.
  	mobilenet.load().then(modelmobile => {
    	// Classify the image.
    	modelmobile.classify(img).then(predictions => {
			var result = document.getElementById("prediction-result");
			var temp = "";
			temp += "Predictions: \n";
		  	for (let x = 0; x < predictions.length; x++) {
				temp += (x+1) + ". " + predictions[x].className + "\n";
				temp += predictions[x].probability * 100 + "\n";
				temp += "\n";
			}
			result.innerText = temp;  
    	});
  	});
}

function objectDetection() {
	if (!modelHasLoaded) {
		return;
	}

	const img = document.getElementById('selected-image-ob');

	model.detect(img).then(function (predictions) {
		var result = document.getElementById("prediction-result-ob");
		var temp = "";
		temp += "Predictions: \n";

		for (let x = 0; x < predictions.length; x++) {
			temp += (x+1) + ". " + predictions[x].class +
			' - with ' +
			Math.round(parseFloat(predictions[x].score) * 100) +
			'% confidence.' + "\n";

			const innerSquare = document.createElement('div');
			innerSquare.setAttribute('id', 'innerSquare');
			innerSquare.style =
				'left: ' +
				predictions[x].bbox[0] +
				'px; top: ' +
				predictions[x].bbox[1] +
				'px; width: ' +
				predictions[x].bbox[2] +
				'px; height: ' +
				predictions[x].bbox[3] +
				'px;';

			const p = document.createElement('p');
			p.setAttribute('id', 'inner');	
			p.innerText = (x+1) + ".";
				p.style =
				'margin-left: ' +
				predictions[x].bbox[0] +
				'px; margin-top: ' +
				(predictions[x].bbox[1] - 3) +
				'px; width: ' +
				(predictions[x].bbox[2] - 3) +
				'px; top: 0; left: 0;';

			img.parentNode.appendChild(innerSquare);
			img.parentNode.appendChild(p);
			result.innerText = temp;
		}
	});
}