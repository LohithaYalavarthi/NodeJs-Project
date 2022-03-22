console.log("client side javascript file loaded");
const buttonId = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

buttonId.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value;
  messageOne.textContent = "Loading";
  fetch(`http://localhost:3000/weather?address=${location}`).then(
    (response) => {
      response.json().then((data) => {
        if (data.error) {
          console.log(data.error);
          messageOne.innerHTML = data.error;
        } else {
          messageOne.innerHTML = data.location;
          messageTwo.innerHTML = data.forecast;
        }
      });
    }
  );
});
