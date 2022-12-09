let buttonAnimationTimeout = null;

$(function () {
	let form = document.getElementById("login-form");
	form.addEventListener("submit", signUp, true);
});

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

async function signUp(event) {
	event.preventDefault();
	const configuration = await getConfig();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	$.post('/user/login', {
		username, password
	}).done(function () {
		const params = new URLSearchParams({
			response_type: "code",
			client_id: configuration.oauth.clientId,
			redirect_uri: configuration.oauth.redirectUri,
			state: uuidv4()
		});
		window.location = `/oauth/authorize?${params.toString()}`
	}).fail(function () {
		if (buttonAnimationTimeout) {
			clearTimeout(buttonAnimationTimeout);
		}
		const submit = document.getElementById("submit");
		submit.classList.add("shake");
		submit.value = "Invalid Login";
		buttonAnimationTimeout = setTimeout(function () {
			submit.classList.remove("shake");
			submit.value = "Login";
		}, 2000);
	});
}