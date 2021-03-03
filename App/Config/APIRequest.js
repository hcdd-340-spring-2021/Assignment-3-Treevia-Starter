import AppConfig from './AppConfig'
import testData from './TestPlantData.json'
const queryString = require('query-string'); //Importing JavaScript library from npm

// this will call the api and return list of objects
const retrieveDataFromAPI = async (endpointurl) => {
  try {
    // console.log("api url: " + endpointurl)
    const response = await fetch(endpointurl)
    let responsejson = await response.json()

    const plants = responsejson.data

    // you can uncomment this line (and comment out lines above)
    // to get test data without making API calls
    // const plants = testdata.data
    const result = [];

    for (const plant of plants) {
      // we want only plants with common names and image url
      if (!plant.common_name || !plant.image_url) continue;

      // if the image url does not ends with .jpg, then append the file extension
      const image_url = plant.image_url.endsWith('.jpg') ? plant.image_url : plant.image_url + '.jpg'
      const http_image_url = image_url.replace(/^https:\/\//i, 'http://')

      const plantobject = {
        scientific_name: plant.scientific_name,
        common_name: plant.common_name,
        family: plant.family,
        genus: plant.genus,
        key: plant.slug,
        image_url: image_url,
        http_image_url: http_image_url,
        url: image_url,
      }
      result.push(plantobject);
    }

    return result;
  } catch (error) {
    console.log(error)
  }
}

//NOTE: you can mess around with what we're returning here to return whatever you want!
const APIRequest = {
  // call the search API
  requestSearchPlants: async (searchTerm) => {
    let parameters = { 'token': AppConfig.apiKey };
    if (searchTerm) {
      parameters.q = searchTerm
    }
    parameters = queryString.stringify(parameters);
    return await retrieveDataFromAPI(AppConfig.plantSearch + '?' + parameters)
  },

  requestPlantList: async (filter) => {
    // call the plant list API
    let parameters = { 'token': AppConfig.apiKey };
    if (filter) {
      parameters.filter = filter
    }
    parameters = queryString.stringify(parameters);
    return await retrieveDataFromAPI(AppConfig.plantList + '?' + parameters)

  },
}
export default APIRequest;
