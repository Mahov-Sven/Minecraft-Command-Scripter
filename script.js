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
	spanLast.addClass("codeText");
	spanLast.text($("#Code").text());
	$("#Code").empty();
	$("#Code").append(spanLast);
	
	const keys = [];
	
	$("#Code").keyup((e) => {
		const c = e.which || e.keyCode;
		keys[c] = false;
		e.preventDefault();
	});
	
	$("#Code").keydown((e) => {
		const c = e.which || e.keyCode;
		keys[c] = true;
		e.preventDefault();
		console.log(c);
		handleKey(c);
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
	
	function handleKey(key){
		const shift = keys[16];
		const control = keys[17];
		if(control && key === 82) location.reload();
		switch(key){
			case 8: removeChar(); break;// Case Backspace
			case 32: appendChar(' '); break;// Case Space
			case 65:case 66:case 67:case 68:case 69:case 70:case 71:case 72:case 73:
			case 74:case 75:case 76:case 77:case 78:case 79:case 80:case 81:case 81:
			case 81:case 83:case 84:case 85:case 86:case 87:case 88:case 89:case 90:
				// Case Alphabet
				if(!shift) appendChar(baseAlphaChars[key - 65]);
				else appendChar(shiftAlphaChars[key - 65]);
				break;
			
		}
		//else appendChar(String.fromCharCode(key));
	}
	
	function removeChar(){
		$("#CodeEdit").text($("#CodeEdit").text().slice(0, -1));
	}
	
	function appendChar(c){
		$("#CodeEdit").text($("#CodeEdit").text() + c);
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