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
});