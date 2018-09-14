$(document).ready(()=>{
	$("#ProjectExplorer").resizable({
		handles: "e",
		minWidth: 0
	});

	$("#CommandBox").hide();
	$("#RightDivider").click(() => {
		$("#CodeBox").toggle();
		$("#CommandBox").toggle();
		$("#RightDividerArrow").toggleClass("arrowLeft");
		$("#RightDividerArrow").toggleClass("arrowRight");
	});

	const spanLast = span();
	spanLast.attr("id", "CodeEdit");
	$("#Code").empty();
	$("#Code").append(spanLast);

	let controlActive = false;

	$("#Code").keydown((e) => {
		const keyCode = e.which || e.keyCode;
		console.log(keyCode);
		if(keyCode === 17) controlActive = true;
		handleKey(keyCode, e.key, e);
	});

	$("#Code").keyup((e) => {
		const keyCode = e.which || e.keyCode;
		if(keyCode === 17) controlActive = false;
	});

	const baseAlphaChars =
		[
		'a','b','c','d','e','f','g','h','i','j','k','l','m',
		'n','o','p','q','r','s','t','u','v','w','x','y','z'
		];
	const shiftAlphaChars =
		[
		'A','B','C','D','E','F','G','H','I','J','K','L','M',
		'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
		];

	function handleKey(keyCode, key, event){
		switch(keyCode){
			case 8: removeChar(); break;// Case Backspace
			case 9: appendChar('\t'); event.preventDefault(); break;
			case 13: appendChar('\n'); break;
			case 16: case 17: case 20: break;
			default: appendChar(key); break;
		}
	}

	function removeChar(){
		//$("#CodeEdit").text($("#CodeEdit").text().slice(0, -1));
		$("#CodeEdit").children().last().remove();
	}

	function appendChar(c){
		const newElem = span().text(c);
		$("#CodeEdit").append(newElem);
		//$("#CodeEdit").text($("#CodeEdit").text() + c);
	}

	function between(numb, min, max){
		return min <= numb && numb <= max;
	}

	function span(){
		return $("<span>");
	}

	function div(){
		return $("<div>");
	}
});
