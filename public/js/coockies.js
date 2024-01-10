const cookieBox = document.querySelector(".coockies"),
  buttons = document.querySelectorAll(".cookies-btn");

const executeCodes = () => {
  if (document.cookie.includes("iPlayTV")) return;
  cookieBox.classList.add("show");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      cookieBox.classList.remove("show");

      
      if (button.id == "acceptBtn") {
        document.cookie = "cookieBy= iPlayTV; max-age=" + 60 * 60 * 24 * 30;
      }
    });
  });
};


window.addEventListener("load", executeCodes);