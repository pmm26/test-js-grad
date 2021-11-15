/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

const axios = require('axios');

module.exports = async function oldestPackageName() {
  const response = await axios.post(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    },
  );

  const packages = response.data.content;

  packages.sort((a, b) => {
    var dateA = new Date(a.package.date).getTime();
    var dateB = new Date(b.package.date).getTime();
    return dateA > dateB ? 1 : -1;
  });

  return packages[0].package.name;
};
