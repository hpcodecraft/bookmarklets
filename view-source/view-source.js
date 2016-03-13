(function() {
	var urlPrefix = 'view-source:',
      title = document.querySelector('title'),
      lineNumbers = document.querySelector('.webkit-line-gutter-backdrop');
  if(title === null && lineNumbers) history.back();
  else document.location.href = urlPrefix + document.location.href;
})();
