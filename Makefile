build:
	zip dist/passport-extension images/img-16.png images/white-img-16.png images/dfa-logo-80.png popup/* content.js service.js manifest.json

clean:
	rm -f dist/passport-extension.zip
