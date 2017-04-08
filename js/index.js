
$( "#title1" ).click(function() {
  $("#content1").slideToggle();
});
$( "#title2" ).click(function() {
  $("#content2").slideToggle();
});
$( "#title3" ).click(function() {
  $("#content3").slideToggle();
});

$('.timeline').timelify({
			animLeft: "fadeInLeft",
		animCenter: "fadeInUp",
		animRight: "fadeInRight",
		animSpeed: 600,
		offset: 150
	});