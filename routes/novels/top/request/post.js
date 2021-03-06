var request = require('request');
var cheerio = require('cheerio');
var models = require('scraping/models');

module.exports = function(req, res, next) {
  var url;
  var result = {};

  if (req.body.ncode) {
    url = 'http://ncode.syosetu.com/' + req.body.ncode + '/';
  }

  if (url) {
    var requested_at = new Date();

    request({url: url}, function(error, response, body) {
      // Async
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        result['url'] = response.request.href;
        result['title'] = $('title').text();
        result['requested_at'] = requested_at;
        result['responded_at'] = new Date();
        console.log(result);

        var model = new models.NovelsTopRequest(req.session.id);
        model.store(result);

      } else {
        console.log('--------------------------------------------------');
        if (error && 'code' in error) {
          console.log('Error Code:' + error.code);
        }
        if (error && 'errno' in error) {
          console.log('Error No:' + error.errno);
        }
        if (error && 'syscall' in error) {
          console.log('Error Syscall:' + error.syscall);
        }
        if (response && 'statusCode' in response) {
          console.log('Status Code:' +  response.statusCode);
        }
      }
    });
  }

  res.render('novels/top/request', { data: { params: req.body, page: result } });
};

