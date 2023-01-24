const dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/config/.env' });

const form = document.getElementById("form");
const input = document.querySelector("input");
const linkWrapper = document.querySelector(".link-wrapper");
const shortenedLink = document.querySelector(".short-link");

const submitUrl = async () => {
	let url = document.querySelector("#url").value;
	const response = await fetch("")

	if (response.type == "failure") {
		input.style.border = "2px solid red";
	}

	if (response.type == "success") {
		linkWrapper.style.opacity = 1;
		linkWrapper.style.scale = 1;
		linkWrapper.style.display = "flex";
		shortenedLink.textContent = response.message;
	}
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	submitUrl();
})