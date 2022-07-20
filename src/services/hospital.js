// modules
const { photoUpload } = require("../modules/photo");

// schema
const Hospital = require("../models/hospital");

const createHospitalProfile = async (hospital_data, file) => {
    try {
        const isUsed = await Hospital.findOne({ email: hospital_data.email });

        if (isUsed) throw new Error("This email is already used!");

        if(file) {
            const profile = await photoUpload(file);

            const hospital = await new Hospital({
                ...hospital_data,
                profile
            });

            await hospital.save();

            return hospital;
        } else {
            const hospital = await new Hospital({
                ...hospital_data
            });

            await hospital.save();

            const token = await authToken(hospital);

            return { hospital, token };
        }
    } catch(e) {
        throw (e);
    }
};

const editProfile = async ( hospital, requestBody, file ) => {
    try {
        const edits = Object.keys(requestBody);

        if(file) {
            const profile = await photoUpload(file);

            hospital.profile = profile;
        }
        
        edits.forEach(  edit => hospital[edit] = requestBody[edit] );
        
        await hospital.save();

        return hospital;
    } catch(e) {
        throw (e);
    }
}

module.exports = {
    createHospitalProfile,
    editProfile,
};