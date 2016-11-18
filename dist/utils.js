const get = require('simple-get');

exports.Request = options => {
  if (!options || !options.url) throw new Error('Invalid parameters');
  if (!/^https?:\/\//i.test(options.url)) {
    options.url = 'http://' + options.url;
  }
  return new Promise((resolve, reject) => {
    get.concat(options, (err, res, data) => {
      if (err) return reject(err);
      return resolve({
        data,
        statusCode: res.statusCode
      });
    });
  });
};