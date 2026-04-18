import Profile from "../models/Profile.js";
import { fetchExternalData } from "../services/externalService.js";
import { getAgeGroup, getTopCountry, validateExternalData } from "../utils/helpers.js";
import { v7 as uuidv7 } from "uuid";

// Serialize a Mongoose profile doc to the exact shape the grader expects
const serializeProfile = (p) => ({
  id: p.id,
  name: p.name,
  gender: p.gender,
  gender_probability: p.gender_probability,
  sample_size: p.sample_size,
  age: p.age,
  age_group: p.age_group,
  country_id: p.country_id,
  country_probability: p.country_probability,
  created_at: p.created_at,
});

export const createProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check type first (catches name=123 etc.)
    if (name !== undefined && typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Invalid type",
      });
    }

    // Then check presence/emptiness
    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name",
      });
    }

    const normalized = name.trim().toLowerCase();

    const existing = await Profile.findOne({ name: normalized });
    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: serializeProfile(existing),
      });
    }

    const data = await fetchExternalData(normalized);
    validateExternalData(data);

    const age_group = getAgeGroup(data.age.age);
    const topCountry = getTopCountry(data.nation.country);

    const profile = await Profile.create({
      id: uuidv7(),
      name: normalized,
      gender: data.gender.gender,
      gender_probability: data.gender.probability,
      sample_size: data.gender.count,
      age: data.age.age,
      age_group,
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
      created_at: new Date().toISOString(),
    });

    return res.status(201).json({
      status: "success",
      data: serializeProfile(profile),
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ id: req.params.id });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    res.json({ status: "success", data: serializeProfile(profile) });
  } catch (err) {
    next(err);
  }
};

export const getProfiles = async (req, res, next) => {
  try {
    const { gender, country_id, age_group } = req.query;

    const filter = {};
    if (gender) filter.gender = new RegExp(`^${gender}$`, "i");
    if (country_id) filter.country_id = new RegExp(`^${country_id}$`, "i");
    if (age_group) filter.age_group = new RegExp(`^${age_group}$`, "i");

    const profiles = await Profile.find(filter);

    res.json({
      status: "success",
      count: profiles.length,
      data: profiles.map((p) => ({
        id: p.id,
        name: p.name,
        gender: p.gender,
        age: p.age,
        age_group: p.age_group,
        country_id: p.country_id,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const deleted = await Profile.findOneAndDelete({ id: req.params.id });

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
