const R = require('ramda');

// modules
const { photoUpload } = require("../modules/photo");
const { getDatesInRange } = require("../modules/dates");

// schema
const User = require("../models/user");

const addUser = async (request_body, file) => {
    try {
        const isUsedEmail = await User.findOne({ email: request_body.email });

        if(isUsedEmail) throw new Error("This email is already used!");

        let profile;

        if(file) {
            profile = await photoUpload(file);
        }

        const user = await User.create({
            ...request_body,
            profile
        });

        return user;
    } catch(e) {
        throw (e);
    }
};

const getUserById = async (user_id) => {
    try {
        const user = await User.findById(user_id);

        if(!user) throw new Error("User not found!");

        return user;
    } catch(e) {
        throw (e);
    }
};

const editUser = async (request_body, user_id, file) => {
    try {
        const edits = Object.keys(request_body);
        
        const user = await User.findById(user_id);
        
        if(!user) throw new Error("User not found!");

        if(file) {
            const profile = await photoUpload(file);

            user.profile = profile;
        }

        edits.forEach( edit => user[edit] = request_body[edit] );

        await user.save();

        return user;
    } catch(e) {
        throw (e);
    }
};

const deleteUser = async (user_id) => {
    try {
        const user = await User.findById(user_id);

        if(!user) throw new Error("User not found!");

        await user.remove();

        return user;
    } catch(e) {
        throw (e);
    }
}

const getAllUsers = async () => {
    try {
        const users = await User.aggregate([
            {
                $sort: { createdAt: -1 }
            }
        ]);

        return users;
    } catch(e) {
        throw (e);
    }
};

const getAllEmployees = async () => {
    try {
        const users = await User.aggregate([
            {
                $match: {
                    role: { $ne: "Patient" }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        
        return users;
    } catch(e) {
        throw(e);
    }
};

const getUsersByRole = async (role) => {
    try {
        const users = await User.aggregate([
            {
                $match: { role }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        return users;
    } catch(e) {
        throw (e);
    }
};

const getPatientsByDate = async (start_date, end_date) => {
    try {
        // const days = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ];

        const dates = getDatesInRange(start_date, end_date);

        start_date = new Date(start_date);
        end_date = new Date(end_date);
        end_date.setHours(23, 59);

        const data = await User.aggregate([
            {
                $match: {
                    role: "Patient",
                    createdAt: {
                        $gt: start_date,
                        $lt: end_date
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateToString: {
                            format: '%m-%d-%Y',
                            date: '$createdAt'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$date",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = R.compose(
            R.mergeRight( R.zipObj( dates, new Array(7).fill(0) ) ),
            R.mergeAll,
            R.map( ({ _id, count }) => ({ [_id]: count }) ),
        );

        return result(data);
    } catch(e) {
        throw (e);
    }
};

const getStaffsByDate = async (start_date, end_date) => {
    try {
        const data = await User.aggregate([
            {
                $match: {
                    role: { $ne: 'Patient' },
                    createdAt: {
                        $gte: new Date(start_date),
                        $lte: new Date(end_date)
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    role: 1
                }
            },
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const result = R.compose(
            R.mergeAll,
            R.map( ({_id, count}) => ({ [_id]: count }) )
        );

        return result(data);
    } catch(e) {
        throw (e);
    }
};

const getUsersByNameAndRole = async (name, role) => {
    try {
        if( name.indexOf("\\") > -1 ) return [];

        const users = await User.aggregate([
            {
                $match: {
                    $and: [
                        {
                            name: {
                                $regex: name,
                                $options: 'i'
                            }
                        },
                        {
                            role
                        }
                    ]
                }
            }
        ]);

        return users;
    } catch(e) {
        throw (e);
    }
};

const getStaffsByName = async (name) => {
    try {
        if( name.indexOf("\\") > -1 ) return [];

        let users = await User.aggregate([
            {
                $match: {
                    name: {
                        $regex: name,
                        $options: 'i'
                    },
                    role: { $ne: "Patient"}
                }
            }
        ]);

        users = users.filter( user => user.role !== "Patient" );

        return users;
    } catch(e) {
        throw(e);
    }
};

const getDoctorByEmail = async (email) => {
    try {
        const doctor = await User.findOne({ email });

        if(!doctor || doctor.role !== "Doctor" ) throw new Error("Doctor not found!");

        return doctor;
    } catch(e) {
        throw (e);
    }
};

const getPatientByEmail = async (email) => {
    try {
        const patient = await User.findOne({ email });

        if(!patient || patient.role !== "Patient" ) throw new Error("Patient not found!");

        return patient;
    } catch(e) {
        throw (e);
    }
};

module.exports = {
    addUser,
    getUserById,
    editUser,
    deleteUser,
    getAllUsers,
    getUsersByRole,
    getPatientsByDate,
    getStaffsByDate,
    getUsersByNameAndRole,
    getStaffsByName,
    getAllEmployees,
    getDoctorByEmail,
    getPatientByEmail,
};