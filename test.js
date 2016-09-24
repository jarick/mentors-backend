
navigator.serviceWorker.register(() => {}).then(function(req) {
	req.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
		console.log(sub.endpoint);
	})
})