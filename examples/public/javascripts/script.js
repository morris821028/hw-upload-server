$(document).ready(function() {
  
  var showInfo = function(message) {
    $('#upload-info').text(message);
      setTimeout(function() {location.reload();}, 5000);
  };
  $('input[type="submit"]').on('click', function(evt) {
    evt.preventDefault();
    var formData = new FormData();
    var file = document.getElementById('myFile').files[0];
    formData.append('myFile', file);

    var xhr = new XMLHttpRequest();
    
    xhr.open('POST', '/', true);
    
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        console.log(percentage);
        $('.progress-bar').css('width', percentage + '%');
      }
    };
    
    xhr.onerror = function(e) {
      showInfo('An error occurred while submitting the form. Maybe your file is too big');
    };
    
    xhr.onload = function() {
      showInfo(this.statusText);
    };
    
    xhr.send(formData);
    
  });
  
});