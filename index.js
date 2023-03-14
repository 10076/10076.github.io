var button = document.getElementById("reload-button");
button.addEventListener("click", function () {
	window.jinrishici.loadSentence();
});
!(function (window) {
	// 定义一些变量和函数
	var token = "jinrishici-token";
	var jinrishici = {};

	// 定义加载函数，根据本地存储中是否有token来发送不同的请求
	jinrishici.load = function (callback) {
		if (window.localStorage && window.localStorage.getItem(token)) {
			sendRequest(
				callback,
				"https://v2.jinrishici.com/one.json?client=browser-sdk/1.2&X-User-Token=" +
					encodeURIComponent(window.localStorage.getItem(token))
			);
		} else {
			sendRequest(function (data) {
				window.localStorage.setItem(token, data.token);
				callback(data);
			}, "https://v2.jinrishici.com/one.json?client=browser-sdk/1.2");
		}
	};

	// 获取诗词内容并加载到页面上
	jinrishici.loadSentence = function () {
		jinrishici.load(function (data) {
			console.log(data.data);
			var titleElement = document.getElementById("poetry-title");
			var authorElement = document.getElementById("poetry-dynasty-author");
			if (titleElement) {
				titleElement.innerText = data.data.origin.title;
			}
			if (authorElement) {
				authorElement.innerText =
					data.data.origin.dynasty + " : " + data.data.origin.author;
			}
			var contentElement = document.getElementById("poetry-content");
			if (contentElement) {
				var texts = data.data.origin.content;
				contentElement.innerHTML = texts.join("<br>");
			}
		});
	};

	// 发送请求并处理响应数据
	function sendRequest(callback, url) {
		var xhr = new XMLHttpRequest();
		xhr.open("get", url);
		xhr.withCredentials = true;
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === "success") {
					callback(response);
				} else {
					console.error(
						"今日诗词API加载失败，错误原因：" + response.errMessage
					);
				}
			}
		};
	}

	// 将对象暴露给window
	window.jinrishici = jinrishici;
})(window);
