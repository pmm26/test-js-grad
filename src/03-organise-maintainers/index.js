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
 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

const axios = require('axios');

module.exports = async function organiseMaintainers() {
  const response = await axios.post(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    },
  );

  const packages = response.data.content;
  const maintainers = [];

  // For Each Package
  await packages.forEach(pack => {
    // For each maintainer
    pack.package.maintainers.forEach(maintainer => {
      // // Is current maintainer the maintainers list?
      let currentMaintainers = maintainers.filter(
        item => item.username === maintainer.username,
      );

      if (currentMaintainers.length === 0) {
        // Not in the list add him
        maintainers.push({
          username: maintainer.username,
          packageNames: [pack.package.name],
        });
      } else {
        // He is in the list, add the package to his list
        currentMaintainers[0].packageNames.push(pack.package.name);
        // Sort packages
        currentMaintainers[0].packageNames.sort();
      }
    });
  });

  // Sort maintainers
  maintainers.sort((a, b) => a.username.localeCompare(b.username));
  return maintainers;
};
