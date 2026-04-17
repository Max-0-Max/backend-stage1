export const getAgeGroup = (age) => {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
};

export const getTopCountry = (countries) => {
  return countries.reduce((max, curr) =>
    curr.probability > max.probability ? curr : max
  );
};

export const validateExternalData = ({ gender, age, nation }) => {
  if (!gender.gender || gender.count === 0) {
    throw { status: 502, message: "Genderize returned an invalid response" };
  }

  if (age.age === null) {
    throw { status: 502, message: "Agify returned an invalid response" };
  }

  if (!nation.country || nation.country.length === 0) {
    throw { status: 502, message: "Nationalize returned an invalid response" };
  }
};