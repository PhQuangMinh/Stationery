fetch('../component/header.html') 
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
});

fetch('../component/footer.html') 
    .then(response => response.text())
    .then(data => {
      if (document.getElementById('footer-container')!=null){
        document.getElementById('footer-container').innerHTML = data;
      }
});