import axiosConfig from "../helpers/axiosConfig";

export const getSuggestedLocations = async (query) => {
  try {
    const { data } = await axiosConfig.get("/autocomplete", {
      query,
    });
    if (data) return data;

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getGeocoding = async (street, city, county, country) => {
  try {
    const response = await axiosConfig.get("/geocode", {
      street,
      city,
      county,
      country,
    });
    if (response) return response;

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
