// Native HTML validation runs before this submit event.
document.getElementById('request-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const result = document.getElementById('form-result');
  result.hidden = false;
  result.focus();
});