var tpl = { "cache": {} };

tpl.evaluate = function (tmpl_name, tmpl_data) {
  var that = this;

  if (! that.cache[tmpl_name]) {
    var tmpl_dir = 'templates';
    var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

    var tmpl_string;
    $.ajax({
      'url': tmpl_url,
      'method': 'GET',
      'async': false,
      'success': function (data) {
        tmpl_string = data;
      }
    });

    that.cache[tmpl_name] = _.template(tmpl_string);
  }

  return that.cache[tmpl_name](tmpl_data);
};
