import axios from "axios";

export const fetchExternalData = async (name) => {
  const [gender, age, nation] = await Promise.all([
    axios.get(`https://api.genderize.io?name=${name}`),
    axios.get(`https://api.agify.io?name=${name}`),
    axios.get(`https://api.nationalize.io?name=${name}`)
  ]);

  return {
    gender: gender.data,
    age: age.data,
    nation: nation.data
  };
};