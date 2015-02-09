var express = require('express')
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.sendfile('main/index.html')
})

app.get('/css/bootstrap.css', function(request, response) {
  response.sendfile('main/css/bootstrap.css')
})

app.get('/css/bootstrap.min.css', function(request, response) {
  response.sendfile('main/css/bootstrap.min.css')
})

app.get('/css/bootstrap-theme.css', function(request, response) {
  response.sendfile('main/css/bootstrap-theme.css')
})

app.get('/css/bootstrap-theme.min.css', function(request, response) {
  response.sendfile('main/css/bootstrap-theme.min.css')
})

app.get('/fonts/glyphicons-halflings-regular', function(request, response) {
  response.sendfile('main/fonts/glyphicons-halflings-regular')
})

app.get('/fonts/glyphicons-halflings-regular.woff', function(request, response) {
  response.sendfile('main/fonts/glyphicons-halflings-regular.woff')
})

app.get('/js/bootstrap.js', function(request, response) {
  response.sendfile('main/js/bootstrap.js')
})

app.get('js/d3tooltip.js', function(request, response) {
  response.sendfile('main/js/d3tooltip.js')
})


app.get('/js/bootstrap.min.js', function(request, response) {
  response.sendfile('main/js/bootstrap.min.js')
})

app.get('/js/pathView.js', function(request, response) {
  response.sendfile('main/js/pathView.js')
})

app.get('/data/alliances.json', function(request, response) {
  response.sendfile('main/data/alliances.json')
})

app.get('/data/detailedAlliances.json', function(request, response) {
  response.sendfile('main/data/detailedAlliances.json')
})

app.get('/data/allianceCountBetweenCompanies.json', function(request, response) {
  response.sendfile('main/data/allianceCountBetweenCompanies.json')
})

app.get('/js/d3/d3.js', function(request, response) {
  response.sendfile('main/js/d3/d3.js')
})

//new code:
app.get('/test2.html', function(request, response) {
  response.sendfile('main/test2.html')
})

app.get('/scatter.html', function(request, response) {
  response.sendfile('main/scatter.html')
})

app.get('/data/companies.json', function(request, response) {
  response.sendfile('main/data/companies.json')
})

app.get('/data/companies_old.json', function(request, response) {
  response.sendfile('main/data/companies_old.json')
})

app.get('/font-awesome/css/font-awesome.min.css', function(request, response) {
  response.sendfile('main/font-awesome/css/font-awesome.min.css')
})

app.get('/ionicons/css/ionicons.min.css', function(request, response) {
  response.sendfile('main/ionicons/css/ionicons.min.css')
})

app.get('/styles.css', function(request, response) {
  response.sendfile('main/styles.css')
})

app.get('/foundation-icons/foundation-icons.css', function(request, response) {
  response.sendfile('main/foundation-icons/foundation-icons.css')
})

app.get('/script.js', function(request, response) {
  response.sendfile('main/script.js')
})

app.get('/js/scatternet.js', function(request, response) {
  response.sendfile('main/js/scatternet.js')
})

app.get('/js/classie.js', function(request, response) {
  response.sendfile('main/js/classie.js')
})

app.get('/js/mlpushmenu.js', function(request, response) {
  response.sendfile('main/js/mlpushmenu.js')
})

app.get('/foundation-icons/foundation-icons.woff', function(request, response) {
  response.sendfile('main/foundation-icons/foundation-icons.woff')
})

app.get('/images/pattern.png', function(request, response) {
  response.sendfile('main/images/pattern.png')
})

app.get('/images/icon_minus.png', function(request, response) {
  response.sendfile('main/images/icon_minus.png')
})

app.get('/images/icon_plus.png', function(request, response) {
  response.sendfile('main/images/icon_plus.png')
})

app.get('/font-awesome/fonts/fontawesome-webfont.ttf', function(request, response) {
  response.sendfile('main/font-awesome/fonts/fontawesome-webfont.ttf')
})

app.get('/font-awesome/fonts/fontawesome-webfont.woff', function(request, response) {
  response.sendfile('main/font-awesome/fonts/fontawesome-webfont.woff')
})

app.get('/foundation-icons/foundation-icons.tff', function(request, response) {
  response.sendfile('main/foundation-icons/foundation-icons.tff')
})

app.get('/testpath.html', function(request, response) {
  response.sendfile('main/testpath.html')
})

app.get('/js/pathViewNew.js', function(request, response) {
  response.sendfile('main/js/pathViewNew.js')
})

app.get('/js/testPathView.js', function(request, response) {
  response.sendfile('main/js/testPathView.js')
})

app.get('/js/scatternet_test.js', function(request, response) {
  response.sendfile('main/js/scatternet_test.js')
})

app.get('/js/anotherPathView.js', function(request, response) {
  response.sendfile('main/js/anotherPathView.js')
})

app.get('/scatter2.html', function(request, response) {
  response.sendfile('main/scatter2.html')
})

app.get('/js/new.js', function(request, response) {
  response.sendfile('main/js/new.js')
})

app.get('/js/new1.js', function(request, response) {
  response.sendfile('main/js/new1.js')
})

app.get('/new.html', function(request, response) {
  response.sendfile('main/new.html')
})

app.get('/css/jquery-ui.min.css', function(request, response) {
  response.sendfile('main/css/jquery-ui.min.css')
})

app.get('/js/jquery.js', function(request, response) {
  response.sendfile('main/js/jquery.js')
})

app.get('/js/jquery-ui.min.js', function(request, response) {
  response.sendfile('main/js/jquery-ui.min.js')
})


app.get('/js/jquery-1.11.2.min.js', function(request, response) {
  response.sendfile('main/js/jquery-1.11.2.min.js')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})